const { ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const utils = require('../../utils');
const SQLUtils = require('../../sqlUtils');
const ticketUtils = require('../../ticketUtils');

module.exports = {
    customId: 'create-ticket',
    
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {
        const ticketCategories = await ticketUtils.getTicketCategory();

        const petitionReasonSelect = new StringSelectMenuBuilder()
            .setCustomId('ticket-type')
            .setPlaceholder('Ticket Category')
            .addOptions(ticketCategories.map(category => { return {label: category.name, description: category.name, value: category.name} }));

        const petitionReasonRow = new ActionRowBuilder().addComponents([petitionReasonSelect]);

        await interaction.reply({
            components: [petitionReasonRow],
            ephemeral: true
        })
    }
};
