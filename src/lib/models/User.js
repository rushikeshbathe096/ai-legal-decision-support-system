import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  role: {
    type: String,
    enum: ["police", "judge", "govt"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
