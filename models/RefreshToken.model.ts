import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    deviceInfo: {
      ip: {
        type: String,
      },
      deviceName: {
        type: String, // Optional (e.g., "Chrome on Windows")
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("refreshtokens", RefreshTokenSchema);
