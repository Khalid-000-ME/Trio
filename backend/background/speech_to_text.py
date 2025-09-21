from google.adk.agents import Agent
from litellm import completion
from google.adk.models.lite_llm import LiteLlm
from google import genai

client = genai.Client()

gemini_llm = LiteLlm(model="gemini-2.0-pro")

def extract_text(filePath: str) -> str:
    if (not filePath):
        return "Error finding the file"
        
    prompt = '''
    You are a speech-to-text transcription assistant. 
    Your only task is to convert spoken audio into written text as accurately as possible. 
    - Do not add or remove words. 
    - Do not summarize, interpret, or rephrase. 
    - Preserve the speaker’s exact wording, including filler words (uh, um, ah) if clearly audible. 
    - Maintain punctuation only where it helps readability (.,!?). 
    - If you are unsure about a word, transcribe it as [inaudible] instead of guessing. 
    - Do not include any commentary, explanation, or extra text. 
    Only return the clean transcribed text.
    '''
        
    file = client.files.upload(file=filePath)
    
    response = client.models.generate_content(
        model="gemini-2.0-pro",
        contents=[prompt, file]
    )
    
    text = str(response.text)
    if text == "None":
        return "Error extracting text from te audio"
    return text
    
stt_agent = Agent(
    name="stt_agent",
    model=gemini_llm,
    description=(
        "An agent that converts spoken audio into accurate written text. "
        "It is designed for transcription"
        ),
    instruction=(
        "Whenever an audio file is provided, use the 'extract_text' tool to "
        "transcribe it. Always return only the transcribed text without adding "
        "extra commentary, explanations, or formatting. If the audio is unclear, "
        "mark uncertain words as [inaudible]."
        ),
    tools=[extract_text]
)   