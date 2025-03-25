import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        note: { type: String, required: true },
        imageUrls: { type: [String], required: false },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to User model
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("Note", NoteSchema);