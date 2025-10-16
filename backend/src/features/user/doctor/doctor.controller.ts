import embeddings from "../../../utils/embeddings";
import { nanoid } from "nanoid";
import memoryDao from "../../memory/memory.dao";
import patientDao from "../patient/patient.dao";
import image from "../../../utils/image";
import HttpStatus from "../../../utils/httpStatus";

const DoctorController = {
  uploadMemory: async (req, res) => {
    const { doctor, patient, text } = req.body;
    if (!doctor || !patient || !text) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing required fields." });
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

      return res.status(HttpStatus.OK).json({
        message: "Embeddings generated successfully",
        memory,
        pineconeEmbed,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Interval server error." });
    }
  },
  fetchPatients: async (req, res) => {
    const id = req.query.id;
    if (!id) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing required fields." });
    }
    try {
      const patients = await patientDao.getAllByDoctorId(id);
      return res.status(HttpStatus.OK).json({ patients });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Interval server error." });
    }
  },
};

export default DoctorController;
