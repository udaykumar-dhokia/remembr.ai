import express from "express";
import PatientController from "./patient.controller";

const router = express.Router();

router.delete("/:id", PatientController.delete);
router.get("/:id", PatientController.get);

export default router;
