import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const connection = await mysql.createConnection(process.env.DB_CONNECTION);


setInterval(keepAlive, 1000 * 60 * 5);

async function keepAlive(){
    await connection.query("SELECT 1");
    console.log("DB bağlantısı sağlandı");
}

export default connection;