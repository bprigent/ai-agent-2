import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API token with a default value of None if not found
HF_API_TOKEN = os.getenv('HF_API_TOKEN')

def get_api_token():
    if HF_API_TOKEN is None:
        raise ValueError("HF_API_TOKEN not found in environment variables. Please check your .env file.")
    return HF_API_TOKEN 