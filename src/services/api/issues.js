import { toast } from "react-toastify";
import React from "react";

export const issuesService = {
  async getAll() {
    try {
      const tableName = 'issue';
      
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
              Name: "title"
            }
          },
          {
            field: {
              Name: "description"
            }
          },
          {
            field: {
              Name: "status"
            }
          },
          {
            field: {
              Name: "priority"
            }
          },
          {
            field: {
              Name: "assigneeId"
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
          },
          {
            field: {
              Name: "projectId"
            }
          }
        ],
        orderBy: [
          {
            fieldName: "updatedAt",
            sorttype: "DESC"
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
        console.error("Error fetching issues:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const tableName = 'issue';
      
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
              Name: "title"
            }
          },
          {
            field: {
              Name: "description"
            }
          },
          {
            field: {
              Name: "status"
            }
          },
          {
            field: {
              Name: "priority"
            }
          },
          {
            field: {
              Name: "assigneeId"
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
          },
          {
            field: {
              Name: "projectId"
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
        toast.error(response.message);
        return null;
      }
      
return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching issue with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(issueData) {
    try {
      const tableName = 'issue';
      
      const params = {
        records: [
          {
            Name: issueData.title,
            title: issueData.title,
            description: issueData.description || "",
            status: issueData.status || "Open",
            priority: issueData.priority || "Medium",
            assigneeId: issueData.assigneeId ? parseInt(issueData.assigneeId) : null,
            projectId: issueData.projectId ? parseInt(issueData.projectId) : null,
            Tags: issueData.tags || "",
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
          console.error(`Failed to create ${failedRecords.length} issues:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating issue:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, updateData) {
    try {
      const tableName = 'issue';
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: updateData.title,
            title: updateData.title,
            description: updateData.description || "",
            status: updateData.status,
            priority: updateData.priority,
            assigneeId: updateData.assigneeId ? parseInt(updateData.assigneeId) : null,
            projectId: updateData.projectId ? parseInt(updateData.projectId) : null,
            Tags: updateData.tags || "",
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
          console.error(`Failed to update ${failedUpdates.length} issues:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating issue:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async updateStatus(id, newStatus) {
    try {
      const tableName = 'issue';
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            status: newStatus,
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
          console.error(`Failed to update status for ${failedUpdates.length} issues:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating issue status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const tableName = 'issue';
      
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
          console.error(`Failed to delete ${failedDeletions.length} issues:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting issue:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async getByStatus(status) {
    try {
      const tableName = 'issue';
      
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "title"
            }
          },
          {
            field: {
              Name: "description"
            }
          },
          {
            field: {
              Name: "status"
            }
          },
          {
            field: {
              Name: "priority"
            }
          },
          {
            field: {
              Name: "assigneeId"
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
          },
          {
            field: {
              Name: "projectId"
            }
          }
        ],
        where: [
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: [status]
          }
        ],
        orderBy: [
          {
            fieldName: "updatedAt",
            sorttype: "DESC"
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
        console.error("Error fetching issues by status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async search(query) {
    try {
      if (!query || !query.trim()) {
        return [];
      }
      
      const tableName = 'issue';
      const searchTerm = query.toLowerCase().trim();
      
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "title"
            }
          },
          {
            field: {
              Name: "description"
            }
          },
          {
            field: {
              Name: "status"
            }
          },
          {
            field: {
              Name: "priority"
            }
          },
          {
            field: {
              Name: "assigneeId"
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
          },
          {
            field: {
              Name: "projectId"
            }
          }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title",
                    operator: "Contains",
                    values: [searchTerm]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "description",
                    operator: "Contains",
                    values: [searchTerm]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "status",
                    operator: "Contains",
                    values: [searchTerm]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "priority",
                    operator: "Contains",
                    values: [searchTerm]
                  }
                ],
                operator: "OR"
              }
            ]
          }
        ],
        orderBy: [
          {
            fieldName: "updatedAt",
            sorttype: "DESC"
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
        console.error("Error searching issues:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};

// Named export for direct import compatibility
export const getAllIssues = () => issuesService.getAll();