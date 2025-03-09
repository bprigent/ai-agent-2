from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from typing import List, Dict
import json

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model and tokenizer
MODEL_NAME = "facebook/opt-350m"  # You can change this to any other model
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

class Message(BaseModel):
    message: str

class Conversation:
    def __init__(self):
        self.history: List[Dict[str, str]] = []
        self.max_history = 10  # Adjust based on your needs

    def add_message(self, role: str, content: str):
        self.history.append({"role": role, "content": content})
        if len(self.history) > self.max_history:
            self.history = self.history[-self.max_history:]

    def get_context(self) -> str:
        return "\n".join([f"{msg['role']}: {msg['content']}" for msg in self.history])

conversation = Conversation()

@app.post("/chat")
async def chat(message: Message):
    try:
        # Add user message to conversation history
        conversation.add_message("user", message.message)

        # Get conversation context
        context = conversation.get_context()

        # Prepare input for the model
        inputs = tokenizer(context, return_tensors="pt", truncation=True, max_length=512)
        
        # Generate response
        with torch.no_grad():
            outputs = model.generate(
                inputs["input_ids"],
                max_length=200,
                num_return_sequences=1,
                temperature=0.7,
                pad_token_id=tokenizer.eos_token_id
            )

        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Clean up the response to get only the new generated text
        response = response.replace(context, "").strip()
        
        # Add AI response to conversation history
        conversation.add_message("assistant", response)

        return {"response": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/conversation")
async def get_conversation():
    return {"history": conversation.history}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 