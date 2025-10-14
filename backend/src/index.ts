import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDatabase from "./config/db.config";

import AuthRoutes from "./features/auth/auth.routes";
import DoctorRoutes from "./features/user/doctor/doctor.routes";

const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "🟢 Server is up & running..." });
});
app.use("/api/auth", AuthRoutes);
app.use("/api/doctor", DoctorRoutes);

server.listen(PORT, () => {
  console.log("🟢 Server is up & running...");
  connectDatabase();
});
