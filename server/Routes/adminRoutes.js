import express from "express";
import { loginAmin, allUsers } from "../controller/adminController.js";
import protect from "../middleware/auth.js";
const router = express.Router();

router.post("/login", loginAmin);
router.route("/").get(protect, allUsers);
export default router;
