import express from "express";
import { loginUser, registerUser } from "../controller/userController.js";
import protect from "../middleware/auth.js";
const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", loginUser);

export default router;
