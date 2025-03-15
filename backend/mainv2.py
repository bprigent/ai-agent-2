from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import pandas as pd
import socketio
import asyncio
from typing import Dict, Any
from agent import get_agent_response

# Create a Socket.IO instance with proper configuration
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

# Create a Socket.IO ASGI app and wrap the FastAPI app
# We're setting the socketio_path to match the client's expected path
socket_app = socketio.ASGIApp(
    sio,
    other_asgi_app=app,
    socketio_path='/api/v1/socket.io'  # Ensure the client matches this path
)

class UserMessage(BaseModel):
    message: str

# Socket.IO event handlers
@sio.event
async def connect(sid, environ):
    print(f"🔌 Client connected: {sid}")
    await sio.emit('connection_established', {"status": "connected"}, room=sid)

@sio.event
async def disconnect(sid):
    print(f"❌ Client disconnected: {sid}")





@sio.event
async def chat_message(sid, data: Dict[str, Any]):
    try:
        message = data.get("message", "")
        print(f"📩 Received message from {sid}: {message}")

        # Run response processing in a separate async task
        asyncio.create_task(process_agent_response(sid, message))

    except Exception as e:
        print(f"⚠️ Socket.IO error: {str(e)}")
        await sio.emit('error', {"error": str(e)}, room=sid)

async def process_agent_response(sid, message):
    """Handles streaming messages from the agent."""
    try:
        step_generator = get_agent_response(message)  # This returns a regular generator, not an async generator
        for step in step_generator:  # Use regular for loop instead of async for
            print(f"➡️ Sending step: {step}")
            await sio.emit('message', step, room=sid)

    except Exception as e:
        print(f"⚠️ Error in process_agent_response: {str(e)}")
        await sio.emit('error', {"error": str(e)}, room=sid)


# Debugging event
@sio.event
async def debug(sid, data):
    print(f"🐛 Debug event received from {sid}: {data}")
    await sio.emit('debug_response', {"message": "Debugging works!"}, room=sid)

    


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
