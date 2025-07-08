import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getCategory = async (request, reply) => {
  try {
    const categories = await prisma.category.findMany();
    return reply.send(categories);
  } catch (error) {
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};
