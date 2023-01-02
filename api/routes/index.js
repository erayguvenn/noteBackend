import express from "express";
import AuthRouter from "./auth/index.js"
import NoteRouter from "./note/index.js"

const router = express.Router();

router.use("/note", NoteRouter);
router.use("/auth", AuthRouter);

router.get("/", (req, res) => {
    res.send("Api rotasını buldun")
})

export default router;