import jwt from "jsonwebtoken";

class JWT {
  async generate(id: string) {
    return await jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  }

  async verify(token, JWT_SECRET) {
    return await jwt.verify(token, JWT_SECRET);
  }
}

export default new JWT();
