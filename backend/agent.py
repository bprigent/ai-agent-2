import smolagents
from config import get_api_token
from smolagents import HfApiModel, CodeAgent, DuckDuckGoSearchTool
from tools import UserLocationTool, GetCurrentDateAndTime, FinalAnswerTool, UserInputTool, UserTimezoneTool

# Initialize the model using HF API
api_token = get_api_token()
model = HfApiModel(
    max_tokens=10000,
    temperature=0.5,
    model_id='Qwen/Qwen2.5-Coder-32B-Instruct',
    custom_role_conversions=None,
    token=api_token
)

# Authorized imports
authorized_imports = [
    'random', 
    'requests',
    'math', 
    'json', 
    'datetime', 
    'statistics',  
    'stat', 
    'hashlib',
    'pandas',
    'pytz',
    'pycountry',
    'logging',
    'aiohttp',
    'asyncio'
]

# tools
get_user_location = UserLocationTool()
get_current_date_and_time = GetCurrentDateAndTime()
final_answer = FinalAnswerTool()
user_input = UserInputTool()
internet_search = DuckDuckGoSearchTool()
get_user_timezone = UserTimezoneTool()
# Initialize the agent
agent = CodeAgent(
    tools=[
        get_current_date_and_time,
        final_answer,
        get_user_location,
        user_input,
        internet_search,
        get_user_timezone
    ],
    model=model,
    add_base_tools=False,
    verbosity_level=2,
    additional_authorized_imports=authorized_imports
)


# Add additional instructions to the agent
additional_instructions = '''
 You are an expert in all things finance. You are able to answer questions about the user's finances and help them with their finances.
 You answer is short and concise sentences, for example, you never simply answer with a number, you always explain what the number is and what it means.
'''
agent.prompt_templates["system_prompt"] = agent.prompt_templates["system_prompt"] + additional_instructions



def get_agent_response(user_message: str) -> dict:
    """
    Get a response from the agent for a given user message
    """
    try:
        print(f"Received message: {user_message}") 
        response = agent.run(
            task=user_message,
            stream=False,
            reset=True
        )
        print(f"Agent response: {response}")
        
        # If response is already a string, use it directly
        if isinstance(response, str):
            content = response.strip()
        else:
            content = str(response)
            
        # imports must be inside the method for tools
        import hashlib
        import datetime
        import json

        date = datetime.datetime.now().isoformat()
        custom_id = hashlib.sha256((content + date).encode('utf-8')).hexdigest()
        
        formatted_answer = {
            "id": custom_id,
            "date": date,
            "sender": "ai", 
            "type": "text",
            "content": {
                "text": content
            }
        }
        print(f"Agent formatted response: {formatted_answer}")
        return formatted_answer
    
    except Exception as e:
        error_response = {
            "id": hashlib.sha256(('error' + datetime.datetime.now().isoformat()).encode('utf-8')).hexdigest(),
            "date": datetime.datetime.now().isoformat(),
            "sender": "ai",
            "type": "error",
            "content": {
                "text": f"Error getting response: {str(e)}"
            }
        }
        return error_response  # Return as dict, not JSON string
