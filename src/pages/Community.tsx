import React, { useState, useEffect } from 'react';
import { Send, ThumbsUp, MessageCircle, Share2, User, Plus, Filter, Search, Trash2, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';
import Messages from '../components/Messages';
import api from '../utils/api';

interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  content: string;
  tags: string[];
  createdAt?: string;
}

const ROLES = [
  'Developer',
  'Designer',
  'Marketer',
  'Data Scientist',
  'Product Manager',
  'Content Writer',
  'UI/UX Designer',
  'Backend Developer',
  'Frontend Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'QA Engineer',
  'Business Analyst',
  'Project Manager'
];

const Community: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gray-900/80 shadow-xl border border-white/10">
        <svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-purple-400 mb-6 animate-bounce">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 mb-4 text-center">Community Coming Soon</h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-2 text-center max-w-xl">We're working hard to bring you an amazing community experience. Stay tuned for updates and exciting features!</p>
        <span className="inline-block mt-4 px-4 py-2 rounded-full bg-purple-600/20 text-purple-300 font-semibold text-sm">Launching Summer 2024 🚀</span>
      </div>
    </div>
  );
};

export default Community; 