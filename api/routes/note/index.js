import express from "express";
import Authorization from "../../middleware/authorization.js";
import { getAll, getSingle, createNote, updateNote, deleteNote } from "../../controllers/noteController.js"

const router = express.Router();

router.get('/', Authorization, getAll)
router.get('/:id', Authorization, getSingle)
router.get('/:queryParam')

router.post('/', Authorization, createNote);
router.put('/:id', Authorization, updateNote);
router.delete('/:id', Authorization, deleteNote);

export default router;