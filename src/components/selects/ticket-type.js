const { EmbedBuilder } = require('discord.js');

module.exports = {
    customId: 'ticket-type',
    run: async (client, interaction) => {
        // 
        const selectedCategory = interaction.values[0];
        const petitionType = selectedCategory.replace(/ /g, '-').toLowerCase();
        let modalCollection = client.Components.modals.get(`${petitionType}-modal`);
        let activeModal = modalCollection.buildModal();

        switch (petitionType) {
            case 'ip-exemption':
                await interaction.reply({
                    embeds: [modalCollection.embed()],
                    components: [modalCollection.readyButton()],
                    ephemeral: true
                })
                break;
            default:

                await interaction.showModal(activeModal);

                await interaction.awaitModalSubmit({
                    time: 60000,
                    filter: i => i.user.id === interaction.user.id,
                }).catch(error => {
                    console.error(error)
                    return null
                })
                break;
        }


    }

};