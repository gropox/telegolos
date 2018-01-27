const telegram = require("./telegram");
const Transfer = require("./transfer");
const m = require("./messages");

const COMMANDS = {
    START: "/start",
    TRANSFER: "/transfer",
    MENU: "/menu",
    HELP: "/help"
}

class Client {
    constructor(chat_id) {
        this.chat_id = chat_id;
        this.processor = null;
    }

    async _doHelp() {
        await telegram.send(this.chat_id, m.telegolos.help());
    }

    async processInput(msg) {
    
        switch (msg) {
            case COMMANDS.TRANSFER: {
                this.processor = new Transfer();
                await this.processor.sendMessage(this.chat_id);
            } break;
            case COMMANDS.MENU:
            case COMMANDS.HELP: {
                await this._doHelp();
            } break;
            default:
                if (this.processor) {
                    if(await this.processor.processInput(this.chat_id, msg)) {
                        this.processor = null;
                    } else {
                        await this.processor.sendMessage(this.chat_id);
                    }
                } else {
                    await this._doHelp();
                }
        }
    }
}

module.exports = Client;
