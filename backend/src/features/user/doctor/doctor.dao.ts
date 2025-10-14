import Doctor from "./doctor.model";

class DoctorDAO {
  async checkEmailExists(email: string): Promise<boolean> {
    const exists = await Doctor.exists({ email });
    return !!exists;
  }

  async createUser(name: string, email: string, password: string) {
    return await Doctor.create({ name, email, password });
  }

  async getByEmail(email: string) {
    return await Doctor.findOne({ email });
  }

  async getById(id) {
    return await Doctor.findById(id);
  }
}

export default new DoctorDAO();
