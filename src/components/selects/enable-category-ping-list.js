const SQLUtils = require('../../sqlUtils');

module.exports = {
    customId: 'enable-category-ping-list',

    run: async (client, interaction) => {
        try {
            for (let i = 0; i < interaction.values.length; i++) {
                await SQLUtils.SQLQuery('UPDATE tickettype SET ping_staff_role = ? where name IN (?)', [1, interaction.values[i]]);
            }

            await interaction.reply({ content: 'Pings for the selected categories are now enabled.', ephemeral: true });
        } catch (error) {
            console.error('Error during category update:', error);
            await interaction.reply({ content: 'Failed to enable pings for the selected categories.', ephemeral: true }).catch(() => { });
        }


    }
}
