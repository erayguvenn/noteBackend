import express, { json, urlencoded } from "express";
import ApiRouter from "./api/routes/index.js"
import dotenv from "dotenv";


dotenv.config();

const app = express();

const PORT = 3000;

app.use(json());
app.use(urlencoded({extended:true}));

app.get("/", (req,res) => {
    res.send("Server'ı buldun :)")
});

app.use("/api", ApiRouter);


app.listen(PORT, () => {
    console.log(`Uygulamam ${PORT} portunda başladı`);
})