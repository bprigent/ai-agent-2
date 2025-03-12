from smolagents import Tool
class UserInputTool(Tool):
    name = "user_input"
    description = "Asks for user's input on a specific question. Only use this tool if you have no way of getting the information on your own."
    inputs = {"question": {"type": "string", "description": "The question to ask the user"}}
    output_type = "string"

    def forward(self, question):
        user_input = input(f"{question} => Type your answer here:")
        return user_input