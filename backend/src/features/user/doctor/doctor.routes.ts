import express from "express";
import upload from "../../../config/multr.config";
import DoctorController from "./doctor.controller";
const rounter = express.Router();

rounter.post(
  "/upload-memory",
  upload.array("images", 5),
  DoctorController.uploadMemory
);

export default rounter;
