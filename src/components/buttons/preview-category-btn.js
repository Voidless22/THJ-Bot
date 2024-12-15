const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const SQLUtils = require('../../sqlUtils');

function returnStatus(category) {
    if (category.enabled === 1) { return 'Enabled'; } else { if (category.enabled === 0) return 'Disabled'; }
}

module.exports = {
    customId: 'preview-category-button',
    
    run: async (client, interaction) => {

        let categories = await SQLUtils.SQLQuery("SELECT * FROM `tickettype`");

        if (Object.keys(categories).length === 0) {
            await interaction.reply({ content: `Seems you don't have any categories to preview...`, ephemeral: true })
        }

        if (Object.keys(categories).length > 0) {
            let categorySelect = new StringSelectMenuBuilder()
                .setCustomId('preview-category-list')
                .setPlaceholder('Ticket Category')
                .addOptions(categories.map(category => { return { label: category.name, description: returnStatus(category), value: category.name } }))
                .setMaxValues(1);
            let selectRow = new ActionRowBuilder().addComponents(categorySelect);


            await interaction.reply({ content: 'Select which category you would like to preview.', components: [selectRow], ephemeral: true })
        }

    }
}
