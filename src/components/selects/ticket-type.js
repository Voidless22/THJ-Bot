const { EmbedBuilder, ComponentType } = require('discord.js');
const utils = require('../../utils');
const ticketUtils = require('../../ticketUtils');
const SQLUtils = require('../../sqlUtils')

module.exports = {
    customId: 'ticket-type',

    run: async (client, interaction) => {
        let categoryData = await ticketUtils.getTicketCategory(interaction.values[0]);
        let categoryRecieveChannel = await SQLUtils.SQLQuery("SELECT CAST(ticket_recieve_channel AS CHAR) AS ticket_recieve_channel FROM `tickettype` WHERE name=?;", [interaction.values[0]]);
        
        if (categoryData.general.send_pre_embed === 1) {
            const embed = await ticketUtils.genEmbed(categoryData.pre_embed_data.label, categoryData.pre_embed_data.description);
            const button = ticketUtils.genContinueButton();

            const embedReply = await interaction.reply({
                embeds: [embed],
                components: [button],
                ephemeral: true,
                fetchReply: true
            });

            const collector = embedReply.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3_600_000 });

            collector.on('collect', async i => {
                const activeModal = await ticketUtils.generateModal(categoryData.general.name);

                await i.showModal(activeModal);

                await i.awaitModalSubmit({
                    time: 60000,
                    filter: k => k.user.id === i.user.id,
                }).then(interaction => 
                    console.log(`${interaction.fields.getTextInputValue('modal-input-1')}`)
                )
                    .catch(error => {
                        console.error(error)
                        return null
                    })
            });
        } else {
            const activeModal = await ticketUtils.generateModal(interaction.values[0]);
            await interaction.showModal(activeModal);
            await interaction.awaitModalSubmit({
                time: 60000,
                filter: k => k.user.id === interaction.user.id,
            })
            .then(i => {
                console.log(`${i.fields.getTextInputValue('modal-input-1')}`)
                i.reply({content:'Submitted!'})
            }
            ).catch(error => {
                console.error(error)
                return null
            })
        }
    }
};