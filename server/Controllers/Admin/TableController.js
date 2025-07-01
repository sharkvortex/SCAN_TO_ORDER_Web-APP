import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const getTable = async (request, reply) => {
  try {
    const tables = await prisma.table.findMany({
      orderBy: {
        tableNumber: "asc",
      },
    });
    return reply.status(200).send(tables);
  } catch (error) {
    console.error("❌ Error getting tables:", error);
    return reply.status(500).send({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลโต๊ะ",
      error: error.message || error,
    });
  }
};
