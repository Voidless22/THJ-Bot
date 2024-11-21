const { TextInputBuilder } = require('discord.js');

module.exports = {
    textInput: (label, id, style, required, maxLength) => {
        return new TextInputBuilder()
            .setLabel(label)
            .setCustomId(id)
            .setStyle(style)
            .setRequired(required)
            .setMaxLength(maxLength)
    }

}