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

async function getForeignKeys(table) {
    return await SQLQuery(`
        SELECT 
            CONSTRAINT_NAME,
            COLUMN_NAME,
            REFERENCED_TABLE_NAME,
            REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_NAME = ?
        AND REFERENCED_TABLE_NAME IS NOT NULL`,
        [table]
    );
}

async function modifyColumn(table, columnName, definition, isPrimaryKey) {
    const timestamp = Date.now();
    const tempTable = `${table}_temp_${timestamp}`;
    const isAutoIncrement = definition.toUpperCase().includes('AUTO_INCREMENT');
    
    await SQLQuery('SET FOREIGN_KEY_CHECKS=0');
    
    try {
        await SQLQuery(`DROP TABLE IF EXISTS ${tempTable}`);
        const foreignKeys = await getForeignKeys(table);
        
        if (isAutoIncrement) {
            await SQLQuery(`CREATE TABLE ${tempTable} LIKE ${table}`);
            await SQLQuery(`ALTER TABLE ${tempTable} MODIFY COLUMN ${columnName} ${definition}`);
            await SQLQuery(`INSERT INTO ${tempTable} SELECT * FROM ${table}`);
        } else if (isPrimaryKey) {
            await SQLQuery(`CREATE TABLE ${tempTable} LIKE ${table}`);
            const defWithoutPK = definition.replace(/PRIMARY KEY/i, '').trim();
            await SQLQuery(`ALTER TABLE ${tempTable} MODIFY COLUMN ${columnName} ${defWithoutPK}`);
            await SQLQuery(`ALTER TABLE ${tempTable} DROP PRIMARY KEY`);
            await SQLQuery(`ALTER TABLE ${tempTable} ADD PRIMARY KEY (${columnName})`);
            await SQLQuery(`INSERT INTO ${tempTable} SELECT * FROM ${table}`);
        } else {
            await SQLQuery(`CREATE TABLE ${tempTable} LIKE ${table}`);
            await SQLQuery(`ALTER TABLE ${tempTable} MODIFY COLUMN ${columnName} ${definition}`);
            await SQLQuery(`INSERT INTO ${tempTable} SELECT * FROM ${table}`);
        }

        await SQLQuery(`DROP TABLE ${table}`);
        await SQLQuery(`RENAME TABLE ${tempTable} TO ${table}`);

        for (const fk of foreignKeys) {
            await SQLQuery(`
                ALTER TABLE ${table} 
                ADD CONSTRAINT ${fk.CONSTRAINT_NAME}
                FOREIGN KEY (${fk.COLUMN_NAME})
                REFERENCES ${fk.REFERENCED_TABLE_NAME}(${fk.REFERENCED_COLUMN_NAME})
                ON DELETE CASCADE
                ON UPDATE CASCADE
            `);
        }
    } catch (error) {
        await SQLQuery(`DROP TABLE IF EXISTS ${tempTable}`);
        throw error;
    } finally {
        await SQLQuery('SET FOREIGN_KEY_CHECKS=1');
    }
}

function buildColumnDefinition(column) {
    return `${column.COLUMN_TYPE} ${column.IS_NULLABLE === 'YES' ? '' : 'NOT NULL'} ${
        column.COLUMN_DEFAULT ? `DEFAULT ${column.COLUMN_DEFAULT}` : ''} ${column.EXTRA}`.trim();
}

function arrayEquals(a, b) {
    return Array.isArray(a) && Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}
async function genDB() {
    const tableDefinitions = [
        {
            table: "embeds",
            createQuery: `CREATE TABLE embeds (
                embed_id INT PRIMARY KEY AUTO_INCREMENT,
                label VARCHAR(255) NOT NULL,
                description TEXT,
                preEmbed INT,
                postEmbed INT
            );`,
            columns: {
                embed_id: "INT AUTO_INCREMENT",
                label: "VARCHAR(255) NOT NULL",
                description: "TEXT",
                preEmbed: "INT",
                postEmbed: "INT"
            },
            primaryKey: ["embed_id"]
        },
        {
            table: "textinputs",
            createQuery: `CREATE TABLE textinputs (
                input_id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                style INT NOT NULL,
                required TINYINT(1) NOT NULL,
                max_length INT
            );`,
            columns: {
                input_id: "INT AUTO_INCREMENT",
                name: "VARCHAR(255) NOT NULL",
                style: "INT NOT NULL",
                required: "TINYINT(1) NOT NULL",
                max_length: "INT"
            },
            primaryKey: ["input_id"]
        },
        {
            table: "modals",
            createQuery: `CREATE TABLE modals (
                modal_id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                input_1_enabled TINYINT(1) NOT NULL,
                input_1_id INT,
                input_2_enabled TINYINT(1) NOT NULL,
                input_2_id INT,
                input_3_enabled TINYINT(1) NOT NULL,
                input_3_id INT,
                input_4_enabled TINYINT(1) NOT NULL,
                input_4_id INT,
                input_5_enabled TINYINT(1) NOT NULL,
                input_5_id INT,
                FOREIGN KEY(input_1_id) REFERENCES textinputs(input_id),
                FOREIGN KEY(input_2_id) REFERENCES textinputs(input_id),
                FOREIGN KEY(input_3_id) REFERENCES textinputs(input_id),
                FOREIGN KEY(input_4_id) REFERENCES textinputs(input_id),
                FOREIGN KEY(input_5_id) REFERENCES textinputs(input_id)
            );`,
            columns: {
                modal_id: "INT AUTO_INCREMENT",
                name: "VARCHAR(255) NOT NULL",
                input_1_enabled: "TINYINT(1) NOT NULL",
                input_1_id: "INT",
                input_2_enabled: "TINYINT(1) NOT NULL",
                input_2_id: "INT",
                input_3_enabled: "TINYINT(1) NOT NULL",
                input_3_id: "INT",
                input_4_enabled: "TINYINT(1) NOT NULL",
                input_4_id: "INT",
                input_5_enabled: "TINYINT(1) NOT NULL",
                input_5_id: "INT"
            },
            primaryKey: ["modal_id"]
        },
        {
            table: "general",
            createQuery: `CREATE TABLE general (
                guild_id BIGINT PRIMARY KEY,
                staff_role_id BIGINT NOT NULL DEFAULT '0',
                ticket_lockout_time INT NOT NULL DEFAULT '0'
            );`,
            columns: {
                guild_id: "BIGINT PRIMARY KEY ",
                ticket_lockout_time: "INT NOT NULL DEFAULT '0'",
                staff_role_id: "BIGINT NOT NULL DEFAULT '0'"
            },
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
            columns: {
                guild_id: "BIGINT PRIMARY KEY ",
                discord_usr_id: "BIGINT NOT NULL DEFAULT '0'",
                ticket_cat_id: "INT NOT NULL DEFAULT '0'",
                last_ticket_time: "TIMESTAMP"
            },
            primaryKey: ['guild_id']
        }
    ];

    try {
        for (const { table, createQuery, columns, primaryKey } of tableDefinitions) {
            const tableExists = await SQLQuery(`SHOW TABLES LIKE '${table}'`);
            
            if (tableExists.length === 0) {
                await SQLQuery(createQuery);
                continue;
            }

            const existingColumns = await SQLQuery(`
                SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA, COLUMN_KEY
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?`, 
                [table, process.env.DB_NAME]
            );

            await SQLQuery('START TRANSACTION');
            try {
                for (const [columnName, definition] of Object.entries(columns)) {
                    const existingColumn = existingColumns.find(col => col.COLUMN_NAME === columnName);
                    
                    if (!existingColumn) {
                        await SQLQuery(`ALTER TABLE ${table} ADD COLUMN ${columnName} ${definition}`);
                        continue;
                    }

                    const currentDef = buildColumnDefinition(existingColumn);
                    if (currentDef.toUpperCase() !== definition.toUpperCase()) {
                        const isPrimaryKey = primaryKey.includes(columnName);
                        await modifyColumn(table, columnName, definition, isPrimaryKey);
                    }
                }
                await SQLQuery('COMMIT');
            } catch (error) {
                await SQLQuery('ROLLBACK');
                throw error;
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