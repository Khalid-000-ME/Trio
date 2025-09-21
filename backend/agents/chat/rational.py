from google.adk.agents import Agent
from litellm import completion
from google.adk.models.lite_llm import LiteLlm

llm = LiteLlm(model="gemini/gemini-2.5-flash")


def generate_rational_response(user_input: str) -> str:
    """
    Generates a logical, balanced, and rational response to the given user input.
    Ensures responses are thoughtful, respectful, and constructive.
    """
    prompt = f"""
    You are a rational decision-maker in a group discussion. 
    Based on the user's input, provide a response that is:
    - Logical, practical, and well-reasoned
    - Respectful of others' perspectives
    - Friendly, humble, and positive
    
    User Input:
    {user_input}
    """
    response = completion(
        model="gemini-2.5-flash",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response["choices"][0]["message"]["content"].strip()

rational_agent = Agent(
    name="rational_agent",
    model=llm,
    description="Provides logical, balanced, and respectful responses in group discussions.",
    instruction="Use the `generate_rational_response` tool to give practical, well-reasoned, and supportive answers.",
    tools=[generate_rational_response]
)
