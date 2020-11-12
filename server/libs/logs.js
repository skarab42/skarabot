const logsStore = require("../store/logs");
const { v4: uuid } = require("uuid");

function create(type, data) {
  return { id: uuid(), time: Date.now(), type, data };
}

function getAll() {
  return logsStore.get("logs", []);
}

function add(type, data) {
  const logs = getAll();
  const log = create(type, data);
  logs.push(log);
  logsStore.set(`logs`, logs);
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
