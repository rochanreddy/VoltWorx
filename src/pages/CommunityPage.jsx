import React, { useState } from 'react';
import CommunityFeed from '../components/CommunityFeed';
import CreatePost from '../components/CreatePost';

export default function CommunityPage() {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handlePostCreated = (newPost) => {
    // You can implement a refresh mechanism here if needed
    window.location.reload(); // Simple refresh for now
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Community</h1>
          <button
            onClick={() => setShowCreatePost(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Post
          </button>
        </div>
        
        <CommunityFeed />

        {showCreatePost && (
          <CreatePost
            onPostCreated={handlePostCreated}
            onClose={() => setShowCreatePost(false)}
          />
        )}
      </div>
    </div>
  );
} 