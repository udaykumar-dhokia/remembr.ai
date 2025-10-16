import express from "express";
import upload from "../../../config/multr.config";
import DoctorController from "./doctor.controller";
const router = express.Router();

router.post(
  "/upload-memory",
  upload.array("images", 5),
  DoctorController.uploadMemory
);
router.get("/get-patients", DoctorController.fetchPatients);

export default router;
