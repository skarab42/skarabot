const usersStore = require("../store/users");
// const fetch = require("node-fetch");

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
    ...user
  };
}

// const screenSize = { width: 1920, height: 1080 };
// const imgSize = { width: 100, height: 100 };
// screenSize.width -= imgSize.width;
// screenSize.height -= imgSize.height;
//
// function random(min, max) {
//   return Math.random() * (max - min) + min;
// }
//
// Object.values(getAll()).forEach(user => {
//   update({
//     ...user,
//     lastHighlight: 0
//   });
// });

function set(id, user) {
  usersStore.set(`list.${id}`, user);
  return user;
}

function get(id, defaultUser = null) {
  return usersStore.get(`list.${id}`, defaultUser);
}

function getByName(name) {
  return Object.values(getAll()).find(
    user => user.name.toLowerCase() === name.toLowerCase()
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
  delete: del
};
