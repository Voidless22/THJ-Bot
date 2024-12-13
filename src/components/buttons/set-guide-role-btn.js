const {RoleSelectMenuBuilder, ActionRowBuilder} = require('discord.js')
module.exports = {
    customId: 'set-guide-role-button',


    run: async (client, interaction) => {
        const guideRoleSelect = new RoleSelectMenuBuilder()
        .setCustomId('guide-role-select');
        let replyActionRow = new ActionRowBuilder().addComponents(guideRoleSelect);
        await interaction.reply({content: 'Select the role you want to have pinged in ticket threads when submitted.', components:[replyActionRow], ephemeral: true})
    }
}