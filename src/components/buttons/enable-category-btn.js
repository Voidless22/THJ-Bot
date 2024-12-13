const { ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const utils = require('../../utils');
const SQLUtils = require('../../sqlUtils');
const ticketUtils = require('../../ticketUtils');

function returnStatus(category) {
    if (category.enabled === 1) { return 'Enabled'; } else { if (category.enabled === 0) return 'Disabled'; }
}
function flipStatus(category) {
    if (category === 1) { return 0; } else { return 1; }
}
module.exports = {
    customId: 'enable-category-button',

    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {

        let disabledCategories = await SQLUtils.SQLQuery("SELECT * FROM `tickettype` where `enabled` IN (0)");

        if (Object.keys(disabledCategories).length === 0) {
            interaction.reply({ content: 'Looks like all the categories are enabled already!', ephemeral: true })
        }

        if (Object.keys(disabledCategories).length > 0) {

            let categorySelect = new StringSelectMenuBuilder()
                .setCustomId('enable-categories-list')
                .setPlaceholder('Ticket Category')
                .addOptions(disabledCategories.map(category => { return { label: category.name, description: returnStatus(category), value: category.name } }))
                .setMinValues(1)
                .setMaxValues(Object.keys(disabledCategories).length);
            let selectRow = new ActionRowBuilder().addComponents(categorySelect);





            interaction.reply({ content: 'Select which categories you would like to enable.', components: [selectRow], ephemeral: true })


        }
    }

}
