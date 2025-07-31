import issuesData from "@/services/mockData/issues.json";

let issues = [...issuesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const issuesService = {
  async getAll() {
    await delay(300);
    return [...issues];
  },

  async getById(id) {
    await delay(200);
    const issue = issues.find(item => item.Id === parseInt(id));
    if (!issue) {
      throw new Error("Issue not found");
    }
    return { ...issue };
  },
async create(issueData) {
    await delay(400);
    const newIssue = {
      Id: Math.max(...issues.map(i => i.Id)) + 1,
      ...issueData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusChangedAt: new Date().toISOString()
    };
    issues.push(newIssue);
    return { ...newIssue };
  },
  async update(id, updateData) {
    await delay(300);
    const index = issues.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Issue not found");
    }
    
    const currentIssue = issues[index];
    const statusChanged = updateData.status && updateData.status !== currentIssue.status;
    
    issues[index] = {
      ...currentIssue,
      ...updateData,
      updatedAt: new Date().toISOString(),
      ...(statusChanged && { statusChangedAt: new Date().toISOString() })
    };
    return { ...issues[index] };
  },

  async updateStatus(id, newStatus) {
    await delay(200);
    const index = issues.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Issue not found");
    }
    
    const currentIssue = issues[index];
    if (currentIssue.status === newStatus) {
      return { ...currentIssue };
    }
    
    issues[index] = {
      ...currentIssue,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      statusChangedAt: new Date().toISOString()
    };
    return { ...issues[index] };
  },

  async delete(id) {
    await delay(250);
    const index = issues.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Issue not found");
    }
    issues.splice(index, 1);
    return true;
  },

  async getByStatus(status) {
    await delay(250);
    return issues.filter(issue => issue.status === status);
  },

async search(query) {
    await delay(200);
    if (!query || !query.trim()) {
      return [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    return issues
      .filter(issue => 
        issue.title.toLowerCase().includes(searchTerm) ||
        issue.description.toLowerCase().includes(searchTerm) ||
        issue.Id.toString().includes(searchTerm) ||
        issue.status.toLowerCase().includes(searchTerm) ||
        issue.priority.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => {
        // Prioritize title matches over description matches
        const aTitleMatch = a.title.toLowerCase().includes(searchTerm);
        const bTitleMatch = b.title.toLowerCase().includes(searchTerm);
        
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        
        // Secondary sort by priority (Critical > High > Medium > Low)
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority.toLowerCase()] || 0;
        const bPriority = priorityOrder[b.priority.toLowerCase()] || 0;
        
        return bPriority - aPriority;
      });
  }
};

// Named export for direct import compatibility
export const getAllIssues = () => issuesService.getAll();