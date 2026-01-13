import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.ObjectId,
      ref: "Gig",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Please add a bid amount"],
    },
    message: {
      type: String,
      required: [true, "Please add a message"],
    },
    status: {
      type: String,
      enum: ["pending", "hired", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

bidSchema.index({ gig: 1, freelancer: 1 }, { unique: true });

export default mongoose.model("Bid", bidSchema);
