import express from "express";
import PatientController from "./patient.controller";

const router = express.Router();

router.delete("/:id", PatientController.delete);

export default router;
