import { verifyToken } from "../../Controllers/AuthController.js";
const AuthRoute = (fastify, option) => {
  fastify.get("/verify-token", verifyToken);
};
export default AuthRoute;
