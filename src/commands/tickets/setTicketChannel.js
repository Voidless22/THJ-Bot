const { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'setticketchannel',
    structure: new SlashCommandBuilder()
        .setName('setticketchannel')
        .setDescription('Sets the default channel for users to create tickets in.'),


    run: async (client, interaction, args) => {
        const channelId = client.channels.cache.get(interaction.channel.id);

        if (!interaction.member.permissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles])) {
            await interaction.reply('You need permission to manage channels and roles to use this command.');
            return;
        }

        const createPetitionButton = new ButtonBuilder()
            .setCustomId('create-ticket')
            .setLabel('Create Ticket')
            .setStyle(1);

        const row = new ActionRowBuilder().addComponents(createPetitionButton);

        await channelId.send({ components: [row] });
        await interaction.reply('Set the default channel for users to create petitions in to <#' + channelId.id + '>')
    }
}