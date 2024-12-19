const SQLUtils = require('../../sqlUtils');

module.exports = {
    customId: 'set-lockout-time-list',

    run: async (client, interaction) => {
        try {
            SQLUtils.SQLQuery(`INSERT INTO general (ticket_lockout_time, guild_id) VALUES (?,?) 
            ON DUPLICATE KEY UPDATE ticket_lockout_time = ?`, [interaction.values[0], interaction.guild.id, interaction.values[0]])

            await interaction.reply({ content: 'The lockout time has been updated..', ephemeral: true });
        } catch (error) {
            console.error('Error during database update:', error);
            await interaction.reply({ content: 'Failed to update lockout time.', ephemeral: true }).catch(() => { });
        }


    }
}
