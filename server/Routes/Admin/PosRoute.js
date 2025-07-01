import {
  createQrcode,
  getOrderByorderId,
  getAllOrders,
  getHistoryOrderByTableNumber,
  receiveOrderAll,
  servedOrderAll,
  changeStatusOrderById,
} from "../../Controllers/Admin/PosController.js";
const PosRoute = async (fastify, options) => {
  fastify.post("/createQrcode/:tableNumber", createQrcode);
  fastify.get("/getOrder/:orderId", getOrderByorderId);
  fastify.get("/getAll-Orders", getAllOrders);
  fastify.get("/history-orders/:tableNumber", getHistoryOrderByTableNumber);
  fastify.put("/update-order/receive-order-all/:tableNumber", receiveOrderAll);
  fastify.put("/update-order/served-order-all/:tableNumber", servedOrderAll);
  fastify.patch("/update-order/:id", changeStatusOrderById);
};

export default PosRoute;
