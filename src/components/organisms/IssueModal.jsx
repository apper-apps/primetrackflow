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
  mode = "view" // "view", "edit", "create"
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Open",
    priority: "Medium",
    assigneeId: "",
    projectId: ""
  });
  const [isEditing, setIsEditing] = useState(mode === "create");

  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title || "",
        description: issue.description || "",
        status: issue.status || "Open",
        priority: issue.priority || "Medium",
        assigneeId: issue.assigneeId || "",
        projectId: issue.projectId || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "Open",
        priority: "Medium",
        assigneeId: "",
        projectId: ""
      });
    }
    setIsEditing(mode === "create");
  }, [issue, mode]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
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
            {mode === "create" ? (
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Plus" className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-cyan-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Bug" className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {mode === "create" ? "Create New Issue" : `Issue #${issue?.Id}`}
              </h2>
              <p className="text-sm text-gray-600">
                {mode === "create" ? "Add a new issue to track" : "View and manage issue details"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {mode !== "create" && !isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                <ApperIcon name="Edit2" className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Title */}
            <FormField label="Title" required>
              {isEditing ? (
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter issue title..."
                />
              ) : (
                <h3 className="text-lg font-semibold text-gray-900">{formData.title}</h3>
              )}
            </FormField>

            {/* Description */}
            <FormField label="Description">
              {isEditing ? (
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{formData.description}</p>
              )}
            </FormField>

            {/* Status, Priority, and Assignment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status */}
              <FormField label="Status">
                {isEditing ? (
                  <Select
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </Select>
                ) : (
                  <Badge variant={getStatusVariant(formData.status)}>
                    {formData.status}
                  </Badge>
                )}
              </FormField>

              {/* Priority */}
              <FormField label="Priority">
                {isEditing ? (
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleChange("priority", e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </Select>
                ) : (
                  <PriorityIndicator priority={formData.priority} showLabel />
                )}
              </FormField>

              {/* Assignee */}
              <FormField label="Assignee">
                {isEditing ? (
                  <Select
                    value={formData.assigneeId}
                    onChange={(e) => handleChange("assigneeId", e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {users.map(user => (
                      <option key={user.Id} value={user.Id}>
                        {user.name}
                      </option>
                    ))}
                  </Select>
                ) : assignee ? (
                  <div className="flex items-center space-x-2">
                    <Avatar
                      src={assignee.avatar}
                      alt={assignee.name}
                      fallback={getInitials(assignee.name)}
                      size="sm"
                    />
                    <span className="text-sm font-medium text-gray-900">{assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Unassigned</span>
                )}
              </FormField>
            </div>

            {/* Project */}
            <FormField label="Project">
              {isEditing ? (
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
              ) : project ? (
                <div className="flex items-center space-x-2">
                  <ApperIcon name="FolderOpen" className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{project.name}</span>
                </div>
              ) : (
                <span className="text-sm text-gray-500">No project assigned</span>
              )}
            </FormField>

            {/* Timestamps - only show for existing issues */}
            {issue && mode !== "create" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <div>
                  <Label className="text-sm text-gray-600">Created</Label>
                  <p className="text-sm text-gray-900 mt-1">
                    {format(new Date(issue.createdAt), "PPpp")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Last Updated</Label>
                  <p className="text-sm text-gray-900 mt-1">
                    {format(new Date(issue.updatedAt), "PPpp")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={onClose}
            variant="ghost"
          >
            Cancel
          </Button>
          {isEditing && (
            <Button
              onClick={handleSave}
              variant="primary"
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Save" className="w-4 h-4" />
              <span>{mode === "create" ? "Create Issue" : "Save Changes"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueModal;