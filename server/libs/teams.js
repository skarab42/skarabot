const teamsStore = require("../store/teams");

function create(team) {
  return {
    name: null,
    icon: null,
    ...team,
  };
}

function set(name, team) {
  teamsStore.set(`list.${name}`, team);
  return team;
}

function get(name, defaultteam = null) {
  return teamsStore.get(`list.${name}`, defaultteam);
}

function update(newteam) {
  const team = { ...get(newteam.name), ...newteam };
  set(team.name, team);
  return team;
}

function del(name) {
  teamsStore.delete(`list.${name}`);
}

function getAll() {
  return teamsStore.get("list", {});
}

module.exports = {
  create,
  set,
  get,
  getAll,
  update,
  delete: del,
};
