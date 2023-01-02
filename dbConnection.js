import mysql from "mysql2/promise";

const connection = await mysql.createConnection(
    {
        database:"notuygulamasi",
        host: "3.127.53.229",
        user: "Eray",
        password: "armut"
    }
);

export default connection;