import express from "express";
import {
  allMessages,
  sendAdminMessage,
  sendMessage,
} from "../controller/messageController.js";
import protect from "../middleware/authUser.js";
import protectadmin from "../middleware/auth.js";

const router = express.Router();

router.route("/").post(protectadmin, sendMessage);
router.route("/:chatId").get(allMessages);
router.route("/support").post(protect, sendAdminMessage);
export default router;
