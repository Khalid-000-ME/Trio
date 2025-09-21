from google.ai.agents import Agent  # Fixed import path
from google import genai
from litellm import completion
from typing import Optional
from google.adk.models.lite_llm import LiteLlm

# Initialize clients
client = genai.Client()
gemini_llm = LiteLlm(model="gemini-2.5-flash")

def extract_text(file_path: str) -> str:
    """
    Extract text from an audio file using Gemini Pro model.

    Args:
        file_path (str): Path to the audio file

    Returns:
        str: Transcribed text or error message
    """
    if not file_path:
        return "Error finding the file"

    prompt = '''
    You are a speech-to-text transcription assistant. 
    Your only task is to convert spoken audio into written text as accurately as possible. 
    - Do not add or remove words. 
    - Do not summarize, interpret, or rephrase. 
    - Preserve the speaker's exact wording, including filler words (uh, um, ah) if clearly audible. 
    - Maintain punctuation only where it helps readability (.,!?). 
    - If you are unsure about a word, transcribe it as [inaudible] instead of guessing. 
    - Do not include any commentary, explanation, or extra text. 
    Only return the clean transcribed text.
    '''

    try:
        file = client.files.upload(file=file_path)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt, file]
        )

        text = str(response.text)
        if text == "None":
            return "Error extracting text from the audio"
        return text
    except Exception as e:
        return f"Error processing audio: {str(e)}"

# Initialize the speech-to-text agent
stt_agent = Agent(
    name="stt_agent",
    model=gemini_llm,
    description="An agent that converts spoken audio into accurate written text. "
                "It is designed for transcription",
    instruction="Whenever an audio file is provided, use the 'extract_text' tool to "
                "transcribe it. Always return only the transcribed text without adding "
                "extra commentary, explanations, or formatting. If the audio is unclear, "
                "mark uncertain words as [inaudible].",
    tools=[extract_text]
)