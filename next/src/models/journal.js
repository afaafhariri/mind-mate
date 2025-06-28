import mongoose from "mongoose";

const JournalSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  body: { type: String, required: true },
  location: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.models.Journal ||
  mongoose.model("Journal", JournalSchema);
