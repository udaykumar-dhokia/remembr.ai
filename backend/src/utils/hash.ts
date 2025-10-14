import bcrypt from "bcryptjs";

class Hash {
  async hashPasword(password: string) {
    const hashedPasword = await bcrypt.hash(password, 10);
    return hashedPasword;
  }

  async compare(password: string, hashedPasword: string) {
    return await bcrypt.compare(password, hashedPasword);
  }
}

export default new Hash();
