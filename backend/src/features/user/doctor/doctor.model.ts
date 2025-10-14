import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
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
  patients: [
    {
      type: mongoose.Types.ObjectId,
    },
  ],
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
