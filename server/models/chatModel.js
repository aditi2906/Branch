import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
  chatName: { type: String, trim: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  _id: { type: String, required:true },
});

const chatModel = mongoose.model("Chats", chatSchema);

export default chatModel;
