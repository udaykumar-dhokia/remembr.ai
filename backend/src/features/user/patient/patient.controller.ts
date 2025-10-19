import { Request, Response } from "express";
import PatientDAO from "./patient.dao";

const PatientController = {
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Patient ID is required" });
      }

      const deletedPatient = await PatientDAO.deletePatient(id);

      if (!deletedPatient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      return res.status(200).json({
        message: "Patient deleted successfully",
        data: deletedPatient,
      });
    } catch (error: any) {
      console.error("Error deleting patient:", error);
      return res
        .status(500)
        .json({ message: "Failed to delete patient", error: error.message });
    }
  },

  async get(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Patient ID is required" });
      }

      const patient = await PatientDAO.getPatient(id);

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      return res.status(200).json({
        patient,
      });
    } catch (error: any) {
      console.error("Error deleting patient:", error);
      return res
        .status(500)
        .json({ message: "Failed to delete patient", error: error.message });
    }
  },
};

export default PatientController;
