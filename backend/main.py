from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from .chat.root import root_agent

async def main():
    session_service = InMemorySessionService()
    await session_service.create_session(
        app_name="chat",
        user_id="user1",
        session_id="session1"
    )

    runner = Runner(
        app_name="sdlc_cycle",
        agent=root_agent,
        session_service=session_service,
    )
    # you may need to await runner.run() depending on your usage

asyncio.run(main())