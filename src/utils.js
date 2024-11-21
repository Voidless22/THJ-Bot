const { TextInputBuilder } = require('discord.js');
const mysql = require('mysql2/promise');

function textInput(label, id, style, required, maxLength) {
    return new TextInputBuilder()
    .setLabel(label)
    .setCustomId(id)
    .setStyle(style)
    .setRequired(required)
    .setMaxLength(maxLength)
}

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}
const dbPool = mysql.createPool(dbConfig);


async function SQLQuery(sql, values) {
    const connection = await dbPool.getConnection();
    try {
        const [results, fields] = await connection.query(sql, values);
        return results;
    } catch (error) {
        console.error('Query Execution Error:', error);
        throw error;
    } finally {
        connection.release();
    }
}


module.exports = {
    textInput: textInput,
    SQLQuery: SQLQuery
}