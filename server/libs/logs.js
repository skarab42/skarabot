const logsStore = require("../store/logs");
const users = require("../libs/users");
const { v4: uuid } = require("uuid");

function create(type, data) {
  return { id: uuid(), time: Date.now(), type, data };
}

function getAll() {
  return logsStore.get("logs", []).map((log) => {
    return { ...log, user: users.get(log.data.userId) };
  });
}

function set(logs) {
  logsStore.set(
    `logs`,
    logs.map((log) => {
      let logCopy = { ...log };
      delete logCopy.user;
      return logCopy;
    })
  );
}

function add(type, data) {
  const logs = getAll();
  const log = create(type, data);
  logs.push(log);
  set(logs);
  return log;
}

function del(id) {
  const logs = getAll().filter((l) => l.id !== id);
  logsStore.set(`logs`, logs);
  return logs;
}

module.exports = {
  create,
  add,
  getAll,
  delete: del,
};
