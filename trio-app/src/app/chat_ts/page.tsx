"use client";

import React from 'react';
import { FaMicrophone } from 'react-icons/fa';

const ChatPage = () => {
  const [audioFile, setAudioFile] = React.useState<File | null>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
      const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
      setAudioFile(audioFile);
      await storeAudioFile(audioFile);
      stream.getTracks().forEach(track => track.stop());
    };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleMicrophoneClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Store the audio as an mp3 file in the public folder
  const storeAudioFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/store-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to store audio file');
      }

      const data = await response.json();
      console.log('Audio file stored successfully:', data);
    } catch (error) {
      console.error('Error storing audio file:', error);
    }
  };

  return (
    <div className="h-screen p-6 flex flex-col">
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-10">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-gray-800 rounded-[50px] flex items-center justify-center min-h-[50px]">
            <div className="w-24 h-24 bg-blue-500 rounded-full"></div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center mt-6">
        <button
          onClick={handleMicrophoneClick}
          className={`relative p-6 rounded-full transition-all duration-200 ${
            isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          <FaMicrophone className="text-white text-2xl" />
          {isRecording && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatPage;