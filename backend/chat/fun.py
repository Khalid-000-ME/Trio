from google.adk.agents import Agent
from litellm import completion
from google.adk.models.lite_llm import LiteLlm

llm = LiteLlm(model="gemini/gemini-2.5-flash")

def generate_funny_response(user_input: str) -> str:
    """
    Generates a lighthearted, humorous response to the given user input.
    Returns a plain text funny response.
    """
    prompt = f"""
    You are a fun-loving, witty person who always responds playfully. 
    The user will ask you something. Your job:
    - Reply with a humorous, uplifting, or funny twist.
    - Keep it short and natural, like a joke or witty remark.
    
    User Input:
    {user_input}
    """
    
    response = completion(
        model="gemini-2.5-flash",
        messages=[{"role": "user", "content": prompt}]
    )
    
    funny_reply = response["choices"][0]["message"]["content"]
    return funny_reply.strip()

fun_agent = Agent(
    name="fun_agent",
    model=llm,
    description="Creates funny, witty, and playful responses to user input.",
    instruction="Always make the user smile with humor, jokes, or playful remarks.",
    tools=[generate_funny_response]
)
