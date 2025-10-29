import Patient from "./patient.model";

class PatientDAO {
  // Check if a patient with this email exists
  async checkEmailExists(email: string): Promise<boolean> {
    const exists = await Patient.exists({ email });
    return !!exists;
  }

  // Create a new patient
  async createUser(
    name: string,
    email: string,
    password: string,
    doctor: string
  ) {
    return await Patient.create({ name, email, password, doctor });
  }

  // Add a memory ID to patient's memories array
  async updateMemory(patientId: string, memoryId: string) {
    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Patient not found");

    await patient.updateOne({
      $push: { memories: memoryId },
    });
  }

  // Get all patients assigned to a doctor
  async getAllByDoctorId(doctorId: string) {
    const patients = await Patient.find({ doctor: doctorId });
    return patients;
  }

  // Delete a patient
  async deletePatient(id: string) {
    const deletedPatient = await Patient.findByIdAndDelete(id);
    return deletedPatient;
  }

  // Get a single patient by ID
  async getPatient(id: string) {
    return await Patient.findById(id);
  }

  // Get a single patient by email (for login)
  async getByEmail(email: string) {
    return await Patient.findOne({ email });
  }

  // Update patient fields
  async updatePatient(
    id: string,
    updateData: Partial<{
      name: string;
      email: string;
      doctor: string;
      password: string;
    }>
  ) {
    const updatedPatient = await Patient.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return updatedPatient;
  }
}

export default new PatientDAO();
