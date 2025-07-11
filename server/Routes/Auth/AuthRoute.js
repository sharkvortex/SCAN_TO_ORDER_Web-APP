import {
  verifyToken,
  Login,
  Register,
  Authentication,
} from "../../Controllers/AuthController.js";
const AuthRoute = (fastify, option) => {
  fastify.get("/verify-token", verifyToken);
  fastify.post("/auth/login", Login);
  fastify.post("/auth/register", Register);
  fastify.get("/auth/authentication", Authentication);
};
export default AuthRoute;
