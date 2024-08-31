import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;
if (prisma == null)
  prisma = new PrismaClient();

export default prisma;
