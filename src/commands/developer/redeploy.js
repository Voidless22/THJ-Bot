const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    customId: 'redeploy',
    structure: new SlashCommandBuilder()
        .setName('redeploy')
        .setDescription('Redeploy all discord bot commands to discord(not the same as reload).'),

    run: async (client, interaction, args) => {
        if (interaction.user.id == '543992808273608715') {
            client.deploySlashCommands();
            await interaction.reply('Redeploying Commands...');
        } else {
            await interaction.reply('You must be one of the bot developers to use this command.')
        }
    }

}