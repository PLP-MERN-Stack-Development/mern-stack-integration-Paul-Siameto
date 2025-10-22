const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation
const commentValidation = [
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters'),
  body('post').isMongoId().withMessage('Valid post ID is required'),
  body('parentComment').optional().isMongoId().withMessage('parentComment must be a valid ID')
];

// GET /api/comments/post/:postId - list comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate('author', 'name avatar')
      .sort({ createdAt: 1 })
      .lean();

    res.json({ success: true, data: comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, message: 'Error fetching comments', error: error.message });
  }
});

// POST /api/comments - create a comment
router.post('/', auth, commentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn('Validation failed for POST /api/comments', {
        body: req.body,
        errors: errors.array()
      });
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { content, post: postId, parentComment } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = new Comment({
      content,
      author: req.user.id,
      post: postId,
      parentComment: parentComment || null
    });

    await comment.save();

    // Add to post.comments
    post.comments.push(comment._id);
    await post.save();

    // If parentComment, add to its replies
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (parent) {
        parent.replies.push(comment._id);
        await parent.save();
      }
    }

    const populated = await Comment.findById(comment._id).populate('author', 'name avatar');

    res.status(201).json({ success: true, message: 'Comment created', data: populated });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ success: false, message: 'Error creating comment', error: error.message });
  }
});

// PUT /api/comments/:id - update comment
router.put('/:id', auth, [param('id').isMongoId(), body('content').trim().isLength({ min: 1, max: 500 })], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    // only author or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this comment' });
    }

    comment.content = req.body.content;
    await comment.save();

    const populated = await Comment.findById(comment._id).populate('author', 'name avatar');
    res.json({ success: true, message: 'Comment updated', data: populated });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ success: false, message: 'Error updating comment', error: error.message });
  }
});

// DELETE /api/comments/:id - delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    // only author or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    // Remove reference from post
    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });

    // Remove reference from parent comment if exists
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, { $pull: { replies: comment._id } });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ success: false, message: 'Error deleting comment', error: error.message });
  }
});

module.exports = router;
