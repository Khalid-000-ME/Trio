"use client";

import React, { useState } from 'react';
import { 
  FaChartLine, 
  FaCog, 
  FaUserFriends, 
  FaMicrophone, 
  FaVolumeUp, 
  FaPalette,
  FaHistory,
  FaStar,
  FaBolt,
  FaDownload,
  FaShare,
  FaBars,
  FaTimes,
  FaExpand,
  FaCompress
} from 'react-icons/fa';

interface DashboardStats {
  totalSessions: number;
  averageResponseTime: number;
  userSatisfaction: number;
  activeAgents: number;
  todayUsage: number;
  weeklyGrowth: number;
}

interface DashboardProps {
  stats: DashboardStats;
  isMinimized?: boolean;
  onToggleWallpaper?: () => void;
  onExportSession?: () => void;
  onShareSession?: () => void;
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  color: string;
}> = ({ icon, title, value, subtitle, trend, color }) => (
  <div className={`
    bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md
    rounded-2xl p-6 border border-gray-700/50
    hover:border-gray-600/70 transition-all duration-300
    hover:transform hover:scale-105 shadow-lg hover:shadow-xl
  `}>
    <div className="flex items-center justify-between mb-4">
      <div className={`text-2xl ${color}`}>
        {icon}
      </div>
      {trend && (
        <div className={`text-sm px-2 py-1 rounded-full ${
          trend > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
    <div className="text-white">
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{title}</div>
      {subtitle && (
        <div className="text-gray-500 text-xs mt-1">{subtitle}</div>
      )}
    </div>
  </div>
);

const QuickAction: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}> = ({ icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className={`
      flex flex-col items-center p-4 rounded-xl
      bg-gray-800/60 hover:bg-gray-700/80 
      border border-gray-700/50 hover:border-gray-600/70
      transition-all duration-300 hover:transform hover:scale-105
      group
    `}
  >
    <div className={`text-xl mb-2 ${color} group-hover:scale-110 transition-transform duration-200`}>
      {icon}
    </div>
    <span className="text-white text-sm font-medium">{label}</span>
  </button>
);

const Dashboard: React.FC<DashboardProps> = ({ 
  stats, 
  isMinimized = false, 
  onToggleWallpaper,
  onExportSession,
  onShareSession 
}) => {
  const [isExpanded, setIsExpanded] = useState(!isMinimized);
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'settings'>('overview');

  const quickActions = [
    { icon: <FaPalette />, label: 'Wallpaper', onClick: onToggleWallpaper || (() => {}), color: 'text-purple-400' },
    { icon: <FaDownload />, label: 'Export', onClick: onExportSession || (() => {}), color: 'text-blue-400' },
    { icon: <FaShare />, label: 'Share', onClick: onShareSession || (() => {}), color: 'text-green-400' },
    { icon: <FaCog />, label: 'Settings', onClick: () => setActiveTab('settings'), color: 'text-gray-400' },
  ];

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gray-800/90 backdrop-blur-md rounded-full p-4 border border-gray-700/50
                     hover:bg-gray-700/90 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <FaBars className="text-white text-xl" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-96">
      {/* Main Dashboard Panel */}
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <h2 className="text-white font-semibold text-lg">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaCompress />
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-700/50">
          {['overview', 'agents', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`
                flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200
                ${activeTab === tab 
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10' 
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Key Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon={<FaUserFriends />}
                  title="Sessions Today"
                  value={stats.todayUsage}
                  color="text-blue-400"
                  trend={stats.weeklyGrowth}
                />
                <StatCard
                  icon={<FaBolt />}
                  title="Avg Response"
                  value={`${stats.averageResponseTime}ms`}
                  color="text-yellow-400"
                />
                <StatCard
                  icon={<FaStar />}
                  title="Satisfaction"
                  value={`${stats.userSatisfaction}%`}
                  color="text-green-400"
                />
                <StatCard
                  icon={<FaChartLine />}
                  title="Active Agents"
                  value={stats.activeAgents}
                  color="text-purple-400"
                />
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-white font-medium mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <QuickAction key={index} {...action} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="space-y-4">
              <h3 className="text-white font-medium">Agent Status</h3>
              {['Philosopher', 'Rationalist', 'Fun Guy', 'Empath'].map((agent, index) => (
                <div key={agent} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-white">{agent}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Active</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-white font-medium">Settings</h3>
              
              {/* Voice Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Microphone</span>
                  <div className="flex items-center space-x-2">
                    <FaMicrophone className="text-blue-400" />
                    <input type="range" className="w-20" min="0" max="100" defaultValue="80" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Volume</span>
                  <div className="flex items-center space-x-2">
                    <FaVolumeUp className="text-green-400" />
                    <input type="range" className="w-20" min="0" max="100" defaultValue="70" />
                  </div>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="pt-3 border-t border-gray-700/50">
                <span className="text-gray-300 block mb-2">Theme</span>
                <div className="flex space-x-2">
                  {['Auto', 'Light', 'Dark'].map((theme) => (
                    <button
                      key={theme}
                      className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// Sample data generator
export const generateSampleStats = (): DashboardStats => ({
  totalSessions: 1247,
  averageResponseTime: 340,
  userSatisfaction: 94,
  activeAgents: 4,
  todayUsage: 23,
  weeklyGrowth: 12.5,
});