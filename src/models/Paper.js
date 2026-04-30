import mongoose from "mongoose";

const PaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    subject: {
      type: String,
      required: [true, "Please provide a subject"],
    },
    year: {
      type: Number,
      required: [true, "Please provide a year"],
    },
    semester: {
      type: Number,
      required: [true, "Please provide a semester"],
    },
    branch: {
      type: String,
      required: [true, "Please provide a branch"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    link: {
      type: String,
      required: [true, "Please provide a file link"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    downloadedBy: [{
      userId: mongoose.Schema.Types.ObjectId,
      downloadedAt: Date
    }],
  },
  { timestamps: true }
);

export default mongoose.models.Paper || mongoose.model("Paper", PaperSchema);