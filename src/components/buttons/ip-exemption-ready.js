module.exports = {
    customId: 'ip-exemption-ready',

    run: async (client, interaction) => {
        let ipExemptionModal = client.Components.modals.get('ip-exemption-modal');
        let activeModal = ipExemptionModal.buildModal();
        await interaction.showModal(activeModal);

        await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(error => {
            console.error(error)
            return null
        })
    }
}
