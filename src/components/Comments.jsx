import React, { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/community/posts/${postId}/comments`);
        setComments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch comments');
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  if (loading) return <div className="text-gray-400">Loading comments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <div className="text-gray-400 text-center py-4">No comments yet</div>
      ) : (
        comments.map(comment => (
          <div key={comment._id} className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={comment.author.avatarUrl || '/default-avatar.png'}
                alt={comment.author.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <span className="font-semibold text-white">{comment.author.name}</span>
                <p className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-gray-300">{comment.body}</p>
          </div>
        ))
      )}
    </div>
  );
} 