const { EmbedBuilder, ComponentType } = require('discord.js');
const SQLUtils = require('../../sqlUtils');
const ticketUtils = require('../../ticketUtils');


module.exports = {
    customId: 'preview-category-list',

    run: async (client, interaction) => {
        let categoryData = await ticketUtils.getTicketCategory(interaction.values[0]);


        const activeModal = await ticketUtils.generateModal(categoryData.general.name);

        await interaction.showModal(activeModal);

        await interaction.awaitModalSubmit({
            time: 60000,
            filter: k => k.user.id === interaction.user.id,
        }).then(async i => {
            await i.reply({ content: `Preview complete!`, ephemeral: true })
        })
            .catch(error => {
                console.error(error)
                return null
            })

    }
}
