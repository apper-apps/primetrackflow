import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const IssueModal = ({ 
  issue, 
  users, 
  projects, 
  isOpen, 
  onClose, 
  onSave, 
  mode = "create" // "create", "edit"
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Open",
    priority: "Medium",
    assigneeId: "",
    projectId: "",
    tags: ""
  });
  const [errors, setErrors] = useState({});

useEffect(() => {
    if (mode === "edit" && issue) {
      setFormData({
        title: issue.title || "",
        description: issue.description || "",
        status: issue.status || "Open",
        priority: issue.priority || "Medium",
        assigneeId: issue.assigneeId || "",
        projectId: issue.projectId || "",
        tags: issue.tags || "",
        statusChangedAt: issue.statusChangedAt || issue.createdAt
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "Open",
        priority: "Medium",
        assigneeId: "",
        projectId: "",
        tags: "",
        statusChangedAt: new Date().toISOString()
      });
    }
    setErrors({});
  }, [issue, mode, isOpen]);

const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    const dataToSave = { ...formData };
    if (mode === "edit") {
      dataToSave.Id = issue.Id;
    }
    onSave(dataToSave);
  };

  const getStatusVariant = (status) => {
    const variants = {
      "Open": "open",
      "In Progress": "in-progress", 
      "Resolved": "resolved",
      "Closed": "closed",
      "Critical": "critical"
    };
    return variants[status] || "default";
  };

  const getUserById = (userId) => {
    return users.find(user => user.Id === parseInt(userId));
  };

  const getProjectById = (projectId) => {
    return projects.find(project => project.Id === parseInt(projectId));
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  if (!isOpen) return null;

  const assignee = getUserById(formData.assigneeId);
  const project = getProjectById(formData.projectId);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-elevation max-w-3xl w-full max-h-[90vh] overflow-hidden">
{/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name={mode === "create" ? "Plus" : "Edit2"} className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {mode === "create" ? "Create New Issue" : `Edit Issue #${issue?.Id}`}
              </h2>
              <p className="text-sm text-gray-600">
                {mode === "create" ? "Add a new issue to track bugs, features, and tasks" : "Update issue details and information"}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
<div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Title */}
            <FormField label="Title" required error={errors.title}>
              <Input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter a clear, descriptive title for the issue..."
                className={errors.title ? "border-error focus:ring-error" : ""}
              />
            </FormField>

            {/* Description */}
            <FormField label="Description">
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Provide detailed information about the issue, including steps to reproduce, expected behavior, and any relevant context..."
                rows={5}
                className="resize-none"
              />
            </FormField>

            {/* Priority and Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Priority */}
              <FormField label="Priority" required>
                <Select
                  value={formData.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                >
                  <option value="Low">Low - Minor issue, can be addressed later</option>
                  <option value="Medium">Medium - Normal priority</option>
                  <option value="High">High - Important, should be addressed soon</option>
                  <option value="Critical">Critical - Urgent, needs immediate attention</option>
                </Select>
              </FormField>

              {/* Status - only show for edit mode */}
              {mode === "edit" && (
                <FormField label="Status">
                  <Select
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </Select>
                </FormField>
              )}
            </div>

            {/* Assignment and Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assignee */}
              <FormField label="Assignee">
                <Select
                  value={formData.assigneeId}
                  onChange={(e) => handleChange("assigneeId", e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.Id} value={user.Id}>
                      {user.name} - {user.role}
                    </option>
                  ))}
                </Select>
              </FormField>

              {/* Project */}
              <FormField label="Project">
                <Select
                  value={formData.projectId}
                  onChange={(e) => handleChange("projectId", e.target.value)}
                >
                  <option value="">Select project...</option>
                  {projects.map(project => (
                    <option key={project.Id} value={project.Id}>
                      {project.name}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            {/* Tags */}
            <FormField label="Tags" description="Enter tags separated by commas (e.g., bug, frontend, urgent)">
              <Input
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                placeholder="bug, frontend, urgent..."
              />
            </FormField>

            {/* Timestamps - only show for edit mode */}
            {mode === "edit" && issue && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Created</Label>
                  <p className="text-sm text-gray-900 mt-1">
                    {format(new Date(issue.createdAt), "PPPp")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                  <p className="text-sm text-gray-900 mt-1">
                    {format(new Date(issue.updatedAt), "PPPp")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
<div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {mode === "create" ? "All fields except title are optional" : ""}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={onClose}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              className="flex items-center space-x-2"
              disabled={!formData.title.trim()}
            >
              <ApperIcon name={mode === "create" ? "Plus" : "Save"} className="w-4 h-4" />
              <span>{mode === "create" ? "Create Issue" : "Save Changes"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;