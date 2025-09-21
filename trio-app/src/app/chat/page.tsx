import React from 'react';

const ChatPage = () => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-10 w-full h-full">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-gray-800 rounded-[50px] flex items-center justify-center min-h-[200px]">
          <div className="w-24 h-24 bg-blue-500 rounded-full"></div>
        </div>
      ))}
    </div>
  );
};

export default ChatPage;