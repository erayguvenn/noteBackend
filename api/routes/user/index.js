import express from "express";
import Authorization from "../../middleware/authorization.js";
import { getUser,updateUser} from "../../controllers/userController.js"

const router = express.Router();

//router.get('/', Authorization, getAll)
router.get('/:id', Authorization, getUser)
router.put('/:id', Authorization, updateUser);


export default router;