"use client";

import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaBrain, FaLightbulb, FaComment, FaHeart } from 'react-icons/fa';

interface Thought {
  id: string;
  content: string;
  timestamp: Date;
  confidence: number;
}

interface AgentData {
  name: string;
  role: 'Philosopher' | 'Rationalist' | 'Fun Guy' | 'Empath';
  avatar: string;
  color: string;
  thoughts: Thought[];
  isThinking: boolean;
}

interface ExpandableAgentCardProps {
  agent: AgentData;
  isExpanded: boolean;
  onToggle: () => void;
}

const ExpandableAgentCard: React.FC<ExpandableAgentCardProps> = ({ 
  agent, 
  isExpanded, 
  onToggle 
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getRoleIcon = () => {
    switch (agent.role) {
      case 'Philosopher': return <FaBrain className="text-purple-400" />;
      case 'Rationalist': return <FaLightbulb className="text-yellow-400" />;
      case 'Fun Guy': return <FaComment className="text-green-400" />;
      case 'Empath': return <FaHeart className="text-pink-400" />;
    }
  };

  const formatTime = (date: Date) => {
    if (!isClient) {
      // Return a consistent placeholder during SSR
      return '--:--';
    }
    // Use a more consistent format for client-side rendering
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className={`
      relative overflow-hidden rounded-[25px] transition-all duration-500 ease-in-out
      ${isExpanded ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}
      bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md
      border border-gray-700/50 hover:border-gray-600/70
      shadow-xl hover:shadow-2xl
    `}>
      {/* Main Agent Display */}
      <div 
        className={`
          flex items-center justify-center p-6 cursor-pointer
          ${isExpanded ? 'h-32' : 'h-full'}
          transition-all duration-300
        `}
        onClick={onToggle}
      >
        <div className="relative">
          {/* Avatar */}
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center text-2xl
            ${isExpanded ? 'w-20 h-20' : 'w-16 h-16'}
            transition-all duration-300
            bg-gradient-to-r ${agent.color}
          `}>
            {getRoleIcon()}
          </div>
          
          {/* Thinking Indicator */}
          {agent.isThinking && (
            <div className="absolute -top-1 -right-1 w-4 h-4">
              <div className="w-full h-full bg-blue-500 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-full h-full bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        
        {/* Agent Info */}
        <div className={`
          ml-4 ${isExpanded ? 'flex-1' : 'absolute bottom-4 right-6'}
          transition-all duration-300
        `}>
          <h3 className="text-white font-medium text-lg">{agent.name}</h3>
          <p className="text-gray-400 text-sm">{agent.role}</p>
        </div>

        {/* Expand Toggle */}
        <div className={`
          ${isExpanded ? 'ml-4' : 'absolute top-4 right-4'}
          transition-all duration-300
        `}>
          {isExpanded ? (
            <FaChevronUp className="text-gray-400 text-lg" />
          ) : (
            <FaChevronDown className="text-gray-400 text-lg" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="px-6 pb-6">
          <div className="border-t border-gray-700/50 pt-4">
            <h4 className="text-white font-medium mb-3 flex items-center">
              <FaBrain className="mr-2 text-blue-400" />
              Recent Thoughts
            </h4>
            
            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {agent.thoughts.length > 0 ? (
                agent.thoughts.map((thought) => (
                  <div key={thought.id} className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                    <p className="text-gray-300 text-sm mb-2">{thought.content}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">{formatTime(thought.timestamp)}</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-16 bg-gray-600 rounded-full h-1">
                          <div 
                            className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                            style={{ width: `${thought.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">{thought.confidence}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaBrain className="mx-auto text-3xl mb-2 opacity-50" />
                  <p className="text-sm">No thoughts yet...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ExpandableThoughtsGridProps {
  agents: AgentData[];
  onAgentUpdate?: (agentId: string, thoughts: Thought[]) => void;
}

const ExpandableThoughtsGrid: React.FC<ExpandableThoughtsGridProps> = ({ 
  agents, 
  onAgentUpdate 
}) => {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const handleToggleExpand = (agentName: string) => {
    setExpandedAgent(expandedAgent === agentName ? null : agentName);
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full min-h-0 overflow-hidden">
      {agents.map((agent) => (
        <ExpandableAgentCard
          key={agent.name}
          agent={agent}
          isExpanded={expandedAgent === agent.name}
          onToggle={() => handleToggleExpand(agent.name)}
        />
      ))}
    </div>
  );
};

export default ExpandableThoughtsGrid;

// Sample data generator
export const generateSampleAgents = (): AgentData[] => {
  // Use a fixed base time to prevent hydration mismatches
  const baseTime = new Date('2025-09-21T20:30:00');
  
  return [
    {
      name: "Socrates",
      role: "Philosopher",
      avatar: "🧠",
      color: "from-purple-500 to-purple-700",
      isThinking: true,
      thoughts: [
        {
          id: "1",
          content: "The only true wisdom is in knowing you know nothing. Perhaps we should explore the depths of this question further.",
          timestamp: new Date(baseTime.getTime() - 2 * 60 * 1000),
          confidence: 85
        },
        {
          id: "2", 
          content: "What if the nature of reality itself is but a shadow of true forms? This inquiry demands careful examination.",
          timestamp: new Date(baseTime.getTime() - 5 * 60 * 1000),
          confidence: 92
        }
      ]
    },
    {
      name: "Logic",
      role: "Rationalist",
      avatar: "💡",
      color: "from-yellow-500 to-orange-600",
      isThinking: false,
      thoughts: [
        {
          id: "3",
          content: "Based on the available data, the probability of success increases by 34% when we factor in the user's previous interactions.",
          timestamp: new Date(baseTime.getTime() - 1 * 60 * 1000),
          confidence: 96
        }
      ]
    },
    {
      name: "Buddy",
      role: "Fun Guy",
      avatar: "🎉",
      color: "from-green-500 to-blue-500",
      isThinking: true,
      thoughts: [
        {
          id: "4",
          content: "Hey, what if we made this into a game? Everything's more fun with a little competition and some cool rewards!",
          timestamp: new Date(baseTime.getTime() - 30 * 1000),
          confidence: 78
        }
      ]
    },
    {
      name: "Heart",
      role: "Empath",
      avatar: "❤️",
      color: "from-pink-500 to-rose-600",
      isThinking: false,
      thoughts: [
        {
          id: "5",
          content: "I sense some uncertainty in the user's voice. They might need reassurance and a gentle approach to feel more confident.",
          timestamp: new Date(baseTime.getTime() - 3 * 60 * 1000),
          confidence: 89
        }
      ]
    }
  ];
};