import HttpStatus from "../../utils/httpStatus";
import memoryDao from "./memory.dao";

const MemoryContoller = {
  getMemoryByPatient: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing required field" });
    }
    try {
      const memories = await memoryDao.getMemoriesByPatient(id);
      return res.status(HttpStatus.OK).json({ memories });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Interval server error." });
    }
  },
};

export default MemoryContoller;
