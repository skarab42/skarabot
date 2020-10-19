const usersStore = require("../store/users");

function create(user) {
  return {
    id: null,
    name: null,
    avatarURL: null,
    firstSeen: 0,
    lastSeen: 0,
    viewCount: 0,
    messageCount: 1,
    points: 0,
    ...user
  };
}

function set(id, user) {
  usersStore.set(`list.${id}`, user);
  return user;
}

function get(id, defaultUser = null) {
  return usersStore.get(`list.${id}`, defaultUser);
}

function update(user) {
  user = { ...get(user.id), ...user };
  set(user.id, user);
  return user;
}

function del(id, user) {
  usersStore.delete(`list.${id}`);
}

module.exports = {
  create,
  set,
  get,
  update,
  delete: del
};
