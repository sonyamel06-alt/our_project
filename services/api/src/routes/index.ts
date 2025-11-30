import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import memoriesRouter from "./memories";
import complimentsRouter from "./compliments";

export const apiRouter = (prisma: PrismaClient) => {
  const r = Router();
  r.use("/memories", memoriesRouter(prisma));
  r.use("/compliment", complimentsRouter(prisma));
  return r;
};
