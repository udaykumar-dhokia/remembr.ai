import cookieOptions from "../../utils/cookieOptions";
import hash from "../../utils/hash";
import HttpStatus from "../../utils/httpStatus";
import jwt from "../../utils/jwt";
import doctorDao from "../user/doctor/doctor.dao";
import patientDao from "../user/patient/patient.dao";

const AuthController = {
  // Doctor
  registerDoctor: async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(403).json({ message: "Missing required fields." });
    }
    try {
      if (await doctorDao.checkEmailExists(email)) {
        return res.status(401).json({ message: "User already exists." });
      }
      const hashedPasword = await hash.hashPasword(password);
      const user = await doctorDao.createUser(name, email, hashedPasword);
      const token = await jwt.generate(user._id.toString());
      res.cookie("token", token, cookieOptions);
      return res
        .status(200)
        .json({ message: "User registered successfully.", token });
    } catch (error) {
      res.status(500).json({ message: "Interval server error." });
    }
  },

  loginDoctor: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({ message: "Missing required fields." });
    }
    try {
      const user = await doctorDao.getByEmail(email);
      if (!user || !(await hash.compare(password, user.password.toString()))) {
        return res.status(401).json({ message: "Invalid credentails." });
      }
      const token = await jwt.generate(user._id.toString());
      res.cookie("token", token, cookieOptions);
      return res
        .status(200)
        .json({ message: "User registered successfully.", token });
    } catch (error) {
      res.status(500).json({ message: "Interval server error." });
    }
  },

  persist: (req, res) => {
    const user = req.user;
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorised." });
    }
    return res.status(HttpStatus.OK).json({ user });
  },

  // Patient
  registerPatient: async (req, res) => {
    const { name, email, password, doctor } = req.body;
    if (!name || !email || !password || !doctor) {
      return res.status(403).json({ message: "Missing required fields." });
    }
    try {
      if (await patientDao.checkEmailExists(email)) {
        return res.status(401).json({ message: "Patient already exists." });
      }
      const hashedPasword = await hash.hashPasword(password);
      const user = await patientDao.createUser(
        name,
        email,
        hashedPasword,
        doctor
      );
      return res
        .status(200)
        .json({ message: "Patient registered successfully.", user });
    } catch (error) {
      res.status(500).json({ message: "Interval server error." });
    }
  },

  loginPatient: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({ message: "Missing required fields." });
    }

    try {
      const patient = await patientDao.getByEmail(email);
      if (!patient) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const isMatch = await hash.compare(password, patient.password.toString());
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const token = await jwt.generate(patient._id.toString());

      return res.status(200).json({
        message: "Patient logged in successfully.",
        token,
        patient: {
          _id: patient._id,
          name: patient.name,
          email: patient.email,
          doctor: patient.doctor,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error." });
    }
  },

  persistPatient: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Missing or invalid token." });
      }

      const token = authHeader.split(" ")[1];

      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.id) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Invalid token." });
      }

      const patient = await patientDao.getPatient(decoded.id);
      if (!patient) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Patient not found." });
      }

      return res.status(HttpStatus.OK).json({
        user: {
          _id: patient._id,
          name: patient.name,
          email: patient.email,
          doctor: patient.doctor,
        },
      });
    } catch (error) {
      console.error("PersistPatient Error:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error." });
    }
  },
};
export default AuthController;
