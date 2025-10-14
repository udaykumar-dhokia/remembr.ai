import Patient from "./patient.model";

class PatientDAO {
  async checkEmailExists(email: string): Promise<boolean> {
    const exists = await Patient.exists({ email });
    return !!exists;
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    doctor: string
  ) {
    return await Patient.create({ name, email, password, doctor });
  }

  async updateMemory(patientId: string, memoryId: string) {
    const patient = await Patient.findById(patientId);
    await patient.updateOne({
      $push: { memories: memoryId },
    });
  }
}

export default new PatientDAO();
