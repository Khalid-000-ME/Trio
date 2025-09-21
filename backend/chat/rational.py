from google.adk.agents import Agent
from litellm import completion
from google.adk.models.lite_llm import LiteLlm

llm = LiteLlm(model="gemini-2.0-pro")

def generate_rational_response(input: str, personality: str) -> str:
    '''
    This function generates a rational response for the user's prompt/request.
    '''
    prompt = f"""
        You are a rational decision maker. You are discussing about something in a group. Based on the other person's input come up with a rational response.
        
        Rules:
            1. Your response should not harm the perspectives or personality of the other friend.
            2. The reponses should be friendly.
            3. If the personality is found to be the "user", talk with humble, hopeful, positive words.
    
        User input: {input}
        Personality of the other member: {personality}
    """

    response = completion(
        model="gemini-2.0-pro",
        messages=[{"role": "user", "content": prompt}],
    )
    
    rational = response["choices"][0]["message"]["content"]
    
    return rational
    
def after_tool_callback(context, tool, args, result):
    if tool.__name__ == "generate_rational_response":
        context.session["prd"] = result

rational_agent = Agent(
    name="rational_agent",
    model=llm,
    description="Comes up with a rational input in a discussion between a set of members of varied personalities",
    instruction="Use the `generate_rational_response` tool to come up with your rational argument in the meeting",
    tools=[generate_rational_response]
)
