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

async function genDB() {
    let dbGen = [];
    dbGen[1] = "CREATE TABLE IF NOT EXISTS Embeds(embed_id INT PRIMARY KEY AUTO_INCREMENT,label VARCHAR(255) NOT NULL ,description TEXT, preEmbed INT, postEmbed INT);";
    dbGen[2] = "CREATE TABLE IF NOT EXISTS TextInputs(input_id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255) NOT NULL ,style INT NOT NULL,required TINYINT(1) NOT NULL,max_length INT);";
    dbGen[3] = "CREATE TABLE IF NOT EXISTS Modals(modal_id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255) NOT NULL ,input_1_enabled TINYINT(1) NOT NULL,input_1_id INT,input_2_enabled TINYINT(1) NOT NULL,input_2_id INT,input_3_enabled TINYINT(1) NOT NULL,input_3_id INT,input_4_enabled TINYINT(1) NOT NULL,input_4_id INT,input_5_enabled TINYINT(1) NOT NULL,input_5_id INT,FOREIGN KEY(input_1_id) REFERENCES TextInputs(input_id),FOREIGN KEY(input_2_id) REFERENCES TextInputs(input_id),FOREIGN KEY(input_3_id) REFERENCES TextInputs(input_id),FOREIGN KEY(input_4_id) REFERENCES TextInputs(input_id),FOREIGN KEY(input_5_id) REFERENCES TextInputs(input_id) );";
    dbGen[4] = "CREATE TABLE IF NOT EXISTS TicketType(type_id INT PRIMARY KEY AUTO_INCREMENT,enabled TINYINT(1) NOT NULL,name VARCHAR(255) NOT NULL,send_pre_embed TINYINT(1) NOT NULL,pre_embed_id INT,modal_id INT,send_post_embed TINYINT(1) NOT NULL,post_embed_id INT,ticket_recieve_channel BIGINT NOT NULL,FOREIGN KEY(pre_embed_id) REFERENCES Embeds(embed_id),FOREIGN KEY(modal_id) REFERENCES Modals(modal_id),FOREIGN KEY(post_embed_id) REFERENCES Embeds(embed_id));";
    dbGen[5] = "CREATE TABLE IF NOT EXISTS General(guild_id BIGINT PRIMARY KEY,guide_role_id BIGINT NOT NULL);";
    

    try {
        for (let query of dbGen) {
            if (query) {
                await SQLQuery(query); // Execute each query separately
            }
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    SQLQuery: SQLQuery,
    genDB: genDB,

};