import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ className }) => {
  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "BarChart3",
      description: "Overview and metrics"
    },
    {
      name: "Issues",
      href: "/issues",
      icon: "Bug",
      description: "Track and manage issues"
    },
    {
      name: "Projects",
      href: "/projects", 
      icon: "FolderOpen",
      description: "Project management"
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "FileText",
      description: "Analytics and insights"
    }
  ];

  return (
    <div className={cn(
      "bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 h-screen flex flex-col shadow-elevation",
      className
    )}>
      {/* Logo */}
      <div className="flex items-center px-6 py-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              TrackFlow
            </h1>
            <p className="text-xs text-gray-400">Issue Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-card transform scale-105"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              )
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon 
                  name={item.icon} 
                  className={cn(
                    "w-5 h-5 mr-3 transition-all duration-200",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  )} 
                />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className={cn(
                    "text-xs transition-colors duration-200",
                    isActive ? "text-white/80" : "text-gray-500 group-hover:text-gray-300"
                  )}>
                    {item.description}
                  </div>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center px-4 py-3 rounded-lg bg-gray-800/50">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">TC</span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">Team Lead</p>
            <p className="text-xs text-gray-400">Project Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;