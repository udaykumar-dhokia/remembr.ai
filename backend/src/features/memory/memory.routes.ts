import express from "express";
import MemoryContoller from "./memory.controller";

const router = express.Router();

router.get("/patient/:id", MemoryContoller.getMemoryByPatient);

export default router;
