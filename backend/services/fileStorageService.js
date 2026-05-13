import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.resolve(__dirname, "../uploads");

const s3Enabled =
  Boolean(process.env.AWS_S3_BUCKET) &&
  Boolean(process.env.AWS_REGION) &&
  Boolean(process.env.AWS_ACCESS_KEY_ID) &&
  Boolean(process.env.AWS_SECRET_ACCESS_KEY);

const s3Client = s3Enabled
  ? new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

function safeName(name = "upload") {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function saveUploadedFile(file, folder = "documents") {
  if (!file) return null;

  const key = `${folder}/${Date.now()}-${crypto.randomBytes(6).toString("hex")}-${safeName(file.originalname)}`;

  if (s3Client) {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    const publicBase =
      process.env.AWS_S3_PUBLIC_URL ||
      `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`;

    return {
      key,
      url: `${publicBase}/${key}`,
      provider: "s3",
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  const target = path.join(uploadsRoot, key);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, file.buffer);

  return {
    key,
    url: `/uploads/${key.replace(/\\/g, "/")}`,
    provider: "local",
    fileName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
}
