import express, { json, urlencoded } from "express";
import cors from "cors";
import ApiRouter from "./api/routes/index.js"
import dotenv from "dotenv";
import fs from "fs";
import * as https from "https";


dotenv.config();
const app = express();
var privateKey = fs.readFileSync( 'certificates/notebackend.pem' );
var certificate = fs.readFileSync( 'certificates/notebackend.crt' );

https.createServer({
    key: privateKey,
    cert: certificate
}, app);

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(json());
app.use(urlencoded({extended:true}));

app.get("/", (req,res) => {
    res.send("Server'ı buldun :)")
});

app.use("/api", ApiRouter);


app.listen(PORT, () => {
    console.log(`Uygulamam ${PORT} portunda başladı`);
})