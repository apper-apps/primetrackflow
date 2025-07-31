import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { projectsService } from "@/services/api/projects";
import { issuesService } from "@/services/api/issues";
import { usersService } from "@/services/api/users";
import { cn } from "@/utils/cn";

const Projects = () => {
  const { onMenuClick } = useOutletContext();
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teamMembers: []
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectsData, issuesData, usersData] = await Promise.all([
        projectsService.getAll(),
        issuesService.getAll(), 
        usersService.getAll()
      ]);
      setProjects(projectsData);
      setIssues(issuesData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load projects data");
    } finally {
      setLoading(false);
    }
  };

  const getProjectIssueStats = (projectId) => {
    const projectIssues = issues.filter(issue => parseInt(issue.projectId) === projectId);
    const openIssues = projectIssues.filter(issue => 
      issue.status === 'Open' || issue.status === 'In Progress' || issue.status === 'Critical'
    );
    return {
      open: openIssues.length,
      total: projectIssues.length
    };
  };

  const getLastActivity = (projectId) => {
    const projectIssues = issues.filter(issue => parseInt(issue.projectId) === projectId);
    if (projectIssues.length === 0) return null;
    
    const latestIssue = projectIssues.reduce((latest, issue) => {
      return new Date(issue.updatedAt) > new Date(latest.updatedAt) ? issue : latest;
    });
    
    return formatRelativeDate(latestIssue.updatedAt);
  };

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleTeamMemberChange = (userId) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(userId)
        ? prev.teamMembers.filter(id => id !== userId)
        : [...prev.teamMembers, userId]
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Project description is required';
    }
    
    if (formData.teamMembers.length === 0) {
      errors.teamMembers = 'Please select at least one team member';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }
    
    try {
      setCreating(true);
      const newProject = await projectsService.create({
        name: formData.name.trim(),
        description: formData.description.trim(),
        teamMembers: formData.teamMembers,
        lastActivity: new Date().toISOString()
      });
      
      setProjects(prev => [...prev, newProject]);
      setShowModal(false);
      setFormData({ name: '', description: '', teamMembers: [] });
      setFormErrors({});
      toast.success(`Project "${newProject.name}" created successfully!`);
    } catch (err) {
      toast.error(err.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', description: '', teamMembers: [] });
    setFormErrors({});
  };

  if (loading) return <Loading className="min-h-screen" />;
  if (error) return <Error message={error} onRetry={loadData} className="min-h-screen" />;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Projects"
        onMenuClick={onMenuClick}
        onNewIssue={() => {}}
        onSearch={() => {}}
      />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with New Project Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
              <p className="text-gray-600 mt-1">Manage and track your development projects</p>
            </div>
            <Button 
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Plus" size={16} />
              <span>New Project</span>
            </Button>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-card border border-gray-200 p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="FolderOpen" className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Get started by creating your first project to organize and track issues.
                </p>
                <Button onClick={() => setShowModal(true)}>
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Create First Project
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => {
                const issueStats = getProjectIssueStats(project.Id);
                const lastActivity = getLastActivity(project.Id);
                
                return (
                  <div
                    key={project.Id}
                    className="bg-white rounded-xl shadow-card border border-gray-200 p-6 hover:shadow-elevation transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                          <ApperIcon name="FolderOpen" className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Issue Stats */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Issues</span>
                        <span>{issueStats.open}/{issueStats.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: issueStats.total > 0 
                              ? `${Math.max(10, (issueStats.total - issueStats.open) / issueStats.total * 100)}%` 
                              : '0%' 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Bug" className="w-4 h-4" />
                        <span>{issueStats.open} open</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Clock" className="w-4 h-4" />
                        <span>{lastActivity || 'No activity'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModal}></div>
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create New Project</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-6">
                <FormField
                  label="Project Name"
                  required
                  error={formErrors.name}
                >
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter project name"
                    className={formErrors.name ? 'border-red-500' : ''}
                  />
                </FormField>

                <FormField
                  label="Description"
                  required
                  error={formErrors.description}
                >
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the project goals and scope"
                    rows={3}
                    className={formErrors.description ? 'border-red-500' : ''}
                  />
                </FormField>

                <FormField
                  label="Team Members"
                  required
                  error={formErrors.teamMembers}
                >
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {users.map(user => (
                      <label
                        key={user.Id}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={formData.teamMembers.includes(user.Id)}
                          onChange={() => handleTeamMemberChange(user.Id)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <div className="flex items-center space-x-2">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {formData.teamMembers.length > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      {formData.teamMembers.length} member{formData.teamMembers.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </FormField>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={closeModal}
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={creating}
                    className="flex items-center space-x-2"
                  >
                    {creating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Plus" size={16} />
                        <span>Create Project</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;