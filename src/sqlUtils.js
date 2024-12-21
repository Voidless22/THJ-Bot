const mysql = require('mysql2/promise');
require('dotenv').config();

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

const tableDefinitions = [
    // Embeds
    {
        table: "embeds",
        createQuery: `CREATE TABLE embeds (
            embed_id INT PRIMARY KEY AUTO_INCREMENT,
            label VARCHAR(255) NOT NULL,
            description TEXT,
            preEmbed INT,
            postEmbed INT
        );`,
        columns: [
            { columnName: "embed_id", columnDef: "INT AUTO_INCREMENT" },
            { columnName: "label", columnDef: "VARCHAR(255) NOT NULL" },
            { columnName: "description", columnDef: "TEXT" },
            { columnName: "preEmbed", columnDef: "INT" },
            { columnName: "postEmbed", columnDef: "INT" }
        ],
        primaryKey: ["embed_id"]
    },
    // Text Inputs
    {
        table: "textinputs",
        createQuery: `CREATE TABLE textinputs (
            input_id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            style INT NOT NULL,
            required TINYINT NOT NULL,
            max_length INT
        );`,
        columns: [
            { columnName: "input_id", columnDef: "INT AUTO_INCREMENT" },
            { columnName: "name", columnDef: "VARCHAR(255) NOT NULL" },
            { columnName: "style", columnDef: "INT NOT NULL" },
            { columnName: "required", columnDef: "TINYINT NOT NULL" },
            { columnName: "max_length", columnDef: "INT" }
        ],
        primaryKey: ["input_id"]
    },
    // Modals
    {
        table: "modals",
        createQuery: `CREATE TABLE modals (
            modal_id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            input_1_enabled TINYINT NOT NULL,
            input_1_id INT,
            input_2_enabled TINYINT NOT NULL,
            input_2_id INT,
            input_3_enabled TINYINT NOT NULL,
            input_3_id INT,
            input_4_enabled TINYINT NOT NULL,
            input_4_id INT,
            input_5_enabled TINYINT NOT NULL,
            input_5_id INT,
            FOREIGN KEY(input_1_id) REFERENCES textinputs(input_id),
            FOREIGN KEY(input_2_id) REFERENCES textinputs(input_id),
            FOREIGN KEY(input_3_id) REFERENCES textinputs(input_id),
            FOREIGN KEY(input_4_id) REFERENCES textinputs(input_id),
            FOREIGN KEY(input_5_id) REFERENCES textinputs(input_id)
        );`,
        columns: [
            { columnName: "modal_id", columnDef: "INT AUTO_INCREMENT" },
            { columnName: "name", columnDef: "VARCHAR(255) NOT NULL" },
            { columnName: "input_1_enabled", columnDef: "TINYINT NOT NULL" },
            { columnName: "input_1_id", columnDef: "INT" },
            { columnName: "input_2_enabled", columnDef: "TINYINT NOT NULL" },
            { columnName: "input_2_id", columnDef: "INT" },
            { columnName: "input_3_enabled", columnDef: "TINYINT NOT NULL" },
            { columnName: "input_3_id", columnDef: "INT" },
            { columnName: "input_4_enabled", columnDef: "TINYINT NOT NULL" },
            { columnName: "input_4_id", columnDef: "INT" },
            { columnName: "input_5_enabled", columnDef: "TINYINT NOT NULL" },
            { columnName: "input_5_id", columnDef: "INT" }
        ],
        primaryKey: ["modal_id"]
    },
    // General
    {
        table: "general",
        createQuery: `CREATE TABLE general (
            guild_id BIGINT PRIMARY KEY,
            staff_role_id BIGINT NOT NULL DEFAULT '0',
            ticket_lockout_time INT NOT NULL DEFAULT '0'
        );`,
        columns: [
            { columnName: "guild_id", columnDef: "BIGINT PRIMARY KEY" },
            { columnName: "ticket_lockout_time", columnDef: "INT NOT NULL DEFAULT '0'" },
            { columnName: "staff_role_id", columnDef: "BIGINT NOT NULL DEFAULT '0'" }
        ],
        primaryKey: ['guild_id']
    },
    {
        table: "tickettimer",
        createQuery: `CREATE TABLE tickettimer (
            guild_id BIGINT PRIMARY KEY,
            discord_usr_id BIGINT NOT NULL DEFAULT '0',
            ticket_cat_id INT NOT NULL DEFAULT '0',
            last_ticket_time TIMESTAMP
        );`,
        columns: [
            { columnName: "guild_id", columnDef: "BIGINT PRIMARY KEY" },
            { columnName: "discord_usr_id", columnDef: "BIGINT NOT NULL DEFAULT '0'" },
            { columnName: "ticket_cat_id", columnDef: "INT NOT NULL DEFAULT '0'" },
            { columnName: "last_ticket_time", columnDef: "TIMESTAMP" }
        ],
        primaryKey: ['guild_id']
    },
    {
        table: "tickettype",
        createQuery: `CREATE TABLE tickettype (
            type_id INT PRIMARY KEY AUTO_INCREMENT,
            enabled TINYINT NOT NULL,
            name VARCHAR(255) NOT NULL,
            send_pre_embed TINYINT NOT NULL,
            pre_embed_id INT,
            modal_id INT,
            send_post_embed TINYINT NOT NULL,
            post_embed_id INT,
            ticket_recieve_channel VARCHAR(255),
            ping_staff_role TINYINT NOT NULL,
            ticket_log_channel VARCHAR(255)
        );`,
        columns: [
            { columnName: "type_id", columnDef: "INT AUTO_INCREMENT PRIMARY KEY" },
            { columnName: "enabled", columnDef: "TINYINT NOT NULL" },
            { columnName: "name", columnDef: "VARCHAR(255) NOT NULL" },
            { columnName: "send_pre_embed", columnDef: "TINYINT NOT NULL" },
            { columnName: "pre_embed_id", columnDef: "INT" },
            { columnName: "modal_id", columnDef: "INT" },
            { columnName: "send_post_embed", columnDef: "TINYINT NOT NULL" },
            { columnName: "post_embed_id", columnDef: "INT" },
            { columnName: "ticket_recieve_channel", columnDef: "VARCHAR(255)" },
            { columnName: "ping_staff_role", columnDef: "TINYINT NOT NULL" },
            { columnName: "ticket_log_channel", columnDef: "VARCHAR(255)" }
        ],
        primaryKey: ["type_id"]
    },
];

async function genDB() {
    try {
        // For each table definition
        for (const { table, createQuery, columns, primaryKey } of tableDefinitions) {
            // check if the table exists in the database
            const tableExists = await SQLQuery(`SHOW TABLES LIKE '${table}'`);
            // if it doesn't, create it and move to the next step
            if (tableExists.length === 0) {
                await SQLQuery(createQuery);
                continue;
            }
            // we need to make sure the columns match up
            else {
                // for each column name and it's definition in this table
                console.log(columns)
                for (const { columnName, columnDef } of columns) {
                    const columnExists = await SQLQuery(`SHOW COLUMNS FROM ${table} LIKE '${columnName}'`);
                    // if the column doesn't exist, add it
                    if (columnExists.length === 0) {
                        await SQLQuery(`ALTER TABLE ${table} ADD COLUMN ${columnName} ${columnDef}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Database generation failed:", error);
        throw error;
    }
}


module.exports = {
    SQLQuery: SQLQuery,
    genDB: genDB,

};