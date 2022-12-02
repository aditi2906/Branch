import adminModel from "../models/adminModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "30d" });
};
export const loginAmin = asyncHandler(async (req, res) => {
  const { name, code } = req.body;
  const user = await adminModel.findOne({ name });
  if (!name || !code) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  if (name == "admin" && code == "1111") {
    res.status(201).json({
      name: "admin",
      _id: user._id,
      isAdmin: true,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Failed to access");
  }
});

export const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [{ name: { $regex: req.query.search, $options: "i" } }],
      }
    : {};

  const users = await userModel.find(keyword);

  res.send(users);
});
