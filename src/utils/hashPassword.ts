import crypto from "crypto-js";

export const hashPassword = (password: string) => crypto.SHA256(password).toString(crypto.enc.Hex);
