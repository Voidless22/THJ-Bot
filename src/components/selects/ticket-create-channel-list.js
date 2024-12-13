const {ButtonBuilder, ActionRowBuilder } = require('discord.js');
const SQLUtils = require('../../sqlUtils');



module.exports = {
    customId: 'ticket-create-channel-list',

    run: async (client, interaction) => {
        const selectedChannel = interaction.values[0];
        const createButtonChannelId = client.channels.cache.get(selectedChannel);
        const createPetitionButton = new ButtonBuilder()
            .setCustomId('create-ticket')
            .setLabel('Create Ticket')
            .setStyle(1);

        const row = new ActionRowBuilder().addComponents(createPetitionButton);

        await createButtonChannelId.send({ components: [row] });
        await interaction.reply({content: "Users are now one click away from submitting a ticket!", ephemeral: true})
    }
}
