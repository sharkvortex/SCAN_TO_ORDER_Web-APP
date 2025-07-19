import {
  verifyToken,
  Login,
  Register,
  Authentication,
  Logout,
} from "../../Controllers/AuthController.js";
const AuthRoute = (fastify, option) => {
  fastify.get("/verify-token", verifyToken);
  fastify.post("/auth/login", Login);
  fastify.post("/auth/register", Register);
  fastify.post("/auth/logout", Logout);
  fastify.get("/auth/authentication", Authentication);
};
export default AuthRoute;
