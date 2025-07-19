import {
  createQrcode,
  getOrderByorderId,
  getAllOrders,
  getHistoryOrderByTableNumber,
  receiveOrderAll,
  servedOrderAll,
  changeStatusOrderById,
  deleteOrderId,
  cancelOrderAll,
  addOrderbyTableNumber,
  reserveTable,
} from "../../Controllers/Admin/PosController.js";
import { VerifyAdmin } from "../../middleware.js";
const PosRoute = async (fastify, options) => {
  fastify.post(
    "/createQrcode/:tableNumber",
    { preHandler: VerifyAdmin },
    createQrcode
  );
  fastify.get("/getOrder/:orderId", getOrderByorderId);
  fastify.get("/getAll-Orders", getAllOrders);
  fastify.get("/history-orders/:tableNumber", getHistoryOrderByTableNumber);
  fastify.put("/update-order/receive-order-all/:tableNumber", receiveOrderAll);
  fastify.put("/update-order/served-order-all/:tableNumber", servedOrderAll);
  fastify.patch("/update-order/cancel-order-all/:tableNumber", cancelOrderAll);
  fastify.patch("/update-order/:id", changeStatusOrderById);
  fastify.delete("/delete-orderId/:id", deleteOrderId);
  fastify.post("/add-order", addOrderbyTableNumber);
  fastify.patch("/reserve", reserveTable);
};

export default PosRoute;
