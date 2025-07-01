import {
  createOrder,
  getHistoryOrder,
} from "../Controllers/OrderController.js";

const OrderRoute = (fastify, options) => {
  fastify.post("/order", createOrder);
  fastify.get("/history-order", getHistoryOrder);
};

export default OrderRoute;
