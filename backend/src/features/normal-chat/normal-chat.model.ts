import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

const NormalChat = mongoose.model("NormalChat", chatSchema);
export default NormalChat;
