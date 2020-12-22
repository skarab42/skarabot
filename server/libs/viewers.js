const Viewer = require('../db/models/Viewer');

async function addViewer(viewer) {
    return await Viewer.create(viewer);
}

async function updateOrAddViewer(viewer) {
    return await Viewer.upsert(viewer);
}

async function updateViewer(viewer) {
    return await Viewer.update(viewer, { where: { id: viewer.id } });
}

async function getViewerById(id) {
    return await Viewer.findOne({ where: { id } });
}

module.exports = {
    addViewer,
    updateViewer,
    getViewerById,
    updateOrAddViewer
}