import express from "express";
import AuthRouter from "./auth/index.js"
import NoteRouter from "./note/index.js"
import UserRouter from "./user/index.js"

const router = express.Router();

router.use("/note", NoteRouter);
router.use("/auth", AuthRouter);
router.use("/user", UserRouter);

router.get("/", (req, res) => {
    res.send("Api rotasını buldun")
})

export default router;