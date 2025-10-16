import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    memories: [
      {
        type: mongoose.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
