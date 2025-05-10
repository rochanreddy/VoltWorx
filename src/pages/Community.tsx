import React, { useState, useEffect } from 'react';
import { Send, ThumbsUp, MessageCircle, Share2, User, Plus, Filter, Search, Trash2, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';
import Messages from '../components/Messages';
import { fetchCommunityPosts, createCommunityPost, likeCommunityPost, commentOnCommunityPost } from '../utils/api';

interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  tags: string[];
  category?: string;
  lookingFor?: string[];
  createdAt: string;
  likes: string[];
  comments: Array<{
    _id: string;
    content: string;
    author: {
      _id: string;
      name: string;
      avatar?: string;
      role: string;
    };
    createdAt: string;
  }>;
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
  const [newPost, setNewPost] = useState({
    content: '',
    tags: [],
    category: '',
    lookingFor: [] as string[],
    customRole: ''
  });
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showMessages, setShowMessages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Categories for filtering
  const categories = [
    'all',
    'Tech',
    'HealthTech',
    'EdTech',
    'FinTech',
    'AI/ML',
    'Blockchain',
    'IoT',
    'Cybersecurity',
    'Cloud Computing',
    'Mobile Development',
    'Web Development',
    'Data Science',
    'Robotics',
    'AR/VR'
  ];

  // Fetch posts from backend on mount
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchCommunityPosts();
        setPosts(res.data.reverse());
      } catch (err: any) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handlePostSubmit = async () => {
    if (!user || !newPost.content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await createCommunityPost({
        content: newPost.content,
        tags: newPost.tags,
      });
      setPosts([res.data, ...posts]);
      setShowPostForm(false);
      setNewPost({ content: '', tags: [], category: '', lookingFor: [], customRole: '' });
    } catch (err: any) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await likeCommunityPost(postId);
      setPosts(posts.map(post => post._id === postId ? res.data : post));
    } catch (err) {
      setError('Failed to like post');
    }
  };

  const handleShowInterest = (post: Post) => {
    if (!isAuthenticated) {
      // TODO: Show login prompt
      return;
    }
    setSelectedUser({ id: post.author._id, name: post.author.name });
    setSelectedPostId(post._id);
    setShowChat(true);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    }
  };

  const handleRoleToggle = (role: string) => {
    setNewPost(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(role)
        ? prev.lookingFor.filter(r => r !== role)
        : [...prev.lookingFor, role]
    }));
  };

  // Filter posts based on category and search query
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  // Add console logs for debugging
  console.log('All posts:', posts);
  console.log('Filtered posts:', filteredPosts);
  console.log('Selected category:', selectedCategory);
  console.log('Search query:', searchQuery);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Startup Collaboration Hub</h1>
        {isAuthenticated && (
          <button
            onClick={() => setShowPostForm(true)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post Idea
          </button>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search ideas..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <select
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category} className="bg-gray-800 text-white">
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Create Post Modal */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowPostForm(false);
                setNewPost({
                  content: '',
                  tags: [],
                  category: '',
                  lookingFor: [],
                  customRole: ''
                });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Post Your Startup Idea</h2>
            <div className="space-y-4">
              <textarea
                className="w-full h-32 p-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Describe your startup idea..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              />
              <div className="flex gap-4">
                <select 
                  className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={newPost.category}
                  onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="" className="bg-gray-800 text-white">Select Category</option>
                  <option value="Tech" className="bg-gray-800 text-white">Tech</option>
                  <option value="HealthTech" className="bg-gray-800 text-white">HealthTech</option>
                  <option value="EdTech" className="bg-gray-800 text-white">EdTech</option>
                  <option value="FinTech" className="bg-gray-800 text-white">FinTech</option>
                </select>
              </div>

              {/* Looking For Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Looking For</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleToggle(role)}
                      className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                        newPost.lookingFor.includes(role)
                          ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                {/* Custom Role Input */}
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Add custom role..."
                    className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={newPost.customRole}
                    onChange={(e) => setNewPost(prev => ({ ...prev, customRole: e.target.value }))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newPost.customRole.trim()) {
                        e.preventDefault();
                        setNewPost(prev => ({
                          ...prev,
                          lookingFor: [...prev.lookingFor, prev.customRole.trim()],
                          customRole: ''
                        }));
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newPost.customRole.trim()) {
                        setNewPost(prev => ({
                          ...prev,
                          lookingFor: [...prev.lookingFor, prev.customRole.trim()],
                          customRole: ''
                        }));
                      }
                    }}
                    className="mt-2 px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  >
                    Add Custom Role
                  </button>
                </div>
                {newPost.lookingFor.length > 0 && (
                  <p className="text-sm text-purple-300 mt-2">
                    Selected: {newPost.lookingFor.join(', ')}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowPostForm(false);
                    setNewPost({
                      content: '',
                      tags: [],
                      category: '',
                      lookingFor: [],
                      customRole: ''
                    });
                  }}
                  className="px-4 py-2 text-white hover:text-purple-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostSubmit}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div key={post._id} className="group relative">
            <div className="absolute -inset-0.5 rounded-2xl blur-sm transition duration-200 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-pink-600/30 opacity-40 group-hover:opacity-60"></div>
            <div className="relative p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 bg-gray-900/80 backdrop-blur-xl">
              {/* Author Info */}
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-300" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white">{post.author.name}</h3>
                  <p className="text-xs text-gray-400">
                    {post.author.role} • {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {/* Title and Content */}
              <h2 className="text-lg font-semibold text-white mb-2">{post.content}</h2>

              {/* Category and Looking For */}
              <div className="mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {post.category}
                </span>
                <div className="mt-2">
                  <p className="text-xs text-gray-400">Looking for:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {post.lookingFor?.map((role, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button className="inline-flex items-center text-gray-400 hover:text-purple-300 transition-colors">
                    <ThumbsUp className="h-5 w-5 mr-1" />
                    <span>{post.likes.length}</span>
                  </button>
                  <button className="inline-flex items-center text-gray-400 hover:text-purple-300 transition-colors">
                    <MessageCircle className="h-5 w-5 mr-1" />
                    <span>{post.comments.length}</span>
                  </button>
                  <button className="inline-flex items-center text-gray-400 hover:text-purple-300 transition-colors">
                    <Share2 className="h-5 w-5 mr-1" />
                    <span>Share</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {post.author._id === user?._id && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedPostId(post._id);
                          setShowMessages(true);
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        title="View Messages"
                      >
                        <Mail className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleShowInterest(post)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  >
                    Show Interest
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Component */}
      {showChat && selectedUser && selectedPostId && (
        <Chat
          receiverId={selectedUser.id}
          receiverName={selectedUser.name}
          postId={selectedPostId}
          onClose={() => {
            setShowChat(false);
            setSelectedUser(null);
            setSelectedPostId(null);
          }}
        />
      )}

      {/* Messages Component */}
      {showMessages && selectedPostId && (
        <Messages
          postId={selectedPostId}
          onClose={() => {
            setShowMessages(false);
            setSelectedPostId(null);
          }}
        />
      )}
    </div>
  );
};

export default Community; 