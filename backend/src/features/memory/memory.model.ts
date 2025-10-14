import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
  patient: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  doctor: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  vectorId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  images: [{ type: String, required: true }],
});

const Memory = mongoose.model("Memory", memorySchema);
export default Memory;
