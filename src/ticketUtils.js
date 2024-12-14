const { TextInputBuilder, EmbedBuilder, ModalBuilder, ButtonBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const SQLUtils = require('./sqlUtils');
const utils = require('./utils');

let ipExemptionPreEmbedDescription = [];
ipExemptionPreEmbedDescription[1] = '# **Hey, I can help you with an IP exemption!**\n';
ipExemptionPreEmbedDescription[2] = '## **Make sure you have the following:**\n';
ipExemptionPreEmbedDescription[3] = `- Both Account Names\n- Both In-Game Character Names\n- Your Public IPv4 address (*this can be found at [whatsmyip.com](https://whatsmyip.com/)*).`;
ipExemptionPreEmbedDescription[4] = "### **to submit this information, click the Ready button below to fill the form out.**\n";
ipExemptionPreEmbedDescription[5] = "After you've sent this, we can go ahead and give you a temporary IP exemption. **It can take anywhere between 2 minutes to a few hours for the temporary to take effect - please be patient.**\n### After that, please go to this [calendar](https://docs.google.com/spreadsheets/d/1sWGC6Y76dhBdbRmRBfXpSQVGjcWFHArwlTZSZXxBk6w/edit?gid=0#gid=0) and find a day/time that works for you.\n"
ipExemptionPreEmbedDescription[6] = "### In order for your temporary exemption to be made permanent, you and your partner will both need to be present on discord and in game for your IP exemption interview.\n";
ipExemptionPreEmbedDescription[7] = '### Please note that your temporary exemption will expire in 7 days.\n';
ipExemptionPreEmbedDescription[8] = '### If you have any questions, please let us know.';


let ipExemptionPreset = {
    general: {
        enabled: 1,
        name: 'IP Exemption',
        sendPreEmbed: 1,
        sendPostEmbed: 0,
    },
    embeds: {
        preEmbedText: ipExemptionPreEmbedDescription.join(''),
        postEmbedText: null,
    },
    inputs: {
        1: {
            enabled: 1,
            name: 'Account Name 1',
            type: 1,
            required: 1,
            maxLength: 4000,
        },
        2: {
            enabled: 1,
            name: 'Account Name 2',
            type: 1,
            required: 1,
            maxLength: 4000,
        },
        3: {
            enabled: 1,
            name: 'In-Game Name 1',
            type: 1,
            required: 1,
            maxLength: 4000,
        },
        4: {
            enabled: 1,
            name: 'In-Game Name 2',
            type: 1,
            required: 1,
            maxLength: 4000,
        },
        5: {
            enabled: 1,
            name: 'IP Address',
            type: 1,
            required: 1,
            maxLength: 4000,
        },
    },
};
let exploitPreset = {
    general: {
        enabled: 1,
        name: 'Report an Exploit',
        sendPreEmbed: 0,
        sendPostEmbed: 0,
    },
    embeds: {
        preEmbedText: null,
        postEmbedText: null,
    },
    inputs: {
        1: {
            enabled: 1,
            name: 'Ticket Title',
            type: 1,
            required: 1,
            maxLength: 4000,
        },
        2: {
            enabled: 1,
            name: 'Involved Character Name(s)',
            type: 1,
            required: 1,
            maxLength: 4000,
        },
        3: {
            enabled: 1,
            name: 'Description',
            type: 2,
            required: 1,
            maxLength: 4000,
        },
    }

}
let lostItemPreset = {
    general: {
        enabled: 1,
        name: 'Lost Item',
        sendPreEmbed: 0,
        sendPostEmbed: 0,
    },
    embeds: {
        preEmbedText: null,
        postEmbedText: null,
    },
    inputs: {
        1: {
            enabled: 1,
            name: 'Ticket Title',
            type: 1,
            required: 1,
            maxLength: 4000,
        },
        2: {
            enabled: 1,
            name: 'Involved Character Name(s)',
            type: 1,
            required: 1,
            maxLength: 4000,
        },
        3: {
            enabled: 1,
            name: 'Description',
            type: 2,
            required: 1,
            maxLength: 4000,
        },
    }

}
let disputePreset = {
    general: {
        enabled: 1,
        name: 'Player Dispute',
        sendPreEmbed: 0,
        sendPostEmbed: 0,
    },
    embeds: {
        preEmbedText: null,
        postEmbedText: null,
    },
    inputs: {
        1: {
            enabled: 1,
            name: 'Ticket Title',
            type: 1,
            required: 1,
            maxLength: 4000,
        },
        2: {
            enabled: 1,
            name: 'Involved Character Name(s)',
            type: 1,
            required: 1,
            maxLength: 4000,
        },
        3: {
            enabled: 1,
            name: 'Description',
            type: 2,
            required: 1,
            maxLength: 4000,
        },
    }

}
async function createTicketCategory(categoryData) {
    let preEmbedId = null;
    let postEmbedId = null;

    try {
        // Handle preEmbed
        if (categoryData.embeds.preEmbedText) {
            const preEmbedResult = await SQLUtils.SQLQuery(
                `INSERT INTO Embeds (label, description, preEmbed) 
                 SELECT ?, ?, 1 
                 WHERE NOT EXISTS (
                     SELECT 1 FROM Embeds WHERE label = ? AND preEmbed = 1
                 );`,
                [categoryData.general.name, categoryData.embeds.preEmbedText, categoryData.general.name]
            );

            if (preEmbedResult.insertId) {
                preEmbedId = preEmbedResult.insertId;
            } else {
                const existingEmbed = await SQLUtils.SQLQuery(
                    `SELECT embed_id FROM Embeds WHERE label = ? AND preEmbed = 1;`,
                    [categoryData.general.name]
                );
                if (existingEmbed.length > 0) preEmbedId = existingEmbed[0].embed_id;
            }
        }

        // Handle postEmbed
        if (categoryData.embeds.postEmbedText) {
            const postEmbedResult = await SQLUtils.SQLQuery(
                `INSERT INTO Embeds (label, description, postEmbed) 
                 SELECT ?, ?, 1 
                 WHERE NOT EXISTS (
                     SELECT 1 FROM Embeds WHERE label = ? AND postEmbed = 1
                 );`,
                [categoryData.general.name, categoryData.embeds.postEmbedText, categoryData.general.name]
            );

            if (postEmbedResult.insertId) {
                postEmbedId = postEmbedResult.insertId;
            } else {
                const existingEmbed = await SQLUtils.SQLQuery(
                    `SELECT embed_id FROM Embeds WHERE label = ? AND postEmbed = 1;`,
                    [categoryData.general.name]
                );
                if (existingEmbed.length > 0) postEmbedId = existingEmbed[0].embed_id;
            }
        }

        // Handle TextInputs
        const inputIds = {};
        for (let i = 1; i <= 5; i++) {
            const input = categoryData.inputs[i];
            if (input) {
                const existingInput = await SQLUtils.SQLQuery(
                    `SELECT input_id FROM TextInputs WHERE name = ? AND style = ? AND required = ? AND max_length = ?;`,
                    [input.name, input.type, input.required, input.maxLength]
                );

                if (existingInput.length > 0) {
                    inputIds[i] = existingInput[0].input_id;
                } else {
                    const result = await SQLUtils.SQLQuery(
                        `INSERT INTO TextInputs (name, style, required, max_length) VALUES (?, ?, ?, ?);`,
                        [input.name, input.type, input.required, input.maxLength]
                    );
                    inputIds[i] = result.insertId;
                }
            } else {
                inputIds[i] = null;
            }
        }

        // Handle Modal
        const existingModal = await SQLUtils.SQLQuery(
            `SELECT modal_id FROM Modals WHERE name = ?;`,
            [categoryData.general.name]
        );

        let modalId;
        if (existingModal.length > 0) {
            modalId = existingModal[0].modal_id;
        } else {
            const modalResult = await SQLUtils.SQLQuery(
                `INSERT INTO Modals (
                    name,
                    input_1_enabled, input_1_id,
                    input_2_enabled, input_2_id,
                    input_3_enabled, input_3_id,
                    input_4_enabled, input_4_id,
                    input_5_enabled, input_5_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    categoryData.general.name,
                    categoryData.inputs[1]?.enabled || 0, inputIds[1] || null,
                    categoryData.inputs[2]?.enabled || 0, inputIds[2] || null,
                    categoryData.inputs[3]?.enabled || 0, inputIds[3] || null,
                    categoryData.inputs[4]?.enabled || 0, inputIds[4] || null,
                    categoryData.inputs[5]?.enabled || 0, inputIds[5] || null
                ]
            );
            modalId = modalResult.insertId;
        }

        // Handle TicketType
        const existingTicketType = await SQLUtils.SQLQuery(
            `SELECT type_id FROM tickettype WHERE name = ? OR modal_id = ?;`,
            [categoryData.general.name, modalId || null]
        );

        if (existingTicketType.length === 0) {
            await SQLUtils.SQLQuery(
                `INSERT INTO tickettype (
                    enabled, name, send_pre_embed, pre_embed_id,
                    modal_id, send_post_embed, post_embed_id, ticket_recieve_channel
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    categoryData.general.enabled,
                    categoryData.general.name,
                    categoryData.general.sendPreEmbed,
                    preEmbedId || null,
                    modalId || null,
                    categoryData.general.sendPostEmbed,
                    postEmbedId || null,
                    0 // Default ticket receive channel
                ]
            );
        }

    } catch (error) {
        console.error('Error filling tables:', error.sqlMessage || error.message);
    }
}


async function getTicketCategory(name) {
    let category = [];
    let pre_embed_data = [];
    let post_embed_data = [];
    let modal_data = [];
    let input_data = [];

    if (name != null) {
        category = await SQLUtils.SQLQuery("SELECT * FROM `tickettype` WHERE name=?", [name]);
        modal_data = await SQLUtils.SQLQuery("SELECT * FROM `modals` WHERE modal_id=?", [category[0].modal_id]);
        console.log(modal_data)
        if (category[0].send_pre_embed === 1) {
            pre_embed_data = await SQLUtils.SQLQuery("SELECT * FROM `embeds` WHERE embed_id=?", [category[0].pre_embed_id])
        }
        if (category[0].send_post_embed === 1) {
            post_embed_data = await SQLUtils.SQLQuery("SELECT * FROM `embeds` WHERE embed_id=?", [category[0].post_embed_id])
        }

        for (let i = 1; i < 6; i++) {

            if (modal_data[0][`input_${i}_enabled`] === 1) {
                input_data[i] = await SQLUtils.SQLQuery("SELECT * FROM `textinputs` WHERE input_id=?", [modal_data[0][`input_${i}_id`]])
                console.log(input_data[i])
                if (input_data[i][0].required == 1) {
                    input_data[i][0].required = true;
                } else {
                    input_data[i][0].required = false;
                }
            } else {
                input_data[i] = null;
            }
        }
        let categoryData = {
            general: category[0],
            pre_embed_data: pre_embed_data[0],
            post_embed_data: post_embed_data[0],
            modal_data: modal_data[0],
            input_data: input_data

        }
        return categoryData;
    }
    else {
        ticket_types = await SQLUtils.SQLQuery("SELECT * FROM `tickettype` WHERE enabled = 1");
        return ticket_types;
    }

}
async function getTicketCategoryPresets(presetName) {
    let ticket_types;
    if (presetName != null) {
        ticket_types = await SQLUtils.SQLQuery("SELECT * FROM `ticket - types` WHERE name=?", [presetName]);
    } else {
        ticket_types = await SQLUtils.SQLQuery("SELECT * FROM `ticket - types`");
    }

    return ticket_types
}


async function genTicketPresets() {
    createTicketCategory(ipExemptionPreset);
    createTicketCategory(exploitPreset);
    createTicketCategory(lostItemPreset);
    createTicketCategory(disputePreset);
}

async function generateModal(data) {
    let categoryData = await getTicketCategory(data);
    let modal = new ModalBuilder()
        .setCustomId('generated-ticket-modal')
        .setTitle(categoryData.general.name)

    let actionRows = [];
    if (categoryData.modal_data.input_1_enabled != 0) {
        let firstInput = utils.textInput(categoryData.input_data[1][0].name, 'modal-input-1', categoryData.input_data[1][0].style, categoryData.input_data[1][0].required, categoryData.input_data[1][0].max_length);
        actionRows.push(new ActionRowBuilder().addComponents(firstInput));
    }
    if (categoryData.modal_data.input_2_enabled != 0) {
        let secondInput = utils.textInput(categoryData.input_data[2][0].name, 'modal-input-2', categoryData.input_data[2][0].style, categoryData.input_data[2][0].required, categoryData.input_data[2][0].max_length);
        actionRows.push(new ActionRowBuilder().addComponents(secondInput));
    }
    if (categoryData.modal_data.input_3_enabled != 0) {
        let thirdInput = utils.textInput(categoryData.input_data[3][0].name, 'modal-input-3', categoryData.input_data[3][0].style, categoryData.input_data[3][0].required, categoryData.input_data[3][0].max_length);
        actionRows.push(new ActionRowBuilder().addComponents(thirdInput));
    }
    if (categoryData.modal_data.input_4_enabled != 0) {
        let fourthInput = utils.textInput(categoryData.input_data[4][0].name, 'modal-input-4', categoryData.input_data[4][0].style, categoryData.input_data[4][0].required, categoryData.input_data[4][0].max_length);
        actionRows.push(new ActionRowBuilder().addComponents(fourthInput));
    }
    if (categoryData.modal_data.input_5_enabled != 0) {
        let fifthInput = utils.textInput(categoryData.input_data[5][0].name, 'modal-input-5', categoryData.input_data[5][0].style, categoryData.input_data[5][0].required, categoryData.input_data[5][0].max_length);
        actionRows.push(new ActionRowBuilder().addComponents(fifthInput));
    }


    for (const row of actionRows) {
        modal.addComponents(row);
    }
    console.log('Generated Modal.')
    return modal;
}

async function genEmbed(title, description) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description);
}

function genContinueButton() {
    let readyButton = new ButtonBuilder()
        .setCustomId('continue-button')
        .setLabel("Ready!")
        .setStyle(1);

    const row = new ActionRowBuilder().addComponents(readyButton);
    return row;

}
async function sendCreateTicketButton(client, interaction) {
    const selectedChannel = interaction.values[0];
    const createButtonChannelId = client.channels.cache.get(selectedChannel);
    const createPetitionButton = new ButtonBuilder()
        .setCustomId('create-ticket')
        .setLabel('Create Ticket')
        .setStyle(1);

    const row = new ActionRowBuilder().addComponents(createPetitionButton);

    await createButtonChannelId.send({ components: [row] });
}

module.exports = {
    genTicketPresets: genTicketPresets,
    getTicketCategoryPresets: getTicketCategoryPresets,
    generateModal: generateModal,
    genEmbed: genEmbed,
    genContinueButton: genContinueButton,
    getTicketCategory: getTicketCategory,
    sendCreateTicketButton: sendCreateTicketButton
}