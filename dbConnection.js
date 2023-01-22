import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const connection = await mysql.createConnection(process.env.DB_CONNECTION);

async function keepAlive(){
    await connection.query("SELECT 1");
    console.log("DB bağlantısı sağlandı");
}
while (true) {
    keepAlive();
    await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 5));
}
export default connection;