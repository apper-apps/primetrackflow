import React from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import ApperIcon from "@/components/ApperIcon";

const Reports = () => {
  const { onMenuClick } = useOutletContext();

  const reportTypes = [
    {
      title: "Issue Trends",
      description: "Track issue creation and resolution trends over time",
      icon: "TrendingUp",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Team Performance",
      description: "Analyze team productivity and issue resolution rates",
      icon: "Users",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Priority Analysis",
      description: "Breakdown of issues by priority and resolution time",
      icon: "AlertTriangle",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Project Insights",
      description: "Detailed analytics for individual project performance",
      icon: "BarChart3",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Reports"
        onMenuClick={onMenuClick}
        onNewIssue={() => {}}
        onSearch={() => {}}
      />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Report Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTypes.map((report, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-card border border-gray-200 p-6 hover:shadow-elevation transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${report.color} rounded-lg flex items-center justify-center shadow-subtle flex-shrink-0`}>
                    <ApperIcon name={report.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {report.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {report.description}
                    </p>
                  </div>
                  <ApperIcon name="ArrowRight" className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">247</div>
                <div className="text-sm text-gray-600">Total Issues</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">82%</div>
                <div className="text-sm text-gray-600">Resolution Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">3.2</div>
                <div className="text-sm text-gray-600">Avg Resolution (days)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">15</div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </div>
            </div>
          </div>

          {/* Placeholder for charts and detailed reports */}
          <div className="bg-white rounded-xl shadow-card border border-gray-200 p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="PieChart" className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Advanced Analytics Dashboard
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Comprehensive reporting and analytics features including interactive charts, 
                custom date ranges, exportable reports, and detailed insights will be available here.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  <span>Custom Date Ranges</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ApperIcon name="Download" className="w-4 h-4" />
                  <span>Export to PDF/Excel</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ApperIcon name="Filter" className="w-4 h-4" />
                  <span>Advanced Filtering</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-8">
                Full analytics suite coming in the next major release
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;