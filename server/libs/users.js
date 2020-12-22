const usersStore = require("../store/users");

function create(user) {
  return {
    id: null,
    name: null,
    avatarURL: null,
    firstSeen: 0,
    lastSeen: 0,
    lastHighlight: 0,
    viewCount: 0,
    messageCount: 1,
    points: 0,
    position: { x: 0, y: 0 },
    ...user,
  };
}

function set(id, user) {
  usersStore.set(`list.${id}`, user);
  return user;
}

function get(id, defaultUser = null) {
  return usersStore.get(`list.${id}`, defaultUser);
}

function getByName(name) {
  return Object.values(getAll()).find(
    (user) => user.name.toLowerCase() === name.toLowerCase()
  );
}

function update(newUser) {
  const user = { ...get(newUser.id), ...newUser };
  set(user.id, user);
  return user;
}

function del(id) {
  usersStore.delete(`list.${id}`);
}

function getAll() {
  return usersStore.get("list", {});
}

module.exports = {
  create,
  set,
  get,
  getAll,
  update,
  getByName,
  delete: del,
};
