import bcrypt from "bcrypt";

const SALT = 10;

export const hashPassword = async (
  password: string
): Promise<string | null> => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT);
    return hashedPassword;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const equals = await bcrypt.compare(password, hashedPassword);
    return equals;
  } catch (error) {
    console.error(error);
    return false;
  }
};
