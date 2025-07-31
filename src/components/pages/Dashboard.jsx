import React from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import ApperIcon from "@/components/ApperIcon";

const Dashboard = () => {
  const { onMenuClick } = useOutletContext();

  const metrics = [
    {
      title: "Total Issues",
      value: "247",
      change: "+12%",
      changeType: "increase",
      icon: "Bug",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Open Issues",
      value: "43",
      change: "-8%",
      changeType: "decrease",
      icon: "AlertCircle",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Resolved This Week",
      value: "28",
      change: "+15%",
      changeType: "increase",
      icon: "CheckCircle",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Average Resolution Time",
      value: "3.2 days",
      change: "-0.5 days",
      changeType: "decrease",
      icon: "Clock",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Dashboard"
        onMenuClick={onMenuClick}
        onNewIssue={() => {}}
        onSearch={() => {}}
      />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-card border border-gray-200 p-6 hover:shadow-elevation transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {metric.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {metric.value}
                    </p>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        metric.changeType === "increase" 
                          ? "text-green-600" 
                          : "text-red-600"
                      }`}>
                        {metric.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        vs last week
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center shadow-subtle`}>
                    <ApperIcon name={metric.icon} className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Placeholder Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <ApperIcon name="Activity" className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="CheckCircle" className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Issue #247 resolved</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="Plus" className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New issue created</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                    <ApperIcon name="Edit2" className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Issue #245 updated</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  Full activity tracking coming soon
                </p>
              </div>
            </div>

            {/* Issue Status Overview */}
            <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Issue Status Overview</h3>
                <ApperIcon name="PieChart" className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Open</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">43</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">In Progress</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">67</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Resolved</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">124</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Closed</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">13</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  Interactive charts coming soon
                </p>
              </div>
            </div>
          </div>

          {/* Additional placeholder sections */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
                <ApperIcon name="Users" className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-center py-12">
                <ApperIcon name="BarChart3" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Performance Analytics</p>
                <p className="text-gray-500 mb-6">
                  Detailed team performance metrics and insights will be available here.
                </p>
                <p className="text-sm text-gray-400">
                  Feature under development - Coming in next release
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;