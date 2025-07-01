import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
export const createOrder = async (request, reply) => {
  const { order } = request.body;
  const authHeader = request.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return reply.status(400).send({ message: "token is requre!" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const orderId = decode.orderId;

    const orderSession = await prisma.orderSession.findUnique({
      where: { orderId },
    });

    const orderSessionId = orderSession.id;

    const orderResults = [];

    for (const item of order) {
      const food = await prisma.food.findUnique({
        where: { id: item.id },
      });

      if (!food) {
        throw new Error(`Food with id ${item.id} not found`);
      }

      const existingOrder = await prisma.order.findFirst({
        where: {
          orderSessionId,
          foodId: item.id,
          note: null,
          status: "PENDING",
        },
      });

      if (existingOrder && !item.note) {
        const updated = await prisma.order.update({
          where: { id: existingOrder.id },
          data: {
            quantity: existingOrder.quantity + item.quantity,
          },
        });
        orderResults.push(updated);
      } else {
        const created = await prisma.order.create({
          data: {
            orderSessionId,
            foodId: item.id,
            foodName: food.name,
            foodPrice: food.price,
            quantity: item.quantity,
            note: item.note || null,
          },
        });
        orderResults.push(created);
      }
    }

    reply.status(200).send({
      message: "Order created successfully",
      data: orderResults,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
};

// getOrder by Token or OrderId
export const getHistoryOrder = async (request, reply) => {
  const { token, orderId } = request.query;

  if (!token && !orderId) {
    return reply.status(400).send({ error: "Token or OrderId is required" });
  }

  let resolvedOrderId;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      resolvedOrderId = decoded.orderId;
    } catch (err) {
      return reply.status(401).send({ error: "Invalid token" });
    }
  }

  resolvedOrderId = resolvedOrderId || orderId;

  try {
    const hisOrder = await prisma.orderSession.findUnique({
      where: { orderId: resolvedOrderId },
      include: { orders: true },
    });

    if (!hisOrder) {
      return reply.status(404).send({ error: "Order not found" });
    }

    return reply.send(hisOrder);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Internal server error" });
  }
};
