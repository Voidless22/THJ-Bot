const { PermissionsBitField, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const SQLUtils = require('../../sqlUtils');

async function processCategories(client, categories) {
    const results = await Promise.all(
        categories.map(async (category) => {
            category.ticket_log_channel = String(category.ticket_log_channel);
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

    if (category.ticket_log_channel !== "0") {

        try {
            const ticketChannel = await client.channels.fetch(category.ticket_log_channel);
            descriptionText = `${status} | Channel: ${ticketChannel.name}`;
        } catch (error) {
            console.error(`Failed to fetch channel with ID ${category.ticket_log_channel}:`, error);
            descriptionText = `${status} | Channel: Error fetching channel`;
        }
    } else {
        descriptionText = `${status} | Channel: None`;
    }

    return descriptionText;
}

module.exports = {
    customId: 'set-category-log-channel-button',
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles])) {
            await interaction.reply('You need permission to manage channels and roles to use this command.');
            return;
        }
        let categories = await SQLUtils.SQLQuery("SELECT name, enabled, CAST(ticket_log_channel AS CHAR) AS ticket_log_channel FROM `tickettype`;");

        if (Object.keys(categories).length === 0) {
            interaction.reply({ content: 'Looks like there are no categories to modify.', ephemeral: true })
        }

        if (Object.keys(categories).length > 0) {
            const processedCategories = await processCategories(client, categories);
            let categorySelect = new StringSelectMenuBuilder()
                .setCustomId('set-category-log-channel-list')
                .setPlaceholder('Ticket Category')
                .addOptions(processedCategories)
                .setMaxValues(1);

            let selectRow = new ActionRowBuilder().addComponents(categorySelect);

            await interaction.reply({ content: 'Select a category to set the logging channel for.', components: [selectRow], ephemeral: true })


        }
    }

}
