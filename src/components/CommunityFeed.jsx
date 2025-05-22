import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import PostCard from './PostCard';

export default function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/community/posts');
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch posts');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Community Feed</h1>
      {posts.length === 0 ? (
        <div className="text-center text-gray-400">No posts yet. Be the first to post!</div>
      ) : (
        posts.map(post => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
} 