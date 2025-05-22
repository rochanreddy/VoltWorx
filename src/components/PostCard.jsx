import React, { useState } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import api from '../lib/api';
import Comments from './Comments';
import ChatButton from './ChatButton';

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(post.likes.includes(api.userId));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const toggleLike = async () => {
    try {
      const res = await api.post(`/community/posts/${post._id}/like`);
      setLikesCount(res.data.likesCount);
      setLiked(!liked);
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post(`/community/posts/${post._id}/comments`, {
        body: newComment
      });
      setNewComment('');
      // Refresh comments
      setShowComments(true);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <div className="flex items-center space-x-3 mb-4">
        <img 
          src={post.author.avatarUrl || '/default-avatar.png'} 
          alt={post.author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <span className="font-semibold text-white">{post.author.name}</span>
          <p className="text-sm text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
      <p className="text-gray-300 mb-4">{post.body}</p>

      <div className="flex items-center space-x-6 mb-4">
        <button 
          onClick={toggleLike}
          className="flex items-center space-x-1 text-gray-400 hover:text-pink-500 transition-colors"
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-pink-500 text-pink-500' : ''}`} />
          <span>{likesCount}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Comments</span>
        </button>

        <ChatButton otherUserId={post.author._id} />
      </div>

      {showComments && (
        <div className="mt-4">
          <form onSubmit={handleComment} className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <Comments postId={post._id} />
        </div>
      )}
    </div>
  );
} 