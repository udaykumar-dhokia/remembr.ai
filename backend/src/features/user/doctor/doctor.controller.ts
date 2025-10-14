import embeddings from "../../../utils/embeddings";
import { nanoid } from "nanoid";
import memoryDao from "../../memory/memory.dao";
import patientDao from "../patient/patient.dao";
import image from "../../../utils/image";

const DoctorController = {
  uploadMemory: async (req, res) => {
    const { doctor, patient, text } = req.body;
    if (!doctor || !patient || !text) {
      return res.status(403).json({ message: "Missing required fields." });
    }
    try {
      const vectorId = nanoid(7);
      const embed = await embeddings.generate(text);
      const pineconeEmbed = await embeddings.upload(
        vectorId,
        patient,
        embed.embeddings[0].values
      );
      const memory = await memoryDao.create(patient, doctor, text, vectorId);
      await patientDao.updateMemory(patient, memory._id.toString());
      const urls = await image.upload(req.files, patient);
      await memoryDao.update(urls, memory);

      return res.status(200).json({
        message: "Embeddings generated successfully",
        memory,
        pineconeEmbed,
      });
    } catch (error) {
      res.status(500).json({ message: "Interval server error." });
    }
  },
};

export default DoctorController;
