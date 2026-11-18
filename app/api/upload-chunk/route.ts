import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

export async function POST(req: Request) {
  try {
    const { email, fileName, uploadId, chunkIndex, chunkTotal, dataB64 } = await req.json();

    if (!email || !fileName || !uploadId || chunkIndex === undefined || !chunkTotal || !dataB64) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const safeEmail = email.replace(/[^a-zA-Z0-9@._-]/g, "_");
    const dir = path.join(UPLOAD_DIR, safeEmail, uploadId);
    await fs.mkdir(dir, { recursive: true });

    const chunkPath = path.join(dir, `chunk_${String(chunkIndex).padStart(4, "0")}`);
    const buf = Buffer.from(dataB64, "base64");
    await fs.writeFile(chunkPath, buf);

    if (chunkIndex === chunkTotal - 1) {
      const chunks: Buffer[] = [];
      for (let i = 0; i < chunkTotal; i++) {
        const p = path.join(dir, `chunk_${String(i).padStart(4, "0")}`);
        chunks.push(await fs.readFile(p));
      }
      const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
      const finalPath = path.join(UPLOAD_DIR, safeEmail, `${Date.now()}_${safeName}`);
      await fs.writeFile(finalPath, Buffer.concat(chunks));

      for (let i = 0; i < chunkTotal; i++) {
        await fs.unlink(path.join(dir, `chunk_${String(i).padStart(4, "0")}`)).catch(() => {});
      }
      await fs.rmdir(dir).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Upload-Fehler" }, { status: 500 });
  }
}
