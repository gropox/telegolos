
const m = require("./messages");
const ga = require("golos-addons");
const golos = ga.golos;

module.exports.check_account = async (acc) => {
    let ok = true;
    let errmsg = null;
    if (!(await golos.getAccount(acc))) {
        ok = false;
        errmsg = m.golos.account_does_not_exists(acc);
    }

    return {
        ok, acc, errmsg
    }
}


module.exports.check_amount = async (acc_name, _amount) => {

    const amount = parseFloat(_amount);
    let errmsg = null;
    let ok = !isNaN(amount);
    if (!ok || amount < 0) {
        errmsg = m.golos.not_a_number(_amount);
    }

    if (ok) {
        //check available balance
        const { sbd_balance, balance } = await golos.getAccount(acc_name);
        const sbd = parseFloat(sbd_balance.split(" ")[0]);
        if (sbd < amount) {
            errmsg = m.golos.not_enough_balance(sbd_balance, amount);
            ok = false;
        }
    }

    return {
        amount, ok, errmsg
    }
}

module.exports.check_wif = async (wif) => {
    let ok = golos.golos.auth.isWif(wif);
    let errmsg = null;
    if (!ok) {
        errmsg = m.golos.wrong_wif();
    }
    return {
        wif, ok, errmsg
    }
}