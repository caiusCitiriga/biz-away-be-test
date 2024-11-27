import { genSalt, hash } from 'bcrypt';

export class AuthUtils {
  static async generateSalt(): Promise<string> {
    return genSalt();
  }

  static async hashPassword(password: string, salt: string): Promise<string> {
    return hash(password, salt);
  }

  static async isValidPassword(
    password: string,
    salt: string,
    actualPassword: string,
  ): Promise<boolean> {
    try {
      const hashedPassword = await AuthUtils.hashPassword(password, salt);
      return hashedPassword === actualPassword;
    } catch (e) {
      throw e;
    }
  }
}
