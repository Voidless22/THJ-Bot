const { SlashCommandBuilder } = require('discord.js');



module.exports = {
    name: 'reload',
    structure: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads the specified command.'),

    run: async (client, interaction, args) => {
        if (interaction.user.id == '543992808273608715') {
            await interaction.reply('Redeploying Commands...');
            

        } else {
            await interaction.reply('You must be one of the bot developers to use this command.')
        }
    }

}