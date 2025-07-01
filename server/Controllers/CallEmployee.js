import jwt from "jsonwebtoken";
import { io } from "../socket.js";

export const callEmployee = async (request, reply) => {
  const authHeader = request.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return reply.status(400).send({
      message: "token is require",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tableNumber = decoded.tableNumber;

    io.emit("callEmploy-notify", tableNumber);
    return reply.send({ message: "Employee called", tableNumber });
  } catch (error) {
    return reply.send(error);
  }
};
