const m = require("./messages");

var TeleBot = require("telebot");
const ga = require("golos-addons");
const global = ga.global;

const CONFIG = global.CONFIG;
const log = global.getLogger("telegram");

let bot = null;

function buildMenuKbd() {
    return bot.inlineKeyboard([
        [bot.inlineButton(m.telegolos.transferMenu(), { callback: m.telegolos.transferMenu() })],
    ]);
}

module.exports.buildMenuKbd = buildMenuKbd;

async function send(chat_id, msg, kbd) {
    let opts = { parse: "Markdown" };
    log.debug("msg", msg);
    log.debug("kbd", kbd);
    if (kbd) {
        opts.markup = kbd;
    }
    return bot.sendMessage(chat_id, msg, opts)
}

async function defaultMsgHandler(msg) {

}

module.exports.send = send;

module.exports.sendConfirm = (chat_id, msg) => {
    let kbd = bot.inlineKeyboard([
        [bot.inlineButton(m.telegolos.yes(), { callback: m.telegolos.yes() }), bot.inlineButton(m.telegolos.no(), { callback: m.telegolos.no() })],
    ]);

    send(chat_id, msg, kbd);
}

module.exports.init = function (onMsg, onCallback) {
    bot = new TeleBot({
        token: CONFIG.token,
        polling: {
            interval: 1000, // Optional. How often check updates (in ms). 
            timeout: 60,
            limit: 100,  //updates
            retryTimeout: 5000
        },
        usePlugins: ['commandButton']
    });

    bot.on('text', onMsg);

    // Button callback
    bot.on('callbackQuery', (msg) => {
        onCallback(msg);
        bot.answerCallbackQuery(msg.id);

    });    

    bot.connect();
}


