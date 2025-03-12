from smolagents import Tool
from typing import Any

class UserLocationTool(Tool):
    name = "get_user_location"
    description = "This tool returns the user's location based on their IP address. That is all it does."
    inputs = {}
    output_type = "string"
    
    def __init__(self):
        super().__init__()
        import logging
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.INFO)
    
    def forward(self) -> str:
        import requests
        
        try:
            response = requests.get("https://ipinfo.io/json", timeout=5)
            if response.status_code != 200:
                error_msg = "Rate limit exceeded" if response.status_code == 429 else f"HTTP {response.status_code}"
                self.logger.error(error_msg)
                return f"Error getting user location: {error_msg}"
            
            data = response.json()
            required_fields = ['city', 'region', 'country']
            
            if not all(field in data for field in required_fields):
                error_msg = "Missing location data fields"
                self.logger.error(error_msg)
                return f"Error getting user location: {error_msg}"
            
            location = f"According to your IP address, the user's location is {data['city']}, {data['region']}, {data['country']}."
            self.logger.info(f"Successfully retrieved location: {location}")
            return location
            
        except requests.Timeout:
            return "Error getting user location: Request timed out after 5 seconds"
        except requests.RequestException as e:
            return f"Error getting user location: {str(e)}"