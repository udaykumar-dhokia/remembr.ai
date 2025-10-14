import express from "express";
import AuthController from "./auth.controller";
import authMiddleware from "../../middlewares/auth.middleware";
const router = express.Router();

// Doctor Routes
router.post("/doctor/register", AuthController.registerDoctor);
router.post("/doctor/login", AuthController.login);
router.get("/doctor/persist", authMiddleware, AuthController.persist);

// Patient Routes
router.post("/patient/register", AuthController.registerPatient);

export default router;
