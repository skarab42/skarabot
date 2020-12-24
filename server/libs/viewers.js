const Viewer = require('../db/models/Viewer');

async function addViewer(viewer) {
    return await Viewer.create(viewer);
}

async function updateOrAddViewer(viewer) {
    return await Viewer.upsert(viewer);
}

async function getViewerById(id) {
    return await Viewer.findOne({ where: { id } });
}

async function getViewerByName(name) {
    return await Viewer.findOne({ where: { name } });
}

async function updateViewer(viewer) {
    await Viewer.update(viewer, { where: { id: viewer.id } });
    return await getViewerById(viewer.id);
}

async function getFamouseViewers({ limit = 100 } = {}) {
    const viewers = await Viewer.findAll({ limit, order: [['updatedAt', 'DESC']] });
    return viewers.map(viewer => viewer.toJSON());
}

module.exports = {
    addViewer,
    updateViewer,
    getViewerById,
    updateOrAddViewer,
    getFamouseViewers,
    getViewerByName
}