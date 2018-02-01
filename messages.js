module.exports.golos = {
    wrong_account_name: (acc) => `Введеный аккаунт ${acc} неверен. (макс. 16 знаков, разрешены латинские буквы, цифры, "-" и ".")`,
    account_does_not_exists: (acc) => `Введеный аккаунт ${acc} не существует`,
    wif_is_wrong: () => `Неверный введенный ключ. Требуется приватный, активный ключ. Начинается с 5..`,
    not_a_number: (amount) => `Сумма к переводу должно быть положительное число, с точкой в качестве разделителя дробной части. (${amount})`,
    not_enough_balance: (available, required) => `Недостаточно средств на балансе ${available} (${required})`,
    wrong_wif: () => `Неверный активный ключ. Требуется приватный, активный ключ. Должен начинаться на 5.`    
}

module.exports.transfer = {
    from: () => `Введите аккаунт с которого будут переведены токены`,
    to: () => `Введите аккаунт которому будет сделан перевод`,
    memo: () => `Введите текст заметки`,
    wif: () => `Введите приватный, активный ключ`,
    amount: () => `Введите сумму в GBG для перевода`,
    done: () => `Перевод выполнен`,
    cancel: () => `Перевод был отменен`,
    summary: (tr) => `Перевод *${tr.amount.toFixed(3) + " GBG"}* от *${tr.from}* к *${tr.to}*
Заметка:
${tr.memo}

Выполнить перевод?
`,
    missing_authority: (tr) => `Нет прав на перевод монет. Введен активный ключ?`
}

module.exports.telegolos = {
    help: () => `Выберите действие`,
    yes: () => `Да`,
    no: () => `Нет`,
    error: () => `Внутренняя ошибка, пожалуйста сообщите администратору`,
    cancel: () => `Отмена`,
    transferMenu: () => `Перевод золотых`
}