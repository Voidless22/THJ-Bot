const { SlashCommandBuilder, PermissionsBitField, AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const sqlUtils = require('../../sqlUtils');
// Recursive message fetcher
async function fetchAllMessages(channel) {
    let allMessages = [];
    let lastMessageId = null;

    while (true) {
        const fetchedMessages = await channel.messages.fetch({
            limit: 100,
            before: lastMessageId,
        });

        if (fetchedMessages.size === 0) {
            break;
        }

        allMessages = allMessages.concat(Array.from(fetchedMessages.values()));
        lastMessageId = fetchedMessages.last().id; // Update the `before` parameter for the next batch
    }

    return allMessages;
}

// Download an attachment as a buffer
async function downloadAttachmentAsBuffer(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
}

module.exports = {
    customId: 'close-ticket',
    structure: new SlashCommandBuilder()
        .setName('closeticket')
        .setDescription('Logs all messages in a thread, including embed text and attachments, and deletes the thread.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

    run: async (client, interaction) => {
        const thread = interaction.channel;

        if (!thread.isThread()) {
            return interaction.reply({ content: 'This command can only be used inside threads.', ephemeral: true });
        }

        try {
            await interaction.deferReply()
            // Fetch all messages in the thread
            const messages = await fetchAllMessages(thread);
            const sortedMessages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
            let logChannelId = await sqlUtils.SQLQuery('SELECT CAST(ticket_log_channel AS CHAR) AS ticket_log_channel FROM `tickettype` WHERE ticket_recieve_channel = ?', [thread.parentId])
            const logsChannel = await client.channels.fetch(logChannelId[0].ticket_log_channel);
           
            if (!logsChannel) {
                await interaction.editReply({ content: 'Log Channel for this category not found. Canceling ticket archival and closing. Please use /ticketsetup to set the log channel.', ephemeral: true });
                return;
            }

            // Create a new thread in the logs channel
            const logThread = await logsChannel.threads.create({
                name: `Log of ${thread.name}`,
                autoArchiveDuration: 1440, // Archive after 24 hours of inactivity
                reason: 'Log for ticket thread.',
            });

            // Generate the chat log
            let chatLog = `Chat Log for Thread: ${thread.name} \n\n`;

            for (const message of sortedMessages) {
                const timestamp = new Date(message.createdTimestamp);
                const username = `${message.author.username}#${message.author.discriminator}`;
                const content = message.content || '[No Content]';

                // Extract embeds
                let embedText = '';
                if (message.embeds.length > 0) {
                    message.embeds.forEach(embed => {
                        if (embed.title) embedText += `**Title:** ${embed.title}\n`;
                        if (embed.description) embedText += `**Description:** ${embed.description}\n`;
                        if (embed.fields.length > 0) {
                            embed.fields.forEach(field => {
                                embedText += `**Field:** ${field.name}\n${field.value}\n`;
                            });
                        }
                        if (embed.footer?.text) embedText += `**Footer:** ${embed.footer.text}\n`;
                        if (embed.url) embedText += `**URL:** ${embed.url}\n`;
                        embedText += '\n';
                    });
                }

                // Append to chat log
                chatLog += `[${timestamp}] ${username}: ${content}\n${embedText}`;

                // Handle attachments
                if (message.attachments.size > 0) {
                    for (const attachment of message.attachments.values()) {
                        const attachmentBuffer = await downloadAttachmentAsBuffer(attachment.url);
                        const fileAttachment = new AttachmentBuilder(attachmentBuffer, { name: attachment.name });
                        await logThread.send({
                            content: `Attachment from **${username}** at ${timestamp}:`,
                            files: [fileAttachment],
                        });
                    }
                }
            }

            // Send the chat log to the log thread
            await logThread.send({
                content: 'Here is the full chat log:',
                files: [new AttachmentBuilder(Buffer.from(chatLog, 'utf-8'), { name: `thread-log-${thread.id}.txt` })],
            });

            await interaction.editReply({ content: 'Thread has been logged and deleted. A log thread has been created in the logs channel.', ephemeral: true });
            logThread.setArchived(true);
            await thread.delete(); 

        } catch (error) {
            console.error('Error logging thread:', error);
            await interaction.editReply({ content: 'An error occurred while trying to log the thread.', ephemeral: true });
        }
    },
};
