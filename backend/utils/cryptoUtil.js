import crypto from "crypto";

const algorithm = "aes-256-cbc";

const getKey = () => {
  const secret = process.env.CRYPTO_SECRET || "loopi_default_crypto_secret_32";
  return crypto.createHash("sha256").update(secret).digest();
};

export const encrypt = (text) => {
  if (!text || text === "********") return text;

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (encryptedText) => {
  if (!encryptedText || encryptedText === "********") return encryptedText;

  try {
    const [ivHex, encrypted] = encryptedText.split(":");

    if (!ivHex || !encrypted) return encryptedText;

    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, getKey(), iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch {
    return "";
  }
};