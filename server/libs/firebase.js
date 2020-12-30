const axios = require("axios");

let fetchedViewers = {};

const dev = false;
const funcURL = dev
  ? "http://localhost:5001/skara-bot/us-central1"
  : "https://us-central1-skara-bot.cloudfunctions.net";

async function fetchViewers(ids) {
  const url = `${funcURL}/getViewers`;
  const res = await axios(url, { method: "POST", data: ids });
  fetchedViewers = { ...fetchedViewers, ...res.data };
  return res.data;
}

async function fetchViewer(id, force = false) {
  if (!force && fetchedViewers[id]) {
    return fetchedViewers[id];
  }
  const viewers = await fetchViewers([id]);
  return viewers[id];
}

async function onTeamChange(req) {
  const io = require("../io")();
  const id = req.query.id;
  const viewer = await fetchViewer(id, true);
  io.emit("viewer.teamChange", { id, ...viewer });
}

module.exports = {
  onTeamChange,
  fetchViewers,
  fetchViewer,
  fetchedViewers,
};
