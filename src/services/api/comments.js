import mockComments from '@/services/mockData/comments.json';

// In-memory storage for comments
let comments = [...mockComments];
let nextId = Math.max(...comments.map(c => c.Id), 0) + 1;

/**
 * Get all comments for a specific issue
 * @param {number} issueId - The issue ID to get comments for
 * @returns {Array} Array of comment objects for the issue
 */
const getCommentsByIssueId = (issueId) => {
  if (!issueId || typeof issueId !== 'number') {
    throw new Error('Valid issue ID is required');
  }
  
  return comments
    .filter(comment => comment.issueId === issueId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(comment => ({ ...comment }));
};

/**
 * Get a specific comment by ID
 * @param {number} id - The comment ID
 * @returns {Object|null} The comment object or null if not found
 */
const getById = (id) => {
  if (!id || typeof id !== 'number') {
    throw new Error('Valid comment ID is required');
  }
  
  const comment = comments.find(c => c.Id === id);
  return comment ? { ...comment } : null;
};

/**
 * Create a new comment
 * @param {Object} commentData - The comment data
 * @returns {Object} The created comment
 */
const create = (commentData) => {
  const { issueId, userId, content } = commentData;
  
  if (!issueId || typeof issueId !== 'number') {
    throw new Error('Valid issue ID is required');
  }
  
  if (!userId || typeof userId !== 'number') {
    throw new Error('Valid user ID is required');
  }
  
  if (!content || typeof content !== 'string' || content.trim() === '') {
    throw new Error('Comment content is required');
  }
  
  const newComment = {
    Id: nextId++,
    issueId,
    userId,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  comments.push(newComment);
  return { ...newComment };
};

/**
 * Update an existing comment
 * @param {number} id - The comment ID
 * @param {Object} updateData - The data to update
 * @returns {Object} The updated comment
 */
const update = (id, updateData) => {
  if (!id || typeof id !== 'number') {
    throw new Error('Valid comment ID is required');
  }
  
  const index = comments.findIndex(c => c.Id === id);
  if (index === -1) {
    throw new Error('Comment not found');
  }
  
  const updatedComment = {
    ...comments[index],
    ...updateData,
    Id: id, // Ensure ID cannot be changed
    updatedAt: new Date().toISOString()
  };
  
  comments[index] = updatedComment;
  return { ...updatedComment };
};

/**
 * Delete a comment
 * @param {number} id - The comment ID
 * @returns {boolean} True if deleted successfully
 */
const deleteComment = (id) => {
  if (!id || typeof id !== 'number') {
    throw new Error('Valid comment ID is required');
  }
  
  const index = comments.findIndex(c => c.Id === id);
  if (index === -1) {
    throw new Error('Comment not found');
  }
  
  comments.splice(index, 1);
  return true;
};

export const commentsService = {
  getCommentsByIssueId,
  getById,
  create,
  update,
  delete: deleteComment
};