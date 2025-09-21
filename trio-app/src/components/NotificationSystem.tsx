"use client";

import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<{ notification: Notification; onRemove: (id: string) => void }> = ({ 
  notification, 
  onRemove 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto-remove after duration
    if (notification.duration) {
      const timer = setTimeout(() => {
        handleRemove();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <FaCheckCircle className="text-green-400" />;
      case 'error': return <FaTimesCircle className="text-red-400" />;
      case 'warning': return <FaExclamationTriangle className="text-yellow-400" />;
      case 'info': return <FaInfoCircle className="text-blue-400" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success': return 'border-l-green-400';
      case 'error': return 'border-l-red-400';
      case 'warning': return 'border-l-yellow-400';
      case 'info': return 'border-l-blue-400';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out mb-3
        ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isRemoving ? 'scale-95' : 'scale-100'}
      `}
    >
      <div className={`
        bg-gray-800/90 backdrop-blur-md rounded-lg p-4 border-l-4 ${getBorderColor()}
        shadow-xl max-w-sm min-w-[300px] border border-gray-700/50
        hover:bg-gray-800/95 transition-colors duration-200
      `}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 text-lg">
              {getIcon()}
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium text-sm mb-1">
                {notification.title}
              </h4>
              <p className="text-gray-300 text-xs leading-relaxed">
                {notification.message}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-white transition-colors duration-200 ml-2"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default NotificationSystem;

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000,
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};