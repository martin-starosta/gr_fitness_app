const bcrypt = require("bcrypt");

export async function checkPassword(
    plaintextPassword: string,
    hashedPassword: string
): Promise<boolean> {
    const isCorrect = await bcrypt.compare(plaintextPassword, hashedPassword);
    return isCorrect;
}

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = process.env.SALT_ROUNDS || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}
