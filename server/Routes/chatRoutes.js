import express from "express";
import {
  accessAdminChat,
  accessChat,
  fetchChats,
} from "../controller/chatController.js";
import protect from "../middleware/authUser.js";
import protectAdmin from "../middleware/auth.js";

const router = express.Router();

router.route("/").post(protectAdmin, accessChat);
router.route("/").get(protectAdmin, fetchChats);
router.route("/adminaccess").post(protect, accessAdminChat);

export default router;
