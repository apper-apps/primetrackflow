import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Header from "@/components/organisms/Header";
import ApperIcon from "@/components/ApperIcon";
import { issuesService } from "@/services/api/issues";
import Chart from "react-apexcharts";
import { format, subDays, isAfter, isBefore, differenceInDays } from "date-fns";
const Dashboard = () => {
  const { onMenuClick } = useOutletContext();

const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
const fetchIssues = async () => {
      try {
        const data = await issuesService.getAll();
        setIssues(data);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIssues();
  }, []);

  const calculateMetrics = () => {
    if (!issues.length) return null;

    const now = new Date();
    const weekAgo = subDays(now, 7);
    const twoWeeksAgo = subDays(now, 14);

    const totalIssues = issues.length;
    const openIssues = issues.filter(issue => issue.status === 'Open').length;
    
    const resolvedThisWeek = issues.filter(issue => 
      issue.status === 'Resolved' && 
      isAfter(new Date(issue.updatedAt), weekAgo)
    ).length;
    
    const resolvedLastWeek = issues.filter(issue => 
      issue.status === 'Resolved' && 
      isAfter(new Date(issue.updatedAt), twoWeeksAgo) &&
      isBefore(new Date(issue.updatedAt), weekAgo)
    ).length;

    const resolvedIssues = issues.filter(issue => issue.status === 'Resolved');
    const avgResolutionTime = resolvedIssues.length > 0 
      ? resolvedIssues.reduce((sum, issue) => {
          const created = new Date(issue.createdAt);
          const resolved = new Date(issue.updatedAt);
          return sum + differenceInDays(resolved, created);
        }, 0) / resolvedIssues.length
      : 0;

    const lastWeekTotal = issues.filter(issue => 
      isAfter(new Date(issue.createdAt), twoWeeksAgo) &&
      isBefore(new Date(issue.createdAt), weekAgo)
    ).length;

    const thisWeekTotal = issues.filter(issue => 
      isAfter(new Date(issue.createdAt), weekAgo)
    ).length;

    const totalChange = lastWeekTotal > 0 
      ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal * 100)
      : (thisWeekTotal > 0 ? 100 : 0);

    const openChange = lastWeekTotal > 0 ? -8 : 0; // Placeholder calculation
    const resolvedChange = resolvedLastWeek > 0 
      ? ((resolvedThisWeek - resolvedLastWeek) / resolvedLastWeek * 100)
      : (resolvedThisWeek > 0 ? 100 : 0);

    return {
      totalIssues,
      openIssues,
      resolvedThisWeek,
      avgResolutionTime,
      totalChange,
      openChange,
      resolvedChange
    };
  };

  const getChartData = () => {
    if (!issues.length) return null;

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return format(date, 'MMM dd');
    });

    const createdData = last30Days.map(dateStr => {
      const date = new Date(dateStr + ', 2024');
      return issues.filter(issue => 
        format(new Date(issue.createdAt), 'MMM dd') === dateStr
      ).length;
    });

    const resolvedData = last30Days.map(dateStr => {
      const date = new Date(dateStr + ', 2024');
      return issues.filter(issue => 
        issue.status === 'Resolved' &&
        format(new Date(issue.updatedAt), 'MMM dd') === dateStr
      ).length;
    });

    const statusData = [
      { name: 'Open', count: issues.filter(i => i.status === 'Open').length },
      { name: 'In Progress', count: issues.filter(i => i.status === 'In Progress').length },
      { name: 'Resolved', count: issues.filter(i => i.status === 'Resolved').length },
      { name: 'Closed', count: issues.filter(i => i.status === 'Closed').length },
      { name: 'Critical', count: issues.filter(i => i.status === 'Critical').length }
    ];

    const priorityData = [
      { name: 'Critical', count: issues.filter(i => i.priority === 'Critical').length },
      { name: 'High', count: issues.filter(i => i.priority === 'High').length },
      { name: 'Medium', count: issues.filter(i => i.priority === 'Medium').length },
      { name: 'Low', count: issues.filter(i => i.priority === 'Low').length }
    ];

    return {
      trendData: {
        categories: last30Days,
        series: [
          { name: 'Created', data: createdData },
          { name: 'Resolved', data: resolvedData }
        ]
      },
      statusData: statusData.filter(item => item.count > 0),
      priorityData: priorityData.filter(item => item.count > 0)
    };
  };

  const getRecentActivity = () => {
    if (!issues.length) return [];
    
    return issues
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 10)
      .map(issue => ({
        id: issue.Id,
        title: issue.title,
        status: issue.status,
        updatedAt: issue.updatedAt,
        priority: issue.priority
      }));
  };

  const getActivityIcon = (status) => {
    switch (status) {
      case 'Resolved': return 'CheckCircle';
      case 'In Progress': return 'Clock';
      case 'Critical': return 'AlertTriangle';
      case 'Closed': return 'X';
      default: return 'Circle';
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'Resolved': return 'from-green-500 to-green-600';
      case 'In Progress': return 'from-blue-500 to-blue-600';
      case 'Critical': return 'from-red-500 to-red-600';
      case 'Closed': return 'from-gray-500 to-gray-600';
      default: return 'from-orange-500 to-orange-600';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleIssueClick = (issueId) => {
    navigate('/issues', { state: { highlightIssue: issueId } });
  };

  const metrics = calculateMetrics();
  const chartData = getChartData();
  const recentActivity = getRecentActivity();

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Dashboard" description="Overview of your project metrics and recent activity" />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-card border border-gray-200 p-6">
                  <div className="skeleton h-4 w-24 mb-2"></div>
                  <div className="skeleton h-8 w-16 mb-2"></div>
                  <div className="skeleton h-3 w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Dashboard" description="Overview of your project metrics and recent activity" />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto text-center py-12">
            <ApperIcon name="BarChart3" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-500">Create some issues to see dashboard metrics.</p>
          </div>
        </div>
      </div>
    );
  }

  const metricsConfig = [
    {
      title: "Total Issues",
      value: metrics.totalIssues.toString(),
      change: `${metrics.totalChange >= 0 ? '+' : ''}${metrics.totalChange.toFixed(1)}%`,
      changeType: metrics.totalChange >= 0 ? "increase" : "decrease",
      icon: "Bug",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Open Issues",
      value: metrics.openIssues.toString(),
      change: `${metrics.openChange >= 0 ? '+' : ''}${metrics.openChange.toFixed(1)}%`,
      changeType: metrics.openChange >= 0 ? "increase" : "decrease",
      icon: "AlertCircle",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Resolved This Week",
      value: metrics.resolvedThisWeek.toString(),
      change: `${metrics.resolvedChange >= 0 ? '+' : ''}${metrics.resolvedChange.toFixed(1)}%`,
      changeType: metrics.resolvedChange >= 0 ? "increase" : "decrease",
      icon: "CheckCircle",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Average Resolution Time",
      value: `${metrics.avgResolutionTime.toFixed(1)} days`,
      change: "↓ 0.5 days",
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
            {metricsConfig.map((metric, index) => (
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
                      <ApperIcon 
                        name={metric.changeType === "increase" ? "TrendingUp" : "TrendingDown"} 
                        className={`w-4 h-4 mr-1 ${
                          metric.changeType === "increase" 
                            ? "text-green-600" 
                            : "text-red-600"
                        }`}
                      />
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

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Issue Trends Chart */}
            <div className="xl:col-span-2 bg-white rounded-xl shadow-card border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Issue Trends (Last 30 Days)</h3>
                <ApperIcon name="TrendingUp" className="w-5 h-5 text-gray-400" />
              </div>
              {chartData && (
                <Chart
                  options={{
                    chart: {
                      type: 'line',
                      height: 300,
                      toolbar: { show: false },
                      zoom: { enabled: false }
                    },
                    dataLabels: { enabled: false },
                    stroke: {
                      curve: 'smooth',
                      width: 3
                    },
                    colors: ['#5E72E4', '#2DCE89'],
                    xaxis: {
                      categories: chartData.trendData.categories,
                      labels: {
                        style: { fontSize: '12px', colors: '#8392AB' }
                      }
                    },
                    yaxis: {
                      labels: {
                        style: { fontSize: '12px', colors: '#8392AB' }
                      }
                    },
                    grid: {
                      borderColor: '#f1f3f4',
                      strokeDashArray: 3
                    },
                    legend: {
                      position: 'top',
                      horizontalAlign: 'right'
                    },
                    tooltip: {
                      shared: true,
                      intersect: false
                    }
                  }}
                  series={chartData.trendData.series}
                  type="line"
                  height={300}
                />
              )}
            </div>

            {/* Status Breakdown Pie Chart */}
            <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Status Breakdown</h3>
                <ApperIcon name="PieChart" className="w-5 h-5 text-gray-400" />
              </div>
              {chartData && chartData.statusData.length > 0 && (
                <Chart
                  options={{
                    chart: {
                      type: 'pie',
                      height: 300
                    },
                    labels: chartData.statusData.map(item => item.name),
                    colors: ['#FB6340', '#FFDA00', '#2DCE89', '#8392AB', '#F5365C'],
                    legend: {
                      position: 'bottom',
                      fontSize: '12px'
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function(val) {
                        return Math.round(val) + '%';
                      },
                      style: {
                        fontSize: '12px',
                        fontWeight: 'bold',
                        colors: ['#fff']
                      }
                    },
                    tooltip: {
                      y: {
                        formatter: function(val) {
                          return val + ' issues';
                        }
                      }
                    }
                  }}
                  series={chartData.statusData.map(item => item.count)}
                  type="pie"
                  height={300}
                />
              )}
            </div>
          </div>

          {/* Priority Distribution and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Priority Distribution Bar Chart */}
            <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Issues by Priority</h3>
                <ApperIcon name="BarChart3" className="w-5 h-5 text-gray-400" />
              </div>
              {chartData && chartData.priorityData.length > 0 && (
                <Chart
                  options={{
                    chart: {
                      type: 'bar',
                      height: 300,
                      toolbar: { show: false }
                    },
                    plotOptions: {
                      bar: {
                        horizontal: true,
                        borderRadius: 4,
                        dataLabels: {
                          position: 'top'
                        }
                      }
                    },
                    colors: ['#F5365C', '#FB6340', '#FFDA00', '#11CDEF'],
                    dataLabels: {
                      enabled: true,
                      offsetX: -6,
                      style: {
                        fontSize: '12px',
                        colors: ['#fff']
                      }
                    },
                    xaxis: {
                      categories: chartData.priorityData.map(item => item.name),
                      labels: {
                        style: { fontSize: '12px', colors: '#8392AB' }
                      }
                    },
                    yaxis: {
                      labels: {
                        style: { fontSize: '12px', colors: '#8392AB' }
                      }
                    },
                    grid: {
                      borderColor: '#f1f3f4'
                    }
                  }}
                  series={[{
                    name: 'Issues',
                    data: chartData.priorityData.map(item => item.count)
                  }]}
                  type="bar"
                  height={300}
                />
              )}
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-white rounded-xl shadow-card border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <ApperIcon name="Activity" className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {recentActivity.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleIssueClick(activity.id)}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${getActivityColor(activity.status)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <ApperIcon name={getActivityIcon(activity.status)} className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Issue #{activity.id}: {activity.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          activity.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                          activity.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          activity.status === 'Critical' ? 'bg-red-100 text-red-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {activity.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(activity.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
              {recentActivity.length === 0 && (
                <div className="text-center py-8">
                  <ApperIcon name="Activity" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;