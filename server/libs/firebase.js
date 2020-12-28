function onTeamChange(req) {
    const io = require("../io")();
    io.emit("firebase.teamChange", req.query.id);
}

module.exports = { onTeamChange };
