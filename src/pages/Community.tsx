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
  // Clock state for hour hand rotation
  const [hourAngle, setHourAngle] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ms = now.getMilliseconds();
      // Each hour is 30deg, each minute is 0.5deg, each second is 0.5/60 deg, each ms is 0.5/60/1000 deg
      const angle =
        hours * 30 +
        minutes * 0.5 +
        seconds * (0.5 / 60) +
        ms * (0.5 / 60 / 1000);
      setHourAngle(angle);
      animationFrameId = requestAnimationFrame(updateClock);
    };
    updateClock();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gray-900/80 shadow-xl border border-white/10">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
          <circle cx="40" cy="40" r="36" stroke="#a78bfa" strokeWidth="4" fill="#18181b" />
          {/* Hour hand */}
          <rect x="38.5" y="18" width="3" height="24" rx="1.5" fill="#a78bfa" transform={`rotate(${hourAngle} 40 40)`} />
          {/* Minute hand (static for style) */}
          <rect x="39.25" y="10" width="1.5" height="30" rx="0.75" fill="#f472b6" />
          {/* Center dot */}
          <circle cx="40" cy="40" r="3" fill="#f472b6" />
        </svg>
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 mb-4 text-center">Community Coming Soon</h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-2 text-center max-w-xl">We're working hard to bring you an amazing community experience. Stay tuned for updates and exciting features!</p>
        <span className="inline-block mt-4 px-4 py-2 rounded-full bg-purple-600/20 text-purple-300 font-semibold text-sm">Launching Summer 2024 🚀</span>
      </div>
    </div>
  );
};

export default Community; 