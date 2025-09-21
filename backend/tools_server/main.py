from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import whisper
from google import genai
from pathlib import Path
import os
import uvicorn
from typing import Optional
import wave
from google.genai import types
from google.adk.models.lite_llm import LiteLlm
from litellm import completion


app = FastAPI()

client = genai.Client()
gemini_llm = LiteLlm(model="gemini-2.5-flash")

# Initialize whisper model
model = whisper.load_model("base")

class STTRequest(BaseModel):
    audio_file_path: str

class TTSRequest(BaseModel):
    personality: str
    output_file_path: str
    text: str

@app.post("/stt")
async def speech_to_text(request: STTRequest):
    """
    Extract text from an audio file using Gemini Pro model.

    Args:
        file_path (str): Path to the audio file

    Returns:
        str: Transcribed text or error message
    """

    file_path = request.audio_file_path

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


@app.post("/tts")
async def text_to_speech(request: TTSRequest):
    """
    Convert text into speech using Gemini Pro model.

    Args:
        text (str): Input text to be converted into speech
        output_path (str): Path where the audio file will be saved

    Returns:
        str: Path to the generated speech audio file or error message
    """
    personality = request.personality
    text = request.text
    output_path = request.output_file_path

    if not text:
        return "Error: No input text provided"

    try:
        # Request audio generation
        response = client.models.generate_content(
        model="gemini-2.5-flash-preview-tts",
        contents=f"Say with this personality '{personality}': {text}",
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name='Kore',
                    )
                )
            ),
        )
        )
        # Save the audio file
        data = response.candidates[0].content.parts[0].inline_data.data
        pcm = data

        with wave.open(output_path, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(24000)
            wf.writeframes(pcm)
        
        return output_path
    except Exception as e:
        return f"Error generating speech: {str(e)}"

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)