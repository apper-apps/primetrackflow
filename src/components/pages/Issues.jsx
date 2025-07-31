import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { projectsService } from "@/services/api/projects";
import { usersService } from "@/services/api/users";
import { issuesService } from "@/services/api/issues";
import ApperIcon from "@/components/ApperIcon";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import StatusFilter from "@/components/molecules/StatusFilter";
import Header from "@/components/organisms/Header";
import IssuesTable from "@/components/organisms/IssuesTable";
import IssueModal from "@/components/organisms/IssueModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Label from "@/components/atoms/Label";

const Issues = () => {
  const { onMenuClick } = useOutletContext();
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
const [selectedIssue, setSelectedIssue] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [showDetailView, setShowDetailView] = useState(false);
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [issuesData, usersData, projectsData] = await Promise.all([
        issuesService.getAll(),
        usersService.getAll(),
        projectsService.getAll()
      ]);
      
      setIssues(issuesData);
      setUsers(usersData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = issues;

    // Apply status filter
    if (activeFilter !== "All") {
      filtered = filtered.filter(issue => issue.status === activeFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(search) ||
        issue.description.toLowerCase().includes(search) ||
        issue.Id.toString().includes(search)
      );
    }

    setFilteredIssues(filtered);
  }, [issues, activeFilter, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    setShowDetailView(true);
  };

  const handleBackToIssues = () => {
    setShowDetailView(false);
    setSelectedIssue(null);
  };

  const handleEditIssue = () => {
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleNewIssue = () => {
    setSelectedIssue(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleSaveIssue = async (issueData) => {
    try {
      if (modalMode === "create") {
        const newIssue = await issuesService.create(issueData);
        setIssues(prev => [newIssue, ...prev]);
        toast.success("Issue created successfully");
      } else {
        const updatedIssue = await issuesService.update(selectedIssue.Id, issueData);
        setIssues(prev => prev.map(issue => 
          issue.Id === selectedIssue.Id ? updatedIssue : issue
        ));
        setSelectedIssue(updatedIssue);
        toast.success("Issue updated successfully");
      }
    } catch (err) {
      toast.error(`Failed to ${modalMode === "create" ? "create" : "update"} issue`);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedIssue(null);
  };

  const getStatusCounts = () => {
    const counts = {
      total: issues.length,
      open: issues.filter(i => i.status === "Open").length,
      inProgress: issues.filter(i => i.status === "In Progress").length,
      resolved: issues.filter(i => i.status === "Resolved").length,
      closed: issues.filter(i => i.status === "Closed").length
    };
return counts;
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Open":
        return "blue";
      case "In Progress":
        return "yellow";
      case "Resolved":
        return "green";
      case "Closed":
        return "gray";
      default:
        return "gray";
    }
  };
  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Issues"
          onMenuClick={onMenuClick}
          onNewIssue={handleNewIssue}
          onSearch={handleSearch}
        />
        <div className="flex-1 overflow-auto p-6">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Issues"
          onMenuClick={onMenuClick}
          onNewIssue={handleNewIssue}
          onSearch={handleSearch}
        />
        <div className="flex-1 overflow-auto p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

if (showDetailView && selectedIssue) {
    const assignee = users.find(user => user.Id === parseInt(selectedIssue.assigneeId));
    const project = projects.find(p => p.Id === parseInt(selectedIssue.projectId));

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={`Issue #${selectedIssue.Id}`}
          onMenuClick={onMenuClick}
          onNewIssue={handleNewIssue}
          onSearch={handleSearch}
        />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header with Back Button and Edit */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToIssues}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4" />
                <span>Back to Issues</span>
              </button>
              
              <Button
                onClick={handleEditIssue}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
                <span>Edit Issue</span>
              </Button>
            </div>

            {/* Issue Header */}
            <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{selectedIssue.title}</h1>
                <div className="flex items-center space-x-3">
                  <Badge variant={getStatusVariant(selectedIssue.status)}>
                    {selectedIssue.status}
                  </Badge>
                  <PriorityIndicator priority={selectedIssue.priority} showLabel />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <Label className="text-gray-600">Assignee</Label>
                  {assignee ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar
                        src={assignee.avatar}
                        alt={assignee.name}
                        fallback={assignee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        size="sm"
                      />
                      <span className="font-medium text-gray-900">{assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 mt-1 block">Unassigned</span>
                  )}
                </div>

                <div>
                  <Label className="text-gray-600">Project</Label>
                  {project ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <ApperIcon name="FolderOpen" className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{project.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 mt-1 block">No project assigned</span>
                  )}
                </div>

                <div>
                  <Label className="text-gray-600">Created</Label>
                  <span className="text-gray-900 mt-1 block">
                    {format(new Date(selectedIssue.createdAt), "PPpp")}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedIssue.description}
                </p>
              </div>
            </div>

            {/* Comments Section Placeholder */}
            <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="MessageSquare" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No comments yet</p>
                <p className="text-sm">Be the first to add a comment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Issue Modal */}
        <IssueModal
          issue={selectedIssue}
          users={users}
          projects={projects}
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveIssue}
          mode={modalMode}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Issues"
        onMenuClick={onMenuClick}
        onNewIssue={handleNewIssue}
        onSearch={handleSearch}
      />
      
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Status Filter */}
        <StatusFilter
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          statusCounts={getStatusCounts()}
        />

        {/* Issues Table */}
        {filteredIssues.length === 0 ? (
          <Empty
            title={searchTerm ? "No matching issues" : "No issues found"}
            description={
              searchTerm 
                ? `No issues match your search for "${searchTerm}". Try adjusting your search terms.`
                : "Get started by creating your first issue to track bugs, features, and tasks."
            }
            action={handleNewIssue}
            actionLabel="Create First Issue"
          />
        ) : (
          <IssuesTable
            issues={filteredIssues}
            users={users}
            onIssueClick={handleIssueClick}
          />
        )}
      </div>

      {/* Issue Modal */}
      <IssueModal
        issue={selectedIssue}
        users={users}
        projects={projects}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveIssue}
        mode={modalMode}
      />
    </div>
  );
};

export default Issues;