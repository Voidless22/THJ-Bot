const SQLUtils = require('../../sqlUtils');



module.exports = {
    customId: 'staff-role-select',

    run: async (client, interaction) => {
        try {
            await SQLUtils.SQLQuery('INSERT INTO general (staff_role_id, guild_id) VALUES (?,?) ON DUPLICATE KEY UPDATE staff_role_id = ?', [interaction.values[0], interaction.guild.id, interaction.values[0]])
            //  await SQLUtils.SQLQuery('UPDATE general SET `staff_role_id` = ? WHERE `guild_id`=?', [interaction.values[0], interaction.guild.id]);
            interaction.reply({ content: 'Guide Role ID updated.', ephemeral: true });
        } catch (error) {
            console.error('Error during Guide Role ID update:', error);
            interaction.reply({ content: 'Failed to update Guide Role ID.', ephemeral: true }).catch(() => { });
        }

    }
}
