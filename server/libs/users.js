const usersStore = require("../store/users");

module.exports = {
  set(id, user) {
    usersStore.set(`list.${id}`, user);
  },

  get(id, defaultUser = null) {
    return usersStore.get(`list.${id}`, defaultUser);
  },

  update(user) {
    set(user.id, { ...get(user.id), ...user });
  },

  delete(id, user) {
    usersStore.delete(`list.${id}`);
  }
};
