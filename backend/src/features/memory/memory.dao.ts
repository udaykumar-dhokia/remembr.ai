import Memory from "./memory.model";

class MemoryDAO {
  async create(
    patient: string,
    doctor: string,
    text: string,
    vectorId: string
  ) {
    return await Memory.create({ patient, doctor, text, vectorId });
  }

  async update(urls, memoryId) {
    const memory = await Memory.findById(memoryId);
    await memory.updateOne({
      $set: { images: urls },
    });
  }

  async getMemoriesByPatient(id: string) {
    return await Memory.find({ patient: id });
  }
}

export default new MemoryDAO();
