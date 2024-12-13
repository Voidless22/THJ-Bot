const { SlashCommandBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, PermissionsBitField, StringSelectMenuBuilder, ActionRow } = require('discord.js');
const ticketUtils = require('../../ticketUtils');
const SQLUtils = require('../../sqlUtils')
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
            .setCustomId('set-guide-role-button')
            .setLabel('Set Guide Role')
            .setStyle(3);

        const firstRow = new ActionRowBuilder().addComponents([enableCategoryButton, setCategoryChannelButton, sendCreateTicketButton]);
        const secondRow = new ActionRowBuilder().addComponents([disableCategoryButton, previewCategoryButton, setGuideRole]);

        await interaction.reply({ components: [firstRow, secondRow] })
    }
}
