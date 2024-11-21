const { ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
module.exports = {
    customId: 'create-ticket',
    
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {
        const ticketCategories = ["IP Exemption", "Other"]

        const petitionReasonSelect = new StringSelectMenuBuilder()
            .setCustomId('ticket-type')
            .setPlaceholder('Ticket Category')
            .addOptions(ticketCategories.map(category => { return {label: category, description: category, value: category} }));

        const petitionReasonRow = new ActionRowBuilder().addComponents([petitionReasonSelect]);

        await interaction.reply({
            components: [petitionReasonRow],
            ephemeral: true
        })
    }
};
