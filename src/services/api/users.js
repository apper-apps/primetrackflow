import usersData from "@/services/mockData/users.json";

let users = [...usersData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const usersService = {
  async getAll() {
    await delay(200);
    return [...users];
  },

  async getById(id) {
    await delay(150);
    const user = users.find(item => item.Id === parseInt(id));
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  },

  async create(userData) {
    await delay(300);
    const newUser = {
      Id: Math.max(...users.map(u => u.Id)) + 1,
      ...userData
    };
    users.push(newUser);
    return { ...newUser };
  },

  async update(id, updateData) {
    await delay(250);
    const index = users.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    users[index] = { ...users[index], ...updateData };
    return { ...users[index] };
  },

  async delete(id) {
    await delay(200);
    const index = users.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    users.splice(index, 1);
    return true;
  }
};