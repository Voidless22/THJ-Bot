// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const BotClient = require('./BotClient')
require('dotenv').config();


// Create a new client instance
const client = new BotClient();

client.loadCommands();
client.loadEvents();
client.loadComponents();
//client.deploySlashCommands();
client.start();