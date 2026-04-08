import React from 'react';
import { Mic, Send, Bot, User } from 'lucide-react';

export const VoiceButton = ({ isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`relative p-8 rounded-full transition-all duration-500 ${
      isActive ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-110' : 'bg-blue-600 hover:bg-blue-700'
    }`}
  >
    <Mic className="text-white w-8 h-8" />
    {isActive && (
      <span className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></span>
    )}
  </button>
);

export const ChatBubble = ({ role, text }) => (
  <div className={`flex ${role === 'ai' ? 'justify-start' : 'justify-end'} mb-4`}>
    <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${
      role === 'ai' ? 'bg-gray-800 text-blue-100 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'
    }`}>
      {role === 'ai' ? <Bot size={20} /> : <User size={20} />}
      <p className="text-sm md:text-base">{text}</p>
    </div>
  </div>
);