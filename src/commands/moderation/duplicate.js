const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')
module.exports = {
    customId: 'duplicate',
    structure: new SlashCommandBuilder()
        .setName('duplicate')
        .setDescription('Marks this thread as a duplicate of another and closes it.')
        .addChannelOption(option =>
            option.setName('target')
                .setDescription('The thread this is a duplicate of.')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads), // Restrict to staff
    async run(client, interaction) {
        const currentThread = interaction.channel; // The thread where the command is run
        const targetThread = interaction.options.getChannel('target');

        // Ensure the command is run inside a thread
        if (!currentThread.isThread()) {
            return interaction.reply({ content: 'This command can only be used inside a thread.', ephemeral: true });
        }

        // Ensure the target is also a thread
        if (!targetThread.isThread()) {
            return interaction.reply({ content: 'The target must be a thread.', ephemeral: true });
        }

        try {
            // Fetch the first proper message from the current thread (ignoring system messages)
            const messages = await currentThread.messages.fetch({ limit: 100 }); // Fetch up to 100 messages
            const opMessage = messages.find(msg => msg.author.id === currentThread.ownerId && !msg.system);

            if (!opMessage) {
                return interaction.reply({ content: 'No valid OP message found in this thread.', ephemeral: true });
            }

            // Send a message to the target thread
            await targetThread.send({
                content: `Report:\n> ${opMessage.content}\n\nThank you for reporting!`
            });

            // Ping the OP in the target thread
            await targetThread.send(`<@${opMessage.author.id}>, your report has been moved here.`);
            await currentThread.send({ content: `This thread has been marked as a duplicate, and the original message has been moved here: <#${currentThread.id}>.` })
            // Acknowledge the staff's command
            await interaction.reply({
                content: `This thread has been marked as a duplicate of "${targetThread.name}" and closed.`,
                ephemeral: true
            });

            // Lock and archive the current thread
            await currentThread.setLocked(true);
            await currentThread.setArchived(true);


        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'An error occurred while processing the command.', ephemeral: true });
        }
    }
};