const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const SQLUtils = require('../../sqlUtils');

function returnStatus(category) {
    if (category.enabled === 1) { return 'Enabled'; } else { if (category.enabled === 0) return 'Disabled'; }
}

module.exports = {
    customId: 'disable-category-button',
    
    run: async (client, interaction) => {

        let enabledCategories = await SQLUtils.SQLQuery("SELECT * FROM `tickettype` where `enabled` IN (1)");

        if (Object.keys(enabledCategories).length === 0) {
            await interaction.reply({ content: 'Looks like all the categories are disabled already!', ephemeral: true })
        }

        if (Object.keys(enabledCategories).length > 0) {
            let categorySelect = new StringSelectMenuBuilder()
                .setCustomId('disable-categories-list')
                .setPlaceholder('Ticket Category')
                .addOptions(enabledCategories.map(category => { return { label: category.name, description: returnStatus(category), value: category.name } }))
                .setMinValues(1)
                .setMaxValues(Object.keys(enabledCategories).length);
            let selectRow = new ActionRowBuilder().addComponents(categorySelect);


            await interaction.reply({ content: 'Select which categories you would like to disable.', components: [selectRow], ephemeral: true })
        }

    }
}
