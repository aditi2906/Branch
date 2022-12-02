import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  pic: {
    type: String,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  isAdmin: { type: Boolean, default: false },
});
const userModel = mongoose.model("User", userSchema);
export default userModel;
