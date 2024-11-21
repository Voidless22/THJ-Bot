const { ChannelType, ModalSubmitInteraction, ThreadAutoArchiveDuration } = require('discord.js');
const { EmbedBuilder, ThreadManager, ButtonBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const utils = require('../../utils.js')

module.exports = {
    customId: `ip-exemption-modal`,
    readyButton: () => {
        const readyButton = new ButtonBuilder()
            .setCustomId('ip-exemption-ready')
            .setLabel("Ready!")
            .setStyle(1);

        const row = new ActionRowBuilder().addComponents(readyButton);
        return row;

    },
    embed: () => {
        let embedDescription = [];
        embedDescription[1] = '# **Hey, I can help you with an IP exemption!**';
        embedDescription[2] = '## **Make sure you have the following:**';
        embedDescription[3] = `- Both Account Names\n- Both In-Game Character Names\n- Your Public IPv4 address (*this can be found at [whatsmyip.com](https://whatsmyip.com/)*).`;
        embedDescription[4] = "### **to submit this information, click the Ready button below to fill the form out.**";
        embedDescription[5] = "After you've sent this, we can go ahead and give you a temporary IP exemption. **It can take anywhere between 2 minutes to a few hours for the temporary to take effect - please be patient.**\n### After that, please go to this [calendar](https://docs.google.com/spreadsheets/d/1sWGC6Y76dhBdbRmRBfXpSQVGjcWFHArwlTZSZXxBk6w/edit?gid=0#gid=0) and find a day/time that works for you."
        embedDescription[6] = "### In order for your temporary exemption to be made permanent, you and your partner will both need to be present on discord and in game for your IP exemption interview.";
        embedDescription[7] = '### Please note that your temporary exemption will expire in 7 days.';
        embedDescription[8] = '### If you have any questions, please let us know.';

        return new EmbedBuilder()
            .setTitle('Ip Exemptions')
            .setDescription(
                `${embedDescription[1]}\n ${embedDescription[2]}\n ${embedDescription[3]}\n\n${embedDescription[4]}\n ${embedDescription[5]}\n ${embedDescription[6]} \n${embedDescription[7]}\n ${embedDescription[8]}}`);

    },
    buildModal: () => {
        let modal = new ModalBuilder()
            .setCustomId('ip-exemption-modal')
            .setTitle(`IP Exemption`)


        let firstAccountName = utils.textInput('Account Name 1', 'account-name-1', TextInputStyle.Short, true, 15);
        let secondAccountName = utils.textInput('Account Name 2', 'account-name-2', TextInputStyle.Short, true, 20);
        let firstInGameName = utils.textInput('Character Name 1', 'character-name-1', TextInputStyle.Short, true, 20);
        let secondInGameName = utils.textInput('Character Name 2', 'character-name-2', TextInputStyle.Short, true, 20);
        let ipAddress = utils.textInput('IP Address', 'ip-address', TextInputStyle.Short, true, 20);

        let actionRows = [];
        actionRows.push(new ActionRowBuilder().addComponents(firstAccountName));
        actionRows.push(new ActionRowBuilder().addComponents(firstInGameName));
        actionRows.push(new ActionRowBuilder().addComponents(secondAccountName));
        actionRows.push(new ActionRowBuilder().addComponents(secondInGameName));
        actionRows.push(new ActionRowBuilder().addComponents(ipAddress));


        for (const row of actionRows) {
            modal.addComponents(row);
        }
        console.log('Generated Modal.')
        return modal;
    },
    run: async (client, interaction) => {
        const forum = await client.channels.fetch('1308849865618624605');
        const firstCharacterName = interaction.fields.getTextInputValue('character-name-1');
        const secondCharacterName = interaction.fields.getTextInputValue('character-name-2');
        const firstAccountName = interaction.fields.getTextInputValue('account-name-1');
        const secondAccountName = interaction.fields.getTextInputValue('account-name-2');
        const ipAddress = interaction.fields.getTextInputValue('ip-address');
        const discordUsername = interaction?.member?.user?.username;

        forum.threads.create({
            name: discordUsername,
            // 1 year auto archive
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            message: {
                content: `[Discord Username]: ${discordUsername}\n**[Account Name 1]** ${firstAccountName}\n**[Account Name 2]** ${secondAccountName}\n**[In-Game Name 1]** ${firstCharacterName}\n**[In-Game Name 2]** ${secondCharacterName}\n**[IP Address]** ${ipAddress}\nTODO: Add database bullshit for status, approval and dating`,
            },
            reason: 'IP Exemption',
        })
        await interaction.reply({ content: 'Form successfully submitted!', ephemeral: true });

    }
}