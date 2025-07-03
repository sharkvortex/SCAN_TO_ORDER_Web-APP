import Fastify from "fastify";
import cors from "@fastify/cors";
import { initSocket } from "./socket.js";
const fastify = Fastify({ logger: true });
import dotenv from 'dotenv';
dotenv.config();

await fastify.register(cors, {
  origin: ["http://localhost:5173"],
  credentials: true,
});

import CategoryRoute from "./Routes/CategoryRoute.js";
import FoodRoute from "./Routes/FoodRoute.js";
import OrderRoute from "./Routes/OrderRoute.js";
import TableRoute from "./Routes/Admin/TableRoute.js";
import AuthRoute from "./Routes/Auth/AuthRoute.js";
import PosRoute from "./Routes/Admin/PosRoute.js";
import CallEmployeeRoute from "./Routes/CallEmployeeRoute.js";
//
await fastify.register(CategoryRoute, { prefix: "/api" });
await fastify.register(FoodRoute, { prefix: "/api" });
await fastify.register(OrderRoute, { prefix: "/api" });
await fastify.register(PosRoute, { prefix: "/api" });
await fastify.register(TableRoute, { prefix: "/api" });
await fastify.register(AuthRoute, { prefix: "/api" });
await fastify.register(CallEmployeeRoute, { prefix: "/api" });

fastify.get("/", async () => ({ message: "Hello, World!" }));

fastify.listen({ port: 8080, host: "0.0.0.0" }).then(() => {
  console.log("🚀 Server running at http://localhost:8080");
  initSocket(fastify.server);
});
