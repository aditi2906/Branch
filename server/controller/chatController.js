import asyncHandler from "express-async-handler";
import adminModel from "../models/adminModel.js";
import chatModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";

export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId not found with request ");
  }
  var isChat = await chatModel
    .find({
      isAdmin: false,
      $and: [{ users: { $elemMatch: { $eq: userId } } }],
    })
    .populate("users", "-code");

  isChat = await userModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      users: [userId],
      _id: userId,
    };
  }
  try {
    const createdChat = await chatModel.create(chatData);
    console.log(chatData);
    const FullChat = await chatModel
      .findOne({ _id: createdChat._id })
      .populate("users", "-code");
    res.status(200).json(FullChat);
    console.log(createdChat._id);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const fetchChats = asyncHandler(async (req, res) => {
  try {
    chatModel
      .find({})
      .populate("users", "-code")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await userModel.populate(result, {
          path: "latestMessage.sender",
          select: "name pic",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const accessAdminChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId not found with request ");
  }
  var isChat = await chatModel
    .find({
      isAdmin: true,
    })
    .populate("users", "-code")
    .populate("latestMessage");

  isChat = await adminModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      users: [userId],
    };
  }
  try {
    const createdChat = await chatModel.create(chatData);
    console.log(chatData);
    const FullChat = await chatModel
      .findOne({ _id: createdChat._id })
      .populate("users", "-code");
    res.status(200).json(FullChat);
    console.log(createdChat._id);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
