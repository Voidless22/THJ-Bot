const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    customId: 'count',
    structure: new SlashCommandBuilder()
        .setName('count')
        .setDescription('Counts to 300, sending each number every second.'),
    async run(client, interaction) {
        await interaction.reply('Starting the count to 300...');
        
        let count = 1;
        const interval = setInterval(() => {
            if (count > 20) {
                clearInterval(interval);
                interaction.channel.send('Counting complete!');
            } else {
                interaction.channel.send(`${count}`);
                count++;
            }
        }, 1000);
    },
};
