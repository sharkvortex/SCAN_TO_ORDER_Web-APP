import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const verifyToken = async (request, reply) => {
  const authHeader = request.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return reply.status(400).send({ message: "token is requre!" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return reply.status(200).send({
      tableNumber: decoded.tableNumber,
      orderId: decoded.orderId,
    });
  } catch (error) {
    return reply.status(401).send({ message: "Invalid or expired token" });
  }
};

export const Login = async (request, reply) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return reply.status(400).send({
      message: "Username and password are required!",
    });
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return reply.status(404).send({ message: "Username not found." });
  }

  // const isPasswordValid = await bcrypt.compare(password, user.password);
  // if (!isPasswordValid) {
  //   return reply.status(401).send({ message: "Incorrect password." });
  // }

  
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET, 
    {
      expiresIn: "1h",
    }
  );

 
  reply.setCookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/", 
    maxAge: 60 * 60, 
  });

 

  return reply.send({
    message: "Login successful.",
    username: user.username,
    role: user.role,
    token
  });
};
