import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
export const getFood = async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return reply
      .status(401)
      .send({ message: "Authorization header is required" });
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return reply.status(401).send({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const food = await prisma.food.findMany({
      include: {
        category: true,
      },
      orderBy: {
        category: {
          id: "asc",
        },
      },
    });

    return reply.send(food);
  } catch (error) {
    console.error("Error verifying token or fetching food:", error);
    return reply.status(401).send({ message: "Invalid or expired token" });
  }
};

export const getFoodById = async (request, reply) => {
  const { id } = request.params;
  try {
    const food = await prisma.food.findUnique({
      where: { id: parseInt(id) },
    });
    if (!food) {
      return reply.status(404).send({ message: "Food not found" });
    }
    return reply.send(food);
  } catch (error) {
    console.error("Error fetching food by ID:", error);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};
