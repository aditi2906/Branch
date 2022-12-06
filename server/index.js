import express, { application } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./Routes/userRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import uploadRoute from "./Routes/uploadRoutes.js";
import { Server } from "socket.io";
const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
dotenv.config();
const PORT = process.env.PORT || 5000;
const CONNECTION = process.env.MONGODB;

mongoose
  .connect(CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((error) => console.log("not connected"));

const server = app.listen(5000, console.log("working"));

const io = new Server(server, {
  pingTimeout: 40000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socketio");
  socket.on("setup", (userData) => {
    console.log("hello check", userData);
    socket.join(userData?._id);
    // console.log(userData._id);
    socket.emit("connection");
  });
  socket.on("joining", (room) => {
    socket.join(room);
    console.log("joined room " + room);
  });
  socket.on("new msg", (newm) => {
    console.log(newm, "hehe");
    var chat = newm.chat;
    console.log(chat);
    if (!chat.users) return console.log("users not dev");
    chat.users.forEach((user) => {
      socket.in(user._id).emit("received msg", newm);
    });
    //
  });
});

app.get("/api/chat/:id", (req, res) => {
  const singleChat = Chats.find((c) => c.id === req.params._id);
  res.send(singleChat);
});
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/upload", uploadRoute);
