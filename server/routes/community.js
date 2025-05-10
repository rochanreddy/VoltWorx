import express from 'express';
import { Post } from '../models/Post.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name avatar role')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

// Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { content, tags, category, lookingFor } = req.body;
    const post = new Post({
      content,
      tags,
      category,
      lookingFor,
      author: req.user._id
    });
    await post.save();
    await post.populate('author', 'name avatar role');
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: 'Error creating post', error: error.message });
  }
});

// Like a post
router.post('/:postId/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: 'Error liking post', error: error.message });
  }
});

// Add a comment to a post
router.post('/:postId/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.comments.push({
      content,
      author: req.user._id
    });
    
    await post.save();
    await post.populate('comments.author', 'name avatar role');
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: 'Error adding comment', error: error.message });
  }
});

export default router; 