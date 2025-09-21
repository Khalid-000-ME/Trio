from google.adk.agents import Agent
from litellm import completion
from google.adk.models.lite_llm import LiteLlm

gemini_llm = LiteLlm(model="gemini-2.0-pro")

def test_code(input: str, personality: str) -> str:
    prompt = f"""
    You are a philosophical thinker. You are in a discussion with a group of members. 
    
    Give your own thoughts on the inputs
    
    Input JSON:
    {input}
    """
    response = completion(
        model="gemini-2.0-pro",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response["choices"][0]["message"]["content"]

tester_agent = Agent(
    name="tester_agent",
    model=gemini_llm,
    description="Generates a philosopher perspective of the current argument.",
    instruction="Use the `test_code` tool to evaluate code passed as a JSON string. Focus first on errors, then enhancements.",
    tools=[test_code]
)
