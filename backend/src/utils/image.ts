import fs from "fs";
import cloudinary from "../config/cloudinary.config";

class Image {
  async upload(files, patientId) {
    const urls = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `BTP/${patientId}`,
      });
      urls.push(result.secure_url);
      fs.unlinkSync(file.path);
    }

    return urls;
  }
}

export default new Image();
