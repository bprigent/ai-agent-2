from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import pandas as pd
from agent import get_agent_response
import socketio
from typing import Dict, Any

# Create a Socket.IO instance
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=['http://localhost:3000'],
    ping_timeout=60,
    ping_interval=25
)

# Create FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create an ASGI app from Socket.IO and mount it to the FastAPI app
# This is the key change - we're mounting the Socket.IO app at the path /api/v1/socket.io
socket_app = socketio.ASGIApp(
    sio,
    socketio_path='',  # Empty string means use the full path from mount point
    other_asgi_app=app
)



class UserMessage(BaseModel):
    message: str

# Socket.IO event handlers
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def chat_message(sid, data: Dict[str, Any]):
    try:
        message = data.get("message", "")
        
        # Check if streaming is requested (default to True)
        stream_mode = data.get("stream", True)
        
        if stream_mode:
            # Get streaming response generator from agent
            step_generator = get_agent_response(message, stream=True)
            
            # Send each step as it's generated
            for step in step_generator:
                await sio.emit('message', step, room=sid)
        else:
            # Get single response from agent (non-streaming mode)
            response = get_agent_response(message, stream=False)
            
            # Send the response
            await sio.emit('message', response, room=sid)
            
    except Exception as e:
        print(f"Socket.IO error: {str(e)}")
        await sio.emit('error', {"error": str(e)}, room=sid)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/v1/fetch-all-expenses")
async def get_expenses():
    # Get the correct path to the CSV file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, "data_expenses.csv")
    
    # Read the CSV file
    df = pd.read_csv(csv_path)
    
    # Convert dates to datetime
    df['Date'] = pd.to_datetime(df['Date'])
    
    # Sort by date
    df = df.sort_values('Date')
    
    # Convert to list of dictionaries
    expenses = df.to_dict('records')
    
    return {
        "expenses": expenses
    }

@app.get("/api/v1/fetch-budget")
async def get_budget():
    # Get the correct path to the CSV file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, "data_budget.csv")
    
    # Read the CSV file
    df = pd.read_csv(csv_path)
    
    # Convert to list of dictionaries
    budget = df.to_dict('records')
    
    return {
        "budget": budget
    }
# This is important - we need to export the socket_app as the main app
# that will be imported by uvicorn
app = socket_app
