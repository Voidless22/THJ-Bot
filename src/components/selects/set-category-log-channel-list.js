const {ChannelSelectMenuBuilder,ChannelType, ActionRowBuilder } = require('discord.js');
const SQLUtils = require('../../sqlUtils');



module.exports = {
    customId: 'set-category-log-channel-list',

    run: async (client, interaction) => {
        let selectedCategory = interaction.values[0]
        let categoryChannelSelect = new ChannelSelectMenuBuilder()
            .setCustomId('category-log-channel-list')
            .setChannelTypes([ChannelType.GuildText, ChannelType.GuildForum]);
        let actionRow = new ActionRowBuilder().addComponents(categoryChannelSelect);
        
        const collector = interaction.channel.createMessageComponentCollector({ time: 150000 });
        collector.on('collect', async action => {
            if (action.customId === 'category-log-channel-list') {
                SQLUtils.SQLQuery('UPDATE tickettype SET ticket_log_channel = ? where name IN (?);', [action.values[0], selectedCategory])
                action.reply({content: 'Success', ephemeral: true})
                collector.stop();
            }
        });

        interaction.reply({ content: `Now let's set the category logging channel.`, components: [actionRow], ephemeral: true })


    }
}
