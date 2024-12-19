const {ChannelSelectMenuBuilder,ChannelType, ActionRowBuilder } = require('discord.js');
const SQLUtils = require('../../sqlUtils');



module.exports = {
    customId: 'set-category-channel-list',

    run: async (client, interaction) => {
        
        let selectedCategory = interaction.values[0]
        let categoryChannelSelect = new ChannelSelectMenuBuilder()
            .setCustomId(`${selectedCategory}-channel-select-list`)
            .setChannelTypes([ChannelType.GuildText, ChannelType.GuildForum]);
        let actionRow = new ActionRowBuilder().addComponents(categoryChannelSelect);
        
        const collector = interaction.channel.createMessageComponentCollector({ time: 150000 });
        collector.on('collect', async action => {
            if (action.customId === `${selectedCategory}-channel-select-list`) {
                SQLUtils.SQLQuery('UPDATE tickettype SET ticket_recieve_channel = ? where name IN (?);', [action.values[0], selectedCategory])
                await action.reply({content: 'Success', ephemeral: true})
                collector.stop();
            }
        });

        await interaction.reply({ content: `Now let's set the category reception channel.`, components: [actionRow], ephemeral: true })


    }
}
