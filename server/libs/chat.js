const ChatMessage = require('../db/models/ChatMessage');

async function addMessage(message) {
    return await ChatMessage.create(message);
}

function computeMessage(emotes) {
    return emotes.map(emote => {
        if (emote.type === 'emote') {
            return `[:emote|${emote.id}|${emote.name}]`
        }
        return emote.text;
    }).join('');
}

async function getLastMessages({ limit = 10 } = {}) {
    const messages = await ChatMessage.findAll({ limit, order: [['time', 'DESC']] });
    return messages.map(message => message.toJSON());
}

module.exports = {
    addMessage,
    computeMessage,
    getLastMessages
}