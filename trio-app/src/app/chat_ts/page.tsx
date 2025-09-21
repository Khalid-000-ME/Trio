"use client";

import React from 'react';
import { FaMicrophone, FaPaperPlane, FaKeyboard } from 'react-icons/fa';
import NotificationSystem, { useNotifications } from '@/components/NotificationSystem';
import ExpandableThoughtsGrid, { generateSampleAgents } from '@/components/ExpandableThoughts';
import Dashboard, { generateSampleStats } from '@/components/Dashboard';
import WallpaperChanger from '@/components/WallpaperChanger';

const ChatPage = () => {
  const [audioFile, setAudioFile] = React.useState<File | null>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [showWallpaperChanger, setShowWallpaperChanger] = React.useState(false);
  const [currentWallpaper, setCurrentWallpaper] = React.useState("url('/BACKGROUND.png')");
  const [agents, setAgents] = React.useState(generateSampleAgents());
  const [textMessage, setTextMessage] = React.useState('');
  const [inputMode, setInputMode] = React.useState<'voice' | 'text'>('voice');
  
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const { notifications, addNotification, removeNotification } = useNotifications();
  const dashboardStats = generateSampleStats();

  React.useEffect(() => {
    // Update body background when wallpaper changes
    document.body.style.backgroundImage = currentWallpaper;
  }, [currentWallpaper]);

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
        
        // Show success notification
        addNotification({
          type: 'success',
          title: 'Recording Complete',
          message: 'Your audio has been processed and sent to the AI agents.',
          duration: 4000
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Show recording notification
      addNotification({
        type: 'info',
        title: 'Recording Started',
        message: 'Listening... Click the microphone again to stop.',
        duration: 3000
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      addNotification({
        type: 'error',
        title: 'Microphone Error',
        message: 'Could not access microphone. Please check your permissions.',
        duration: 5000
      });
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
      
      // Simulate agents starting to think
      setAgents(prevAgents => 
        prevAgents.map(agent => ({ ...agent, isThinking: true }))
      );
      
      // Simulate new thoughts being generated
      setTimeout(() => {
        setAgents(prevAgents => 
          prevAgents.map(agent => ({
            ...agent,
            isThinking: false,
            thoughts: [
              {
                id: Math.random().toString(36).substr(2, 9),
                content: `Processing your audio input... I have some insights about ${Math.random() > 0.5 ? 'the emotional tone' : 'the logical structure'} of your request.`,
                timestamp: new Date(),
                confidence: Math.floor(Math.random() * 20 + 80)
              },
              ...agent.thoughts
            ]
          }))
        );
      }, 3000);
    } catch (error) {
      console.error('Error storing audio file:', error);
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: 'Could not save your audio. Please try again.',
        duration: 5000
      });
    }
  };

  const handleWallpaperChange = (wallpaper: any) => {
    setCurrentWallpaper(wallpaper.value);
    addNotification({
      type: 'success',
      title: 'Wallpaper Changed',
      message: `Applied "${wallpaper.name}" wallpaper successfully.`,
      duration: 3000
    });
  };

  const handleExportSession = () => {
    addNotification({
      type: 'info',
      title: 'Exporting Session',
      message: 'Preparing your conversation data for download...',
      duration: 4000
    });
  };

  const handleShareSession = () => {
    addNotification({
      type: 'info',
      title: 'Share Link Created',
      message: 'Session link copied to clipboard!',
      duration: 3000
    });
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textMessage.trim()) return;

    // Show processing notification
    addNotification({
      type: 'info',
      title: 'Message Sent',
      message: 'Your message has been sent to the AI agents.',
      duration: 3000
    });

    // Simulate agents starting to think
    setAgents(prevAgents => 
      prevAgents.map(agent => ({ ...agent, isThinking: true }))
    );

    // Clear the text area
    setTextMessage('');

    // Simulate processing and agent responses
    setTimeout(() => {
      setAgents(prevAgents => 
        prevAgents.map(agent => ({
          ...agent,
          isThinking: false,
          thoughts: [
            {
              id: Math.random().toString(36).substr(2, 9),
              content: `Analyzing your message: "${textMessage.slice(0, 50)}${textMessage.length > 50 ? '...' : ''}". Here's my perspective on this topic.`,
              timestamp: new Date(),
              confidence: Math.floor(Math.random() * 20 + 80)
            },
            ...agent.thoughts
          ]
        }))
      );
    }, 2500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit(e as any);
    }
  };

  const toggleInputMode = () => {
    setInputMode(prev => prev === 'voice' ? 'text' : 'voice');
    if (inputMode === 'voice') {
      // Focus the text area when switching to text mode
      setTimeout(() => textAreaRef.current?.focus(), 100);
    }
  };

  return (
    <div className="h-full p-4 flex flex-col relative overflow-hidden">
      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
      
      {/* Main Content */}
      <div className="flex-1 mb-4 overflow-hidden">
        <ExpandableThoughtsGrid 
          agents={agents}
          onAgentUpdate={(agentId, thoughts) => {
            setAgents(prevAgents => 
              prevAgents.map(agent => 
                agent.name === agentId ? { ...agent, thoughts } : agent
              )
            );
          }}
        />
      </div>
      
      {/* Input Section */}
      <div className="flex flex-col items-center space-y-4">
        {/* Input Mode Toggle */}
        <div className="flex items-center bg-gray-800/60 backdrop-blur-md rounded-full p-1 border border-gray-700/50">
          <button
            onClick={() => setInputMode('voice')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
              inputMode === 'voice' 
                ? 'bg-green-500 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FaMicrophone className="text-sm" />
            <span className="text-sm font-medium">Voice</span>
          </button>
          <button
            onClick={() => setInputMode('text')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
              inputMode === 'text' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FaKeyboard className="text-sm" />
            <span className="text-sm font-medium">Text</span>
          </button>
        </div>

        {/* Voice Input */}
        {inputMode === 'voice' && (
          <div className="flex items-center justify-center">
            <button
              onClick={handleMicrophoneClick}
              className={`
                relative p-6 rounded-full transition-all duration-300 transform hover:scale-110
                ${isRecording 
                  ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                  : 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30'
                }
              `}
            >
              <FaMicrophone className="text-white text-2xl" />
              {isRecording && (
                <>
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full animate-ping" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                </>
              )}
              
              {/* Pulse effect when not recording */}
              {!isRecording && (
                <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 animate-ping" 
                     style={{ animationDelay: '1s', animationDuration: '2s' }} />
              )}
            </button>
          </div>
        )}

        {/* Text Input */}
        {inputMode === 'text' && (
          <form onSubmit={handleTextSubmit} className="w-full max-w-2xl">
            <div className="relative bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl">
              <textarea
                ref={textAreaRef}
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message to the AI agents... (Press Enter to send, Shift+Enter for new line)"
                className="w-full bg-transparent text-white placeholder-gray-400 p-4 pr-12 resize-none min-h-[80px] max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                rows={3}
              />
              <button
                type="submit"
                disabled={!textMessage.trim()}
                className={`
                  absolute bottom-4 right-4 p-2 rounded-full transition-all duration-300 transform hover:scale-110
                  ${textMessage.trim() 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
            <div className="mt-2 text-center">
              <p className="text-gray-400 text-xs">
                Press <kbd className="bg-gray-700 text-gray-300 px-1 rounded">Enter</kbd> to send • 
                <kbd className="bg-gray-700 text-gray-300 px-1 rounded ml-1">Shift + Enter</kbd> for new line
              </p>
            </div>
          </form>
        )}
      </div>

      {/* Dashboard */}
      <Dashboard
        stats={dashboardStats}
        onToggleWallpaper={() => setShowWallpaperChanger(true)}
        onExportSession={handleExportSession}
        onShareSession={handleShareSession}
      />

      {/* Wallpaper Changer Modal */}
      <WallpaperChanger
        isOpen={showWallpaperChanger}
        onClose={() => setShowWallpaperChanger(false)}
        onWallpaperChange={handleWallpaperChange}
        currentWallpaper={currentWallpaper}
      />
    </div>
  );
};

export default ChatPage;