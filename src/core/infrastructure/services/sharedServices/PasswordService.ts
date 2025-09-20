import { compare, hash } from "bcrypt";

export class PasswordService {
  async hash(password: string): Promise<string> {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    const isMatch = await compare(password, hashedPassword);
    return isMatch;
  }
}
