const {  StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const SQLUtils = require('../../sqlUtils');

function returnStatus(category) {
    if (category.staff_role_ping === 1) { return 'Enabled'; } else { if (category.staff_role_ping === 0) return 'Disabled'; }
}

module.exports = {
    customId: 'disable-category-ping-button',

    run: async (client, interaction) => {

        let categories = await SQLUtils.SQLQuery("SELECT * FROM `tickettype`");

        if (Object.keys(categories).length === 0) {
            interaction.reply({ content: `Looks like there aren't any categories!`, ephemeral: true })
        }

        if (Object.keys(categories).length > 0) {

            let categorySelect = new StringSelectMenuBuilder()
                .setCustomId('disable-category-ping-list')
                .setPlaceholder('Ticket Category')
                .addOptions(categories.map(category => { return { label: category.name, description: returnStatus(category), value: category.name } }))
                .setMinValues(1)
                .setMaxValues(Object.keys(categories).length);
            let selectRow = new ActionRowBuilder().addComponents(categorySelect);

            interaction.reply({ content: 'Select which categories you would like to disable staff pings for.', components: [selectRow], ephemeral: true })


        }
    }

}
