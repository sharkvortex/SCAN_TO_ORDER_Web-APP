import {
  verifyToken,
  Login,
  Register,
} from "../../Controllers/AuthController.js";
const AuthRoute = (fastify, option) => {
  fastify.get("/verify-token", verifyToken);
  fastify.post("/auth/login", Login);
  fastify.post("/auth/register", Register);
};
export default AuthRoute;
