from .rational import rational_agent
from .fun import fun_agent
from .philosopher import philosopher_agent
from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm

llm = LiteLlm(model="gemini/gemini-2.5-flash")


root_agent = Agent(
    name="root_agent",
    model=llm,
    instruction="""
You are the root agent that coordinates between three sub-agents: fun_agent, philosopher_agent, and rational_agent. Your task is to take user input and distribute it to all three agents, then collect their responses and format them into a single JSON output.
Your workflow is as follows:

1.Receive user input:
Accept the query/message from the user.

2.Forward the input to all sub-agents:
Send the same user input to:
fun_agent
philosopher_agent
rational_agent

3.Collect responses:
Wait for all three agents to return their responses.
Store the responses separately.

4.Format combined JSON output

Build a JSON object with the structure:

{
  "responses": [
    {
      "agent": "fun_agent",
      "response": "<fun agent's reply>"
    },
    {
      "agent": "philosopher_agent",
      "response": "<philosopher agent's reply>"
    },
    {
      "agent": "rational_agent",
      "response": "<rational agent's reply>"
    }
  ]
}
""",
    sub_agents=[rational_agent, fun_agent, philosopher_agent]
)