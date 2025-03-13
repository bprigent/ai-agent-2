from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocketState
from pydantic import BaseModel
import os
import pandas as pd
from agent import get_agent_response


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserMessage(BaseModel):
    message: str

@app.websocket("/api/v1/chat")
async def chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive the message from client
            data = await websocket.receive_json()
            
            # Get response from agent
            response = get_agent_response(data["message"])
            
            # The response is already formatted in agent.py, just send it
            await websocket.send_json(response)
            
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        # Check if the connection is still open before trying to close it
        try:
            if websocket.client_state != WebSocketState.DISCONNECTED:
                await websocket.close()
        except Exception as close_error:
            print(f"Error closing WebSocket: {str(close_error)}")


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