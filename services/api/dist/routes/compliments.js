import { Router } from "express";
export default function complimentsRouter(prisma) {
    const r = Router();
    r.get("/", async (_req, res) => {
        const all = await prisma.compliment.findMany();
        if (all.length === 0)
            return res.json({ text: "Ты прекрасна" });
        const idx = Math.floor(Math.random() * all.length);
        res.json({ text: all[idx].text });
    });
    return r;
}
