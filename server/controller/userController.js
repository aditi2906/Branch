import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "30d" });
};
export const registerUser = asyncHandler(async (req, res) => {
  const { name, code, pic } = req.body;
  if (!name || !code) {
    res.status(400);
    throw new Error("Please enter all fields");
  }
  const userExists = await userModel.findOne({ code });
  if (userExists) {
    res.status(400);
    throw new Error("User with this code already exists");
  }
  const user = await userModel.create({
    name,
    code,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      pic: user.pic,
      isAdmin: false,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Failed to create user");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const user = await userModel.findOne({ code });

  const validity = () => {
    if (user.code == code) return true;
  };
  if (validity) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid code");
  }
});
