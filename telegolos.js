const ga = require("golos-addons");
const global = ga.global;
const m = require("./messages");

global.initApp("telegolos");

const CONFIG = global.CONFIG;
const log = global.getLogger("telegolos");

const telegram = require("./telegram");
const Client = require("./client");

const CLIENTS = {}

function getClient(chat_id) {
    let client = CLIENTS[chat_id];
    if (!client) {
        client = new Client(chat_id);
        CLIENTS[chat_id] = client;
    }
    return client;
}

async function processCallback(msg) {
    //log.debug("processCallback", msg);
    const chat_id = msg.from.id;
    try {
        const client = getClient(chat_id);
        await client.processInput(msg.data);
    } catch (e) {
        log.error(e);
        telegram.send(chat_id, m.telegolos.error());
    }
}

async function processMessage(msg) {
    const chat_id = msg.from.id;  
    try {
        const client = getClient(chat_id);
        await client.processInput(msg.text);
    } catch (e) {
        log.error(e);
        telegram.send(chat_id, m.telegolos.error());
    }
}

async function run() {
    await telegram.init(processMessage, processCallback);
}

run();
















