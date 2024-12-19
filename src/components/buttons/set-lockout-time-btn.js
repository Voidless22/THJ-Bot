const { PermissionsBitField, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const SQLUtils = require('../../sqlUtils');


module.exports = {
    customId: 'set-lockout-time-button',

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles])) {
            await interaction.reply('You need permission to manage channels and roles to use this command.');
            return;
        }
        let timeOptions = [];
        for (let i = 0; i < 13; i++) {
            let time = 5 * i;
            timeOptions[i] = time.toString()
        }

        let timeSelect = new StringSelectMenuBuilder()
            .setCustomId('set-lockout-time-list')
            .setPlaceholder('Ticket Category')
            .addOptions(timeOptions.map(option => { return { label: `${option} Minutes`, description: `${option} Minutes`, value: option } }))
            .setMaxValues(1)
        let selectRow = new ActionRowBuilder().addComponents(timeSelect);

        interaction.reply({ content: 'Select how long you want users to wait after submitting a ticket to submit another(individual timers per category).', components: [selectRow], ephemeral: true })



    }

}
