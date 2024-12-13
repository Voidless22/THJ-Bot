// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const BotClient = require('./BotClient')
const utils = require('./utils')
const SQLUtils = require('./sqlUtils');
const ticketUtils = require('./ticketUtils');

require('dotenv').config();


// Create a new client instance
const client = new BotClient();
async function setupDB() {
    await SQLUtils.genDB();

    await ticketUtils.genTicketPresets();
}

setupDB();
//utils.getTicketPresets(1302694166266118175);
client.loadCommands();
client.loadEvents();
client.loadComponents();
//client.deploySlashCommands();
client.start();

client.on("messageCreate", (message) => {
    if (message.content.toLowerCase() === "computer, explain the aa bonus") {
        message.reply("Let's say you have a singular character. For that character, up until 150 AAs, you get a bonus on the exp per kill. Let's fast forward, you've got 500 AAs on that character, and you're ready to start AAing on your next alt. That alt now has a bonus on aa exp until 500 AAs. The bonus cap is the sum of all every character's AA count on the account.");
    }
});