import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: String,
  age: Number,
  country: String,
  city: String,
  occupation: String,
  mentalstate: {
    type: String,
    enum: ["positive", "negative"],
    default: "positive",
  },
  createdAt: { type: Date, default: Date.now },
  totalBlogs: { type: Number, default: 0 },
  totalJournals: { type: Number, default: 0 },
  totalComments: { type: Number, default: 0 },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
