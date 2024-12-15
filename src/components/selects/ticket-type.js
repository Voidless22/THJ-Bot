const { ComponentType } = require('discord.js');
const utils = require('../../utils');
const ticketUtils = require('../../ticketUtils');
const SQLUtils = require('../../sqlUtils')

module.exports = {
    customId: 'ticket-type',

    run: async (client, interaction) => {
        let categoryData = await ticketUtils.getTicketCategory(interaction.values[0]);
        let categoryRecieveChannelID = await SQLUtils.SQLQuery("SELECT CAST(ticket_recieve_channel AS CHAR) AS ticket_recieve_channel FROM `tickettype` WHERE type_id=?;", [categoryData.general.type_id]);

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
                }).then(async i => {
                    const date = new Date();
                    const threadName = `${i.user.username} | ${categoryData.general.name} | ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
                    let embedDescription = '';
                    for (let index = 0; index < 6; index++) {
                        if (categoryData.input_data[index] != null) {
                            if (index === 0) {
                                embedDescription = `**${categoryData.input_data[index][0].name}**\n`;
                            } else {
                                embedDescription = embedDescription + `**${categoryData.input_data[index][0].name}**\n`;
                            }
                            embedDescription = embedDescription + i.fields.getTextInputValue(`modal-input-${index}`) + `\n`
                        }
                    }
                    let ticketEmbed = await ticketUtils.genEmbed(threadName, embedDescription);

                    let ticketThread = await utils.createPetitionThread(threadName, categoryRecieveChannelID[0].ticket_recieve_channel, client)
                    let guideRoleID = await SQLUtils.SQLQuery('SELECT CAST(staff_role_id AS CHAR) AS staff_role_id FROM `General`');
                    ticketThread.send({ content: `<@${i.user.id}>, <@&${guideRoleID[0].staff_role_id}> will be with you soon.`, embeds: [ticketEmbed] });

                    i.reply({ content: 'Submitted!', ephemeral: true })
                }
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
                .then(async i => {
                    const date = new Date();
                    const threadName = `${i.user.username}-${categoryData.general.name}-${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
                    let embedDescription = '';
                    for (let index = 0; index < 6; index++) {
                        if (categoryData.input_data[index] != null) {
                            if (index === 0) {
                                embedDescription = `**${categoryData.input_data[index][0].name}**\n`;
                            } else {
                                embedDescription = embedDescription + `**${categoryData.input_data[index][0].name}**\n`;
                            }
                            embedDescription = embedDescription + i.fields.getTextInputValue(`modal-input-${index}`) + `\n`
                        }
                    }
                    let ticketEmbed = await ticketUtils.genEmbed(threadName, embedDescription);

                    let ticketThread = await utils.createPetitionThread(threadName, categoryRecieveChannelID[0].ticket_recieve_channel, client)
                    let pingStaffRole = await SQLUtils.SQLQuery('SELECT ping_staff_role FROM `tickettype` WHERE type_id=?;', [categoryData.general.type_id]);
                    console.log(pingStaffRole)
                    if (pingStaffRole[0].ping_staff_role === 1) {
                        let guideRoleID = await SQLUtils.SQLQuery('SELECT CAST(staff_role_id AS CHAR) AS staff_role_id FROM `general`');
                        if (guideRoleID.length > 0) {
                            ticketThread.send({ content: `<@${i.user.id}>, <@&${guideRoleID[0].staff_role_id}> will be with you soon.`, embeds: [ticketEmbed] });
                        }
                    }
                    else {
                        ticketThread.send({ content: `<@${i.user.id}>, Staff will be with you soon.`, embeds: [ticketEmbed] });

                    }

                    i.reply({ content: 'Submitted!', ephemeral: true })
                }
                ).catch(error => {
                    console.error(error)
                    return null
                })
        }
    }
};