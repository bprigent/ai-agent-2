from smolagents import Tool

class FinalAnswerTool(Tool):
    name = "final_answer"
    description = "This tool sends the final answer to the user. This tool does not format the answer. Format the answer before using this tool."
    inputs = {'answer': {'type': 'any', 'description': 'A well formatted and short final answer to the user`s problem.'}}
    output_type = "string"

    def forward(self, answer: str) -> str:
        return answer