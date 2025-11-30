import { Router, Request } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "..", "public", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safe}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5Mb

export default function memoriesRouter(prisma: PrismaClient) {
  const r = Router();

  // GET calendar: returns days 1..N + hasMemory flag
  r.get("/calendar", async (_req, res) => {
    const DAYS = 25; // измени при необходимости
    const memories = await prisma.memory.findMany({
      where: { visible: true },
      select: { day: true }
    });
    const set = new Set(memories.map(m => m.day));
    const result = Array.from({ length: DAYS }).map((_, i) => ({
      day: i + 1,
      hasMemory: set.has(i + 1)
    }));
    res.json(result);
  });

  // GET memory by day
  r.get("/:day", async (req, res) => {
    const day = Number(req.params.day);
    if (!day || day < 1) return res.status(400).json({ error: "Invalid day" });

    const mem = await prisma.memory.findFirst({ where: { day, visible: true } });
    if (!mem) return res.status(404).json({ error: "Not found" });

    res.json({
      id: mem.id,
      day: mem.day,
      title: mem.title,
      text: mem.text,
      imagePath: mem.imagePath // относительный, фронт добавит префикс
    });
  });

  // Admin: create/update (multipart: image + fields)
  r.post("/", upload.single("image"), async (req: Request, res) => {
    try {
      const { day, title, text } = req.body;
      const dayNum = Number(day);
      if (!dayNum) return res.status(400).json({ error: "Invalid day" });

      const filename = req.file ? `/public/uploads/${req.file.filename}` : null;
      const existing = await prisma.memory.findFirst({ where: { day: dayNum } });
      if (existing) {
        const updated = await prisma.memory.update({
          where: { id: existing.id },
          data: {
            title,
            text,
            imagePath: filename ?? existing.imagePath,
            visible: true
          }
        });
        return res.json(updated);
      } else {
        const created = await prisma.memory.create({
          data: {
            day: dayNum,
            title,
            text,
            imagePath: filename,
            visible: true
          }
        });
        return res.json(created);
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "server error" });
    }
  });

  return r;
}
