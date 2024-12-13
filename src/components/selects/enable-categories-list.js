const { EmbedBuilder, ComponentType } = require('discord.js');
const SQLUtils = require('../../sqlUtils');



module.exports = {
    customId: 'enable-categories-list',

    run: async (client, interaction) => {
        try {
            // Process category updates
            for (let i = 0; i < interaction.values.length; i++) {
                await SQLUtils.SQLQuery('UPDATE tickettype SET enabled = ? where name IN (?)', [1, interaction.values[i]]);
            }

            // Inform the user
            await interaction.reply({ content: 'Categories enabled.', ephemeral: true });
        } catch (error) {
            console.error('Error during category update:', error);
           await interaction.reply({ content: 'Failed to enable categories.', ephemeral: true }).catch(() => { });
        }


    }
}
