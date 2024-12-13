const { TextInputBuilder, ChannelType } = require('discord.js');
const mysql = require('mysql2/promise');

function textInput(label, id, style, required, maxLength) {
    return new TextInputBuilder()
        .setLabel(label)
        .setCustomId(id)
        .setStyle(style)
        .setRequired(required)
        .setMaxLength(maxLength)
}


async function createPetitionThread(threadName, channelID, client) {
    let petitionSection = await client.channels.fetch(channelID);
    if (petitionSection) {
        let threadChannel = await petitionSection.threads.create({
            name: threadName,
            autoArchiveDuration: 10080,
            type: ChannelType.PrivateThread,
        });
        // Join the thread so we can see and send messages
        petitionSection.threads.cache
            .find((thread) => thread.name == threadName)
            .join();

        return threadChannel
    }
}



module.exports = {
    textInput: textInput,
    createPetitionThread: createPetitionThread


}