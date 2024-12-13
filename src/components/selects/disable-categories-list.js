const { EmbedBuilder, ComponentType } = require('discord.js');
const SQLUtils = require('../../sqlUtils');



module.exports = {
    customId: 'disable-categories-list',

    run: async (client, interaction) => {
        try {
            // Process category updates
            for (let i = 0; i < interaction.values.length; i++) {
                await SQLUtils.SQLQuery('UPDATE tickettype SET enabled = ? where name IN (?)', [0, interaction.values[i]]);
            }

            // Inform the user
            interaction.reply({ content: 'Categories disabled.', ephemeral: true });
        } catch (error) {
            console.error('Error during category update:', error);
            interaction.reply({ content: 'Failed to disable categories.', ephemeral: true }).catch(() => { });
        }



    }
}
