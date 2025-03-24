import mongoose from "mongoose";
const StorySchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
export default mongoose.model("User", StorySchema);
