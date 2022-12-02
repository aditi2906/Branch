import mongoose from "mongoose";
const adminSchema = mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: true },
});
const adminModel = mongoose.model("Admin", adminSchema);
export default adminModel;
