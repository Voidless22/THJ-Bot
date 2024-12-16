const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');
const setCategoryLogChannelBtn = require('../../components/buttons/set-category-log-channel-btn');
module.exports = {
    name: 'ticketsetup',
    structure: new SlashCommandBuilder()
        .setName('ticketsetup')
        .setDescription('Set up ticket creation and reception.'),

    run: async (client, interaction, args) => {
        if (!interaction.member.permissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles])) {
            await interaction.reply('You need permission to manage channels and roles to use this command.');
            return;
        }

        let enableCategoryButton = new ButtonBuilder()
            .setCustomId('enable-category-button')
            .setLabel('Enable Category')
            .setStyle(1);
        let setCategoryChannelButton = new ButtonBuilder()
            .setCustomId('set-category-channel-button')
            .setLabel('Set Category Channel')
            .setStyle(1);
        let SetCategoryLogChannelButton = new ButtonBuilder()
            .setCustomId('set-category-log-channel-button')
            .setLabel('Set Log/Archival Category Channel')
            .setStyle(1);
        let sendCreateTicketButton = new ButtonBuilder()
            .setCustomId('send-create-ticket-button')
            .setLabel('Set Channel Tickets are Created')
            .setStyle(1);
        let disableCategoryButton = new ButtonBuilder()
            .setCustomId('disable-category-button')
            .setLabel('Disable Category')
            .setStyle(1);
        let previewCategoryButton = new ButtonBuilder()
            .setCustomId('preview-category-button')
            .setLabel('Preview Category')
            .setStyle(1);
        let setGuideRole = new ButtonBuilder()
            .setCustomId('set-staff-role-button')
            .setLabel('Set Staff Role')
            .setStyle(3);
        let enableCategoryPing = new ButtonBuilder()
            .setCustomId('enable-category-ping-button')
            .setLabel('Enable Category Ping')
            .setStyle(3);
        let disableCategoryPing = new ButtonBuilder()
            .setCustomId('disable-category-ping-button')
            .setLabel('Disable Category Ping')
            .setStyle(3);

        const firstRow = new ActionRowBuilder().addComponents([enableCategoryButton, disableCategoryButton, setCategoryChannelButton, sendCreateTicketButton]);
        const secondRow = new ActionRowBuilder().addComponents([enableCategoryPing, disableCategoryPing, previewCategoryButton, SetCategoryLogChannelButton]);
        const thirdRow = new ActionRowBuilder().addComponents([setGuideRole])
        await interaction.reply({ components: [firstRow, secondRow, thirdRow] })
    }
}
