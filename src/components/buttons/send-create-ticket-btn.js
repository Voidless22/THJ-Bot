const {ChannelSelectMenuBuilder, ActionRowBuilder} = require('discord.js')
module.exports = {
    customId: 'send-create-ticket-button',


    run: async (client, interaction) => {
        const ticketCreateChannelSelect = new ChannelSelectMenuBuilder()
            .setCustomId('ticket-create-channel-list')
            .setChannelTypes([0]);
        let replyActionRow = new ActionRowBuilder().addComponents(ticketCreateChannelSelect);
        await interaction.reply({content: 'Select the channel you want users to go to create tickets.', components:[replyActionRow], ephemeral: true})
    }
}
