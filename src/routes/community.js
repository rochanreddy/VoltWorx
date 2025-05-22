const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Chat = require('../models/Chat');

// --- POSTS ---
// Create a post
router.post('/posts', auth, async (req, res) => {
  try {
    const post = new Post({ ...req.body, author: req.user.id });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// List posts
router.get('/posts', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name avatarUrl')
      .sort('-createdAt');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/unlike post
router.post('/posts/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const idx = post.likes.indexOf(req.user.id);
    if (idx === -1) post.likes.push(req.user.id);
    else post.likes.splice(idx, 1);
    await post.save();
    res.json({ likesCount: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- COMMENTS ---
// Add comment
router.post('/posts/:id/comments', auth, async (req, res) => {
  try {
    const comment = new Comment({
      post: req.params.id,
      author: req.user.id,
      body: req.body.body
    });
    await comment.save();
    const populated = await comment.populate('author', 'name avatarUrl');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// List comments
router.get('/posts/:id/comments', auth, async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'name avatarUrl')
      .sort('createdAt');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- PRIVATE CHAT ---
// Fetch or create 1:1 chat
router.post('/chats', auth, async (req, res) => {
  try {
    const { otherUserId } = req.body;
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, otherUserId] }
    });
    if (!chat) {
      chat = new Chat({ participants: [req.user.id, otherUserId], messages: [] });
      await chat.save();
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 