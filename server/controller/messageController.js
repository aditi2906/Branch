import asyncHandler from "express-async-handler";
import adminModel from "../models/adminModel.js";
import chatModel from "../models/chatModel.js";
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400);
  }
  var newMessage = {
    sender: req.admin._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await messageModel.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await userModel.populate(message, {
      path: "chat.users",
      select: "name ",
    });
    await chatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const allMessages = asyncHandler(async (req, res) => {
  try {
    const message = await messageModel
      .find({ chat: req.params.chatId })
      .populate("sender", "name pic");
    // .populate("chat")
    // chatModel.populate(message,{path:"latestMessage",
    // select:})
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const sendAdminMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await messageModel.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await adminModel.populate(message, {
      path: "chat.users",
      select: "name ",
    });

    var isChatExist = await chatModel.findById(chatId);
    if (isChatExist) {
      isChatExist.latestMessage = message;
      isChatExist.save();
      // chatModel.updateOne({latestMessage:message})
      res.json(message);
    } else {
      const adminId = "63846e3bc542b886bd8bda23";
      var newChat = {
        chatName: "Admin",
        users: [chatId, adminId],
        _id: chatId,
        latestMessage: message,
      };
      chatModel.create(newChat);
    }

    // await chatModel.findByIdAndUpdate(req.body.chatId, {
    //   latestMessage: message,
    // });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
