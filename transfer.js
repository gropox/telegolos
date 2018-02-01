const m = require("./messages");
const ga = require("golos-addons");
const golos = ga.golos;

const golos_tools = require("./golos_tools");
const telegram = require("./telegram");

const log = ga.global.getLogger("transfer");

const STATES = {
    FROM: "FROM",
    AMOUNT: "AMOUNT",
    TO: "TO",
    MEMO: "MEMO",
    WIF: "WIF",
    DO_TRANSFER: "DO_TRANSFER",
    DONE: "DONE"
}

class Transfer {

    constructor() {
        this.state = STATES.FROM;
        this.from = null;
        this.to = null;
        this.memo = null;
        this.amount = null;
        this.wif = null;
    }

    async processInput(chat_id, msg) {
        log.debug("process input", msg);
        if (this.state == STATES.DO_TRANSFER) {
            if (msg === m.telegolos.yes()) {
                try {
                    log.debug("do transfer")
                    await golos.golos.broadcast.transferAsync(this.wif, this.from, this.to, this.amount.toFixed(3) + " GBG", this.memo);
                    await telegram.send(chat_id, m.transfer.done());
                } catch (e) {
                    let errmsg = JSON.stringify(golos.getExceptionCause(e));
                    if (errmsg.match(/3010000/)) {
                        await telegram.send(chat_id, m.transfer.missing_authority(this));
                    } else {
                        throw e;
                    }
                }
            } else {
                await telegram.send(chat_id, m.transfer.cancel());
            }
            this.state = STATES.DONE;
        } else if (this.state != STATES.DONE) {
            const res = await this._processInput(chat_id, msg);
            if (res.ok) {
                this.next();
            } else {
                await telegram.send(chat_id, res.errmsg);
            }
            return false;
        } 
        
        return true;
    }

    async _processInput(chat_id, msg) {
        switch (this.state) {
            case STATES.FROM:
                {
                    const res = await golos_tools.check_account(msg);
                    if (res.ok) {
                        this.from = res.acc;
                    }
                    return res;
                }
            case STATES.AMOUNT:
                {
                    const res = await golos_tools.check_amount(this.from, msg);
                    if (res.ok) {
                        this.amount = res.amount;
                    }
                    return res;
                }
            case STATES.TO:
                {
                    const res = await golos_tools.check_account(msg);
                    if (res.ok) {
                        this.to = res.acc;
                    }
                    return res;
                }
            case STATES.MEMO:
                { 
                    this.memo = msg;
                    log.debug("memo", this.memo);
                    return {ok:true};
                }
            case STATES.WIF:
                {
                    const res = await golos_tools.check_wif(msg);
                    if (res.ok) {
                        this.wif = res.wif;
                    }
                    return res;
                }
        }
    }

    async sendMessage(chat_id) {
        switch (this.state) {
            case STATES.FROM:
                await telegram.send(chat_id, m.transfer.from());
                break;
            case STATES.AMOUNT:
                await telegram.send(chat_id, m.transfer.amount());
                break;
            case STATES.TO:
                await telegram.send(chat_id, m.transfer.to());
                break;
            case STATES.MEMO:
                await telegram.send(chat_id, m.transfer.memo());
                break;
            case STATES.WIF:
                await telegram.send(chat_id, m.transfer.wif());
                break;
            case STATES.DO_TRANSFER:
                await telegram.sendConfirm(chat_id, m.transfer.summary(this));
                break;
            case STATES.DONE:
                await telegram.send(chat_id, m.transfer.done());
                break;
        }
    }

    next() {
        switch (this.state) {
            case STATES.FROM:
                this.state = STATES.AMOUNT;
                break;
            case STATES.AMOUNT:
                this.state = STATES.TO;
                break;
            case STATES.TO:
                this.state = STATES.MEMO;
                break;
            case STATES.MEMO:
                this.state = STATES.WIF;
                break;
            case STATES.WIF:
                this.state = STATES.DO_TRANSFER;
                break;
            case STATES.DO_TRANSFER:
                this.state = STATES.DONE;
                break;
        }
    }

}

module.exports = Transfer;