import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { apiRouter } from "./routes";
dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT ?? 4000);
app.use(cors({
    origin: process.env.FRONTEND_URL ?? "*"
}));
app.use(express.json());
// Static uploads (images)
app.use("/public", express.static(path.join(__dirname, "..", "public")));
app.use("/api", apiRouter(prisma));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.listen(PORT, () => {
    console.log(`API listening on ${PORT}`);
});
