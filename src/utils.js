const { TextInputBuilder, EmbedBuilder, ModalBuilder, ButtonBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const mysql = require('mysql2/promise');

function textInput(label, id, style, required, maxLength) {
    return new TextInputBuilder()
        .setLabel(label)
        .setCustomId(id)
        .setStyle(style)
        .setRequired(required)
        .setMaxLength(maxLength)
}


async function createPetitionThread(threadName, petitionSection) {
    // If it does exist, create a new thread with the formatting of **submitting character** - **other characters involved** in the staff only section under the petition type channel
    if (petitionSection) {
      await petitionSection.threads.create({
        name: threadName,
        autoArchiveDuration: 10080,
        type: ChannelType.PrivateThread,
      });
      // Join the thread so we can see and send messages
      petitionSection.threads.cache
        .find((thread) => thread.name == threadName)
        .join();
    }
  }



module.exports = {
    textInput: textInput,
    createPetitionThread:createPetitionThread


}