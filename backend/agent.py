import smolagents
from config import get_api_token
from smolagents import HfApiModel, CodeAgent, DuckDuckGoSearchTool
from tools import UserLocationTool, GetCurrentDateAndTime, FinalAnswerTool, UserInputTool, UserTimezoneTool
import hashlib
import datetime
import json


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







########################################################################################
########################################################################################
########################################################################################
# Main function to get the agent's response - always streams
def get_agent_response(user_message: str):
    try:
        # Print for debugging
        print(f"Received message: {user_message}")

        # Get streaming generator directly from agent.run
        steps_generator = agent.run(
            task=user_message,
            stream=True,
            reset=True
        )

        # Return generator that yields formatted steps
        for step_num, step in enumerate(steps_generator):
            # The last step will be the final answer
            is_final = step_num == 0 and not hasattr(step, 'step_number')
            
            if is_final:
                # This is the final answer
                if isinstance(step, str):
                    content = step.strip()
                else:
                    content = str(step)
                    
                date = datetime.datetime.now().isoformat()
                custom_id = hashlib.sha256((content + date).encode('utf-8')).hexdigest()
                
                yield {
                    "id": custom_id,
                    "date": date,
                    "sender": "ai", 
                    "type": "text",
                    "content": {
                        "text": content
                    }
                }
            else:
                # This is an intermediate step
                # Extract relevant information from the step
                step_info = {
                    "step_number": getattr(step, 'step_number', step_num + 1),
                    "action": getattr(step, 'action', None),
                    "action_input": getattr(step, 'action_input', None),
                    "observation": getattr(step, 'observation', None),
                }
                
                date = datetime.datetime.now().isoformat()
                step_id = hashlib.sha256((str(step_info) + date).encode('utf-8')).hexdigest()
                
                # Safely create step_info_short by handling None values
                action = step_info["action"] or ""
                action_input = step_info["action_input"] or ""
                observation = step_info["observation"] or ""
                step_info_short = f"Step: {action} {action_input} {observation}".strip()

                yield {
                    "id": step_id,
                    "date": date,
                    "sender": "ai",
                    "type": "text",
                    "content": {
                        "text": step_info_short
                    }
                }
    
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
        yield error_response
