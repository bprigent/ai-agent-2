import smolagents
from config import get_api_token
from smolagents import HfApiModel, CodeAgent, DuckDuckGoSearchTool
from tools import UserLocationTool, GetCurrentDateAndTime, FinalAnswerTool, UserInputTool, UserTimezoneTool
import hashlib
import datetime
import json
import re

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
        date = datetime.datetime.now().isoformat()

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
            # Check if this step contains the final answer
            if getattr(step, "action_output", None) is not None:
                final_answer_text = str(step.action_output).strip()

                final_id = hashlib.sha256((final_answer_text + date).encode('utf-8')).hexdigest()
                yield {
                    "id": final_id,
                    "date": date,
                    "sender": "ai",
                    "type": "text",
                    "content": {
                        "text": final_answer_text
                    }
                }
                return
                
            # Extract meaningful information from intermediate steps
            step_number = getattr(step, 'step_number', step_num + 1)
            thought_process_raw = getattr(step.model_output_message, 'content', "No thought provided.").strip()
            thought_process_cleaned = re.search(r"Thought:\s*(.*?)\s*Code:", thought_process_raw, re.DOTALL)
            if thought_process_cleaned:
                thought_process = thought_process_cleaned.group(1).strip()  # Extract matched text
            else:
                thought_process = thought_process_raw  # Fallback to raw text if no match found

            # Construct readable step info
            step_summary = f"Step {step_number}: {thought_process}".strip()

            step_id = hashlib.sha256((str(step_summary) + date).encode('utf-8')).hexdigest()

            yield {
                "id": step_id,
                "date": date,
                "sender": "ai",
                "type": "text",
                "content": {
                    "text": step_summary
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
