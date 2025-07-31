import { toast } from 'react-toastify';

/**
 * Get all comments for a specific issue
 * @param {number} issueId - The issue ID to get comments for
 * @returns {Array} Array of comment objects for the issue
 */
const getCommentsByIssueId = async (issueId) => {
  try {
    if (!issueId || typeof issueId !== 'number') {
      throw new Error('Valid issue ID is required');
    }
    
    const tableName = 'app_Comment';
    
    const params = {
      fields: [
        {
          field: {
            Name: "Name"
          }
        },
        {
          field: {
            Name: "Tags"
          }
        },
        {
          field: {
            Name: "Owner"
          }
        },
        {
          field: {
            Name: "issueId"
          }
        },
        {
          field: {
            Name: "userId"
          }
        },
        {
          field: {
            Name: "content"
          }
        },
        {
          field: {
            Name: "createdAt"
          }
        },
        {
          field: {
            Name: "updatedAt"
          }
        }
      ],
      where: [
        {
          FieldName: "issueId",
          Operator: "EqualTo",
          Values: [issueId]
        }
      ],
      orderBy: [
        {
          fieldName: "createdAt",
          sorttype: "ASC"
        }
      ]
    };
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching comments:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

/**
 * Get a specific comment by ID
 * @param {number} id - The comment ID
 * @returns {Object|null} The comment object or null if not found
 */
const getById = async (id) => {
  try {
    if (!id || typeof id !== 'number') {
      throw new Error('Valid comment ID is required');
    }
    
    const tableName = 'app_Comment';
    
    const params = {
      fields: [
        {
          field: {
            Name: "Name"
          }
        },
        {
          field: {
            Name: "Tags"
          }
        },
        {
          field: {
            Name: "Owner"
          }
        },
        {
          field: {
            Name: "issueId"
          }
        },
        {
          field: {
            Name: "userId"
          }
        },
        {
          field: {
            Name: "content"
          }
        },
        {
          field: {
            Name: "createdAt"
          }
        },
        {
          field: {
            Name: "updatedAt"
          }
        }
      ]
    };
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.getRecordById(tableName, id, params);
    
    if (!response.success) {
      console.error(response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching comment with ID ${id}:`, error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

/**
 * Create a new comment
 * @param {Object} commentData - The comment data
 * @returns {Object} The created comment
 */
const create = async (commentData) => {
  try {
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
    
    const tableName = 'app_Comment';
    
    const params = {
      records: [
        {
          Name: `Comment on Issue ${issueId}`,
          issueId: issueId,
          userId: parseInt(userId),
          content: content.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} comments:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      return successfulRecords.length > 0 ? successfulRecords[0].data : null;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating comment:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

/**
 * Update an existing comment
 * @param {number} id - The comment ID
 * @param {Object} updateData - The data to update
 * @returns {Object} The updated comment
 */
const update = async (id, updateData) => {
  try {
    if (!id || typeof id !== 'number') {
      throw new Error('Valid comment ID is required');
    }
    
    const tableName = 'app_Comment';
    
    const params = {
      records: [
        {
          Id: parseInt(id),
          content: updateData.content,
          updatedAt: new Date().toISOString()
        }
      ]
    };
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} comments:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating comment:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

/**
 * Delete a comment
 * @param {number} id - The comment ID
 * @returns {boolean} True if deleted successfully
 */
const deleteComment = async (id) => {
  try {
    if (!id || typeof id !== 'number') {
      throw new Error('Valid comment ID is required');
    }
    
    const tableName = 'app_Comment';
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} comments:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      return successfulDeletions.length > 0;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting comment:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return false;
  }
};

export const commentsService = {
  getCommentsByIssueId,
  getById,
  create,
  update,
  delete: deleteComment
};