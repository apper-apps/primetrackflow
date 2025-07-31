import projectsData from "@/services/mockData/projects.json";

let projects = [...projectsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const projectsService = {
  async getAll() {
    await delay(250);
    return [...projects];
  },

  async getById(id) {
    await delay(150);
    const project = projects.find(item => item.Id === parseInt(id));
    if (!project) {
      throw new Error("Project not found");
    }
    return { ...project };
  },

  async create(projectData) {
    await delay(350);
    const newProject = {
      Id: Math.max(...projects.map(p => p.Id)) + 1,
      ...projectData,
      createdAt: new Date().toISOString()
    };
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, updateData) {
    await delay(300);
    const index = projects.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    projects[index] = { ...projects[index], ...updateData };
    return { ...projects[index] };
  },

  async delete(id) {
    await delay(200);
    const index = projects.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    projects.splice(index, 1);
    return true;
  }
};