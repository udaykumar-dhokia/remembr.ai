import express from "express";
import AuthController from "./auth.controller";
import authMiddleware from "../../middlewares/auth.middleware";
const router = express.Router();

// Doctor Routes
router.post("/doctor/register", AuthController.registerDoctor);
router.post("/doctor/login", AuthController.loginDoctor);
router.get("/doctor/persist", authMiddleware, AuthController.persist);

// Patient Routes
router.post("/patient/register", AuthController.registerPatient);
router.post("/patient/login", AuthController.loginPatient);
router.get("/patient/persist", AuthController.persistPatient);

export default router;
