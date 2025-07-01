import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
export const getCategory = async (request, reply) => {
  const authHeader = request.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return reply.status(400).send({ message: "token is require" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const categories = await prisma.category.findMany();
    return reply.send(categories);
  } catch (error) {
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};
