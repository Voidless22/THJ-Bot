const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField  } = require('discord.js');
const utils = require('../../utils');
const SQLUtils = require('../../sqlUtils');

const createSuccessEmbed = new EmbedBuilder()
    .setTitle('Ticket Delivery')
    .setDescription(`## Great! Let's decide where tickets for each category are sent. \n There are predefined types, but you can add custom categories(soon:tm:).`);
module.exports = {
    customId: 'ticket-create-channel-select',
    run: async (client, interaction) => {
        // 
        const selectedChannel = interaction.values[0];
        const channelId = client.channels.cache.get(selectedChannel);

        console.log(selectedChannel);
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
        console.log(`Selected Channel ${selectedChannel}, guild ID ${interaction.guildId}`);
        SQLUtils.SQLQuery('UPDATE `guilds` SET create_ticket_channel=? WHERE guild_id=?', [selectedChannel,interaction.guildId]);
        await interaction.reply({embeds: [createSuccessEmbed]})


    }

};