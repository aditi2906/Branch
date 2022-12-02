import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import adminModel from "../models/adminModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_KEY);

      req.admin = await adminModel.findById(decoded.id).select("-code");
      
      // Control-Flow
      if(req.admin == null) throw new Error('Not Admin');

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export default protect;
