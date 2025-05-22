import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import api from '../lib/api';

export default function ChatButton({ otherUserId }) {
  const [loading, setLoading] = useState(false);

  const startChat = async () => {
    try {
      setLoading(true);
      const response = await api.post('/community/chats', { otherUserId });
      // Here you would typically open a chat modal or navigate to a chat page
      console.log('Chat created:', response.data);
    } catch (error) {
      console.error('Failed to start chat:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={startChat}
      disabled={loading}
      className="flex items-center space-x-1 text-gray-400 hover:text-green-500 transition-colors disabled:opacity-50"
    >
      <MessageSquare className="w-5 h-5" />
      <span>Message</span>
    </button>
  );
} 