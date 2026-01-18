import mongoose from "mongoose";

// Schema definition for Project collection
const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true },
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  }
  // auto adds createdAt, updatedAt
);

// Avoids OverwriteModelError during hot-reload in Next.js
export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
