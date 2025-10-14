import doctorDao from "../features/user/doctor/doctor.dao";
import jwt from "../utils/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

async function authMiddleware(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  try {
    const decoded = await jwt.verify(token, JWT_SECRET);
    const user = await doctorDao.getById(decoded.id);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export default authMiddleware;
