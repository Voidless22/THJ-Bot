// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const BotClient = require('./BotClient')
const utils = require('./utils')
require('dotenv').config();


// Create a new client instance
const client = new BotClient();
client.on('guildCreate', async (guild) => {
    await utils.SQLQuery("CREATE TABLE IF NOT EXISTS `guilds` (guild_id BIGINT, owner_id BIGINT)");
    await utils.SQLQuery("INSERT INTO guilds (guild_id, owner_id) VALUES (?, ?)", [guild.id, guild.ownerId]);
    console.log(`Guild ${guild.name} (${guild.id}) has been added to the database.`)
});

client.loadCommands();
client.loadEvents();
client.loadComponents();
//client.deploySlashCommands();
client.start();