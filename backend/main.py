from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from pydantic import BaseModel
import hashlib

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

@app.get("/health")
async def health_check():
    return {"status": "ok"}

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

    