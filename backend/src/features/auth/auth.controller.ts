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
      const token = jwt.generate(user._id.toString());
      res.cookie("token", token, cookieOptions);
      return res
        .status(200)
        .json({ message: "User registered successfully.", token });
    } catch (error) {
      res.status(500).json({ message: "Interval server error." });
    }
  },

  login: async (req, res) => {
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
};
export default AuthController;
