module.exports = {
    event: 'interactionCreate',
    once: false,
    run: async (client, interaction) => {
        let component = null;
        /* 0: slash command
           1: Button
           2: select menu
           3: modal submit
        */



        switch (client.getInteractionType(interaction)) {
            case 0:
                component = client.slashCommands.get(interaction.commandName);
                break;
            case 1:
                component = client.Components.buttons.get(interaction.customId);
                break;
            case 2:
                component = client.Components.selects.get(interaction.customId);
                break;
            case 3:
             component = client.Components.modals.get(interaction.customId);
                break;
            default:
                component = null;
                break;

        }

        if (component != null) {
            try {
                await component.run(client, interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this interaction!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this interaction!', ephemeral: true });
                }
            }
        }


    }

}