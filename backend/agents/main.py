from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from .background.root import root_agent as background_agent
from .chat.root import root_agent as chat_agent
import asyncio

async def main():
    session_service = InMemorySessionService()
    await session_service.create_session(
        app_name="chat",
        user_id="user1",
        session_id="session1"
    )

    runner1 = Runner(
        app_name="background_agent",
        agent=background_agent,
        session_service=session_service,
    )

    runner2 = Runner(
        app_name="chat_agent",
        agent=chat_agent,
        session_service=session_service,
    )
    # you may need to await runner.run() depending on your usage

asyncio.run(main())