const { REST, Routes, Client, Partials, Collection, GatewayIntentBits, ActivityType } = require("discord.js");
const { readdirSync } = require("fs");

require('dotenv').config();

module.exports = class extends Client {
    constructor() {
        super({
            intents: [Object.keys(GatewayIntentBits)],
            partials: [Object.keys(Partials)],
        });
        this.deployArray = new Collection();
        this.slashCommands = new Map();
        this.prefixCommands = new Collection();
        this.commandAliases = new Collection();

        this.Components = {
            buttons: new Collection(),
            selects: new Collection(),
            modals: new Collection()
        }
        this.deploySlashCommands = async () => {
            const rest = new REST().setToken(process.env.BOT_TOKEN);
            console.log('Started loading application commands... (this might take minutes!)', 'warn');
            // Dev Commands Deploy
            try {
                let staleDevData = await rest.put(Routes.applicationGuildCommands(process.env.BOT_ID, "1302694166266118175"), {
                    body: []
                });

                console.log('Cleared Prior Commands..');
            } catch (e) {
                console.log('Unable to clear application commands to Discord API. error: %s', e);
            };
            try {
                let newDevData = await rest.put(Routes.applicationGuildCommands(process.env.BOT_ID, "1302694166266118175"), {
                    body: this.deployArray
                });

                console.log('Successfully loaded application commands to Discord API.', 'done');
            } catch (e) {
                console.log('Unable to load application commands to Discord API. error: %s', e);
            };
            // Global Command deploy
            try {
                let staleDevData = await rest.put(Routes.applicationCommands(process.env.BOT_ID), {
                    body: []
                });

                console.log('Cleared Prior Commands..');
            } catch (e) {
                console.log('Unable to clear application commands to Discord API. error: %s', e);
            };
            try {
                let newDevData = await rest.put(Routes.applicationCommands(process.env.BOT_ID), {
                    body: this.deployArray
                });

                console.log('Successfully loaded application commands to Discord API.', 'done');
            } catch (e) {
                console.log('Unable to load application commands to Discord API. error: %s', e);
            };

        }
        this.loadCommands = () => {
            for (const type of readdirSync('./src/commands/')) {
                for (const file of readdirSync('./src/commands/' + type).filter((f) => f.endsWith('.js'))) {
                    const module = require('./commands/' + type + '/' + file);
                    if (!module) continue;
                    if (!module.structure?.name || !module.run) {
                        console.log("Unable to load command the following command: [%s] - Missing name and/or run properties.", file);
                        continue;
                    } else {
                        this.slashCommands.set(module.structure.name, module);
                        this.deployArray.set(module.structure.name, module.structure.toJSON());
                        console.log("Loaded New Command [%s]", file);
                    }

                }
            }
        }
        this.loadEvents = () => {
            for (const dir of readdirSync('./src/events/')) {
                for (const file of readdirSync('./src/events/' + dir).filter((f) => f.endsWith('.js'))) {
                    const module = require('./events/' + dir + '/' + file);
                    if (!module) {
                        continue;
                    }
                    if (!module.event || !module.run) {
                        console.log('Error loading event: %s -- mising name or run properties.', file);
                        continue;
                    }
                    if (module.once) {
                        this.once(module.event, (...args) => module.run(this, ...args));
                    } else {
                        this.on(module.event, (...args) => module.run(this, ...args));
                    }
                    console.log('Successfully loaded Event: %s', file);
                }
            }
        }
        this.loadComponents = () => {
            for (const dir of readdirSync('./src/components/')) {
                for (const file of readdirSync('./src/components/' + dir).filter((f) => f.endsWith('.js'))) {
                    const module = require('./components/' + dir + '/' + file);
                    if (!module) continue;
                    if (dir === 'buttons') {
                        if (!module.customId || !module.run) {
                            console.log('Unable to load the component ' + file + ' due to missing \'structure#customId\' or/and \'run\' properties.', 'warn');
                            continue;
                        };
                        this.Components.buttons.set(module.customId, module);
                    } else if (dir === 'selects') {
                        if (!module.customId || !module.run) {
                            console.log('Unable to load the select menu ' + file + ' due to missing \'structure#customId\' or/and \'run\' properties.', 'warn');

                            continue;
                        };
                        this.Components.selects.set(module.customId, module);
                    } else if (dir === 'modals') {
                        if (!module.customId || !module.run) {
                            console.log('Unable to load the modal ' + file + ' due to missing \'structure#customId\' or/and \'run\' properties.', 'warn');

                            continue;
                        };
                        this.Components.modals.set(module.customId, module);
                    } else {
                        console.log('Invalid component type: ' + file, 'warn');
                        continue;
                    };
                    console.log('Loaded new component: ' + file, 'info');
                };
            };
        }
        this.getInteractionType = (interaction) => {
            if (interaction.isChatInputCommand()) return 0;
            if (interaction.isButton()) return 1;
            if (interaction.isAnySelectMenu()) return 2;
            if (interaction.isModalSubmit()) return 3;
        }
        this.start = async () => {
            await this.login(process.env.BOT_TOKEN)
        }

    }
}