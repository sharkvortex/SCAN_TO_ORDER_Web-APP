import Qrcode from "qrcode";
import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";
import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { io } from "../../socket.js";
const jwtsecret = process.env.JWT_SECRET;
const clientUrl = process.env.CLIENT_URL;

// Create Qrcode
export const createQrcode = async (request, reply) => {
  const tableNumber = Number(request.params.tableNumber);
  const random = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

  try {
    const table = await prisma.table.findUnique({
      where: { tableNumber },
    });

    if (!table) {
      return reply.status(404).send("Table not found");
    }

    let orderId = table.orderId;
    let token = table.token;
    let createNew = false;

    if (table.status === "AVAILABLE") {
      createNew = true;
    } else if (orderId && token) {
      try {
        jwt.verify(token, jwtsecret);
      } catch {
        createNew = true;
      }

      if (!createNew) {
        const orderSession = await prisma.orderSession.findUnique({
          where: { orderId },
        });

        if (orderSession?.status === "PAID") {
          createNew = true;
        } else if (orderSession?.status !== "PENDING") {
          createNew = true;
        } else {
          token = jwt.sign({ tableNumber, orderId }, jwtsecret, {
            expiresIn: "5h",
          });

          await prisma.table.update({
            where: { tableNumber },
            data: { token },
          });

          createNew = false;
        }
      }
    } else {
      createNew = true;
    }

    if (createNew) {
      orderId = `ORD-${dayjs().format("YYMMDD")}-${random()}`;

      token = jwt.sign({ tableNumber, orderId }, jwtsecret, {
        expiresIn: "5h",
      });

      await prisma.table.update({
        where: { tableNumber },
        data: {
          token,
          orderId,
          status: "OCCUPIED",
        },
      });

      await prisma.orderSession.create({
        data: { orderId, tableNumber },
      });
    }

    const url = `${clientUrl}/?tk=${token}`;
    const qrCode = await Qrcode.toDataURL(url);
    return reply.status(200).send(qrCode);
  } catch (error) {
    console.error("Error creating QR:", error);
    return reply.status(500).send("Failed to create QR Code");
  }
};
// GetAllOrders
export const getAllOrders = async (request, reply) => {
  try {
    const orders = await prisma.orderSession.findMany({
      include: {
        orders: true,
      },
    });

    return reply.status(200).send(orders);
  } catch (error) {
    console.error(error);
    return reply.status(500).send("Failed to Get Order", error);
  }
};

// Get OrderByOrderId
export const getOrderByorderId = async (request, reply) => {
  const orderId = request.params.orderId;
  try {
    const orderData = await prisma.orderSession.findUnique({
      where: {
        orderId: orderId,
      },
      include: {
        orders: true,
      },
    });

    if (!orderData) {
      return reply.status(404).send("ไม่พบออเดอร์นี้ในระบบ");
    }
    return reply.status(200).send(orderData);
  } catch (error) {
    return reply.status(500).send("Failed to Get Order");
  }
};

// Get HistoryOrder Table
export const getHistoryOrderByTableNumber = async (request, reply) => {
  const tableNumber = Number(request.params.tableNumber);

  if (!tableNumber) {
    return reply.status(400).send({ message: "tableNumber is required!" });
  }

  try {
    const table = await prisma.table.findFirst({
      where: { tableNumber },
    });

    if (!table || !table.orderId) {
      return reply.status(200).send([]);
    }

    const history = await prisma.orderSession.findFirst({
      where: {
        orderId: table.orderId,
      },
      include: {
        orders: true,
      },
    });

    if (!history) {
      return reply.status(200).send([]);
    }

    return reply.status(200).send(history);
  } catch (error) {
    console.error("Error to get history order:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};
// Change Status OrderId
export const changeStatusOrderById = async (request, reply) => {
  const { id } = request.params;
  const { status: newStatus } = request.body;

  const orderId = Number(id);
  if (!id || !newStatus) {
    return reply
      .status(400)
      .send({ message: "id params and status is required" });
  }

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return reply.status(404).send({ message: "Order not found" });
    }

    const currentStatus = existingOrder.status;

    const validTransitions = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["SERVED", "CANCELLED"],
      SERVED: [],
      CANCELLED: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      return reply.status(400).send({
        message: `Invalid status transition from ${currentStatus} to ${newStatus}`,
      });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    return reply.status(200).send({ message: "Update status success" });
  } catch (error) {
    console.error("Error updating status:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};
// Receive Order-All Where status PENDING
export const receiveOrderAll = async (request, reply) => {
  const tableNumber = Number(request.params.tableNumber);
  if (!tableNumber) {
    return reply.status(400).send({ message: "tableNumber is require" });
  }

  try {
    const table = await prisma.table.findUnique({
      where: {
        tableNumber: tableNumber,
      },
    });
    if (!table) {
      return reply.status(404).send({ message: "tableNumber is not found" });
    }
    if (!table.orderId) {
      return reply
        .status(400)
        .send({ message: "This table has no active order." });
    }
    const session = await prisma.orderSession.findUnique({
      where: {
        orderId: table.orderId,
      },
    });
    if (!session) {
      return reply.status(404).send({ message: "essionId is not found" });
    }

    await prisma.order.updateMany({
      where: {
        orderSessionId: session.id,
        status: "PENDING",
      },
      data: {
        status: "CONFIRMED",
      },
    });

    return reply.status(200).send({ message: "Orders updated successfully" });
  } catch (error) {
    return reply.status(500).send({});
  }
};
// Served Order-All Where status PENDING
export const servedOrderAll = async (request, reply) => {
  const tableNumber = Number(request.params.tableNumber);
  if (!tableNumber) {
    return reply.status(400).send({ message: "tableNumber is require" });
  }

  try {
    const table = await prisma.table.findUnique({
      where: {
        tableNumber: tableNumber,
      },
    });
    if (!table) {
      return reply.status(404).send({ message: "tableNumber is not found" });
    }
    if (!table.orderId) {
      return reply
        .status(400)
        .send({ message: "This table has no active order." });
    }
    const session = await prisma.orderSession.findUnique({
      where: {
        orderId: table.orderId,
      },
    });
    if (!session) {
      return reply.status(404).send({ message: "essionId is not found" });
    }

    await prisma.order.updateMany({
      where: {
        orderSessionId: session.id,
        status: "CONFIRMED",
      },
      data: {
        status: "SERVED",
      },
    });

    return reply.status(200).send({ message: "Orders updated successfully" });
  } catch (error) {
    return reply.status(500).send({});
  }
};
//  Cancel Order-All where status !Served
export const cancelOrderAll = async (request, reply) => {
  const tableNumber = Number(request.params.tableNumber);
  if (!tableNumber) {
    return reply.status(400).send({ message: "tableNumber is required" });
  }

  try {
    const table = await prisma.table.findUnique({
      where: { tableNumber },
    });

    if (!table) {
      return reply.status(404).send({ message: "Table not found" });
    }

    if (!table.orderId) {
      return reply
        .status(400)
        .send({ message: "This table has no active order." });
    }

    const session = await prisma.orderSession.findUnique({
      where: { orderId: table.orderId },
    });

    if (!session) {
      return reply.status(404).send({ message: "Order session not found" });
    }

    const result = await prisma.order.updateMany({
      where: {
        orderSessionId: session.id,
        status: "PENDING",
      },
      data: {
        status: "CANCELLED",
      },
    });

    if (result.count === 0) {
      return reply
        .status(400)
        .send({ message: "ไม่มีออเดอร์ที่อยู่ในสถานะ PENDING" });
    }

    return reply.send({
      message: `ยกเลิกออเดอร์ ${result.count} รายการที่เป็น PENDING สำเร็จ`,
    });
  } catch (error) {
    console.error("Error cancelOrderAll:", error);
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// Delete Order id
export const deleteOrderId = async (request, reply) => {
  const id = Number(request.params.id);
  if (!id) {
    reply.status(400).send({
      message: "Id is require",
    });
  }

  try {
    const existOrder = await prisma.order.findUnique({
      where: { id },
    });
    if (!existOrder || existOrder.status === "SERVED") {
      reply.status(400).send({
        message: "Order not found or already served",
      });
    }

    await prisma.order.delete({
      where: { id },
    });
    io.emit("order-update");
    return reply.send(200).send({
      message: "Delete Order Success",
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};
