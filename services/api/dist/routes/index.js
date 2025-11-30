import { Router } from "express";
import memoriesRouter from "./memories";
import complimentsRouter from "./compliments";
export const apiRouter = (prisma) => {
    const r = Router();
    r.use("/memories", memoriesRouter(prisma));
    r.use("/compliment", complimentsRouter(prisma));
    return r;
};
