from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from pydantic import BaseModel
import hashlib
import os
import pandas as pd
from config import get_api_token

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

@app.post("/api/v1/chat")
async def chat(message: UserMessage):
    # Return a simple response matching the expected frontend format
    response_message = "Hello! I am an AI assistant. How can I help you today?"
    
    date = datetime.now().isoformat()
    # Create hash from combination of message and date
    hash_input = f"{response_message}{date}".encode('utf-8')
    hash_value = hashlib.sha256(hash_input).hexdigest()

    response = {
        "id": hash_value,
        "date": date,
        "sender": "ai",
        "type": "text",
        "content": {
            "text": response_message
        }
    }

    return response


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

    