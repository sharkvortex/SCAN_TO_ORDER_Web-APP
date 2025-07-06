import { verifyToken, Login } from "../../Controllers/AuthController.js";
const AuthRoute = (fastify, option) => {
  fastify.get("/verify-token", verifyToken);
  fastify.post("/auth/login", Login);
};
export default AuthRoute;
