const { ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const utils = require('../../utils');
const SQLUtils = require('../../sqlUtils');
const ticketUtils = require('../../ticketUtils');

async function processCategories(client, categories) {
    const results = await Promise.all(
        categories.map(async (category) => {
            // Ensure the ID is a string
            category.ticket_recieve_channel = String(category.ticket_recieve_channel);

            const description = await returnStatus(client, category);
            return {
                label: category.name,
                description,
                value: category.name,
            };
        })
    );

    return results;
}

async function returnStatus(client, category) {
    let descriptionText = '';
    let status = category.enabled === 1 ? 'Enabled' : 'Disabled';

    if (category.ticket_recieve_channel === "0") {  // Compare as a string
        descriptionText = `${status} | Channel: None`;
    } else {
        try {
            const ticketChannel = await client.channels.fetch(category.ticket_recieve_channel);
            descriptionText = `${status} | Channel: ${ticketChannel.name}`;
        } catch (error) {
            console.error(`Failed to fetch channel with ID ${category.ticket_recieve_channel}:`, error);
            descriptionText = `${status} | Channel: Error fetching channel`;
        }
    }

    return descriptionText;
}
function flipStatus(category) {
    if (category === 1) { return 0; } else { return 1; }
}
module.exports = {
    customId: 'set-category-channel-button',

    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {

        let categories = await SQLUtils.SQLQuery("SELECT name, enabled, CAST(ticket_recieve_channel AS CHAR) AS ticket_recieve_channel FROM `tickettype`;");

        if (Object.keys(categories).length === 0) {
            interaction.reply({ content: 'Looks like there are no categories to modify.', ephemeral: true })
        }

        if (Object.keys(categories).length > 0) {
            const processedCategories = await processCategories(client, categories);
            let categorySelect = new StringSelectMenuBuilder()
                .setCustomId('set-category-channel-list')
                .setPlaceholder('Ticket Category')
                .addOptions(processedCategories)

                .setMaxValues(1);
            let selectRow = new ActionRowBuilder().addComponents(categorySelect);

            await interaction.reply({ content: 'Select which a category to set the reception channel for.', components: [selectRow], ephemeral: true })


        }
    }

}
