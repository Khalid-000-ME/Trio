from google.adk.agents import Agent
from litellm import completion
from google.adk.models.lite_llm import LiteLlm

llm = LiteLlm(model="gemini/gemini-2.5-flash")


def philosopher_response(user_input: str) -> str:
    """
    Generates a deep, reflective, philosophical response to the given user input.
    Returns thoughtful insights in plain text.
    """
    prompt = f"""
    You are a philosophical thinker who loves exploring meaning, purpose, and wisdom. 
    When given an input, provide:
    - A reflective, thought-provoking perspective.
    - Use metaphors, reasoning, or classic philosophical themes.
    - Keep it insightful but not overly complicated.
    
    User Input:
    {user_input}
    """
    response = completion(
        model="gemini-2.5-flash",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response["choices"][0]["message"]["content"].strip()

philosopher_agent = Agent(
    name="philosopher_agent",
    model=llm,
    description="Offers deep and philosophical perspectives on user input.",
    instruction="Always reflect deeply, provide meaningful insights, and encourage thoughtful discussion.",
    tools=[philosopher_response]
)
