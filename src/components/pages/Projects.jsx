import React from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import ApperIcon from "@/components/ApperIcon";

const Projects = () => {
  const { onMenuClick } = useOutletContext();

  const projects = [
    {
      id: 1,
      name: "TrackFlow Platform",
      description: "Core issue tracking platform development and maintenance",
      issues: 152,
      members: 8,
      status: "Active",
      progress: 75
    },
    {
      id: 2,
      name: "Mobile Application", 
      description: "Native mobile apps for iOS and Android platforms",
      issues: 89,
      members: 5,
      status: "Active", 
      progress: 45
    },
    {
      id: 3,
      name: "API Integration",
      description: "Third-party integrations and API development",
      issues: 34,
      members: 3,
      status: "Planning",
      progress: 15
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Planning":
        return "bg-blue-100 text-blue-800";
      case "On Hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-card border border-gray-200 p-6 hover:shadow-elevation transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                      <ApperIcon name="FolderOpen" className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Bug" className="w-4 h-4" />
                    <span>{project.issues} issues</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Users" className="w-4 h-4" />
                    <span>{project.members} members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Placeholder for additional features */}
          <div className="bg-white rounded-xl shadow-card border border-gray-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Settings" className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Management Tools</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Advanced project management features including team management, milestones, 
                and detailed project analytics will be available here.
              </p>
              <p className="text-sm text-gray-400">
                Enhanced project features coming in the next release
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;