import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import StatusFilter from "@/components/molecules/StatusFilter";
import IssuesTable from "@/components/organisms/IssuesTable";
import IssueModal from "@/components/organisms/IssueModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { issuesService } from "@/services/api/issues";
import { usersService } from "@/services/api/users";
import { projectsService } from "@/services/api/projects";

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
    setModalMode("view");
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