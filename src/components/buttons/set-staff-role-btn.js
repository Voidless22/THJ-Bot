const {PermissionsBitField, RoleSelectMenuBuilder, ActionRowBuilder } = require('discord.js')
module.exports = {
    customId: 'set-staff-role-button',
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles])) {
            await interaction.reply('You need permission to manage channels and roles to use this command.');
            return;
        }
        const guideRoleSelect = new RoleSelectMenuBuilder()
            .setCustomId('staff-role-select');
        let replyActionRow = new ActionRowBuilder().addComponents(guideRoleSelect);
        await interaction.reply({ content: 'Select the role you want to have pinged in ticket threads when submitted.', components: [replyActionRow], ephemeral: true })
    }
}