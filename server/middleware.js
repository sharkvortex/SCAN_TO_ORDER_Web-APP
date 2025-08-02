import jwt from "jsonwebtoken";

const AllowRoles = ["EMPLOYEE", "ADMIN", "ADMINISTRATOR"];

export const VerifyAdmin = (request, reply, next) => {
  const cookieToken = request.cookies?.token;
  const authHeader = request.headers.authorization;

  let token = cookieToken;

  if (!token && authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return reply.status(401).send({
      code: "TOKEN_NOT_FOUND",
      message: "Authentication token is required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!AllowRoles.includes(decoded.role)) {
      return reply.status(403).send({
        code: "FORBIDDEN",
        message: "You do not have permission to access this resource",
      });
    }

    request.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return reply.status(401).send({
        code: "TOKEN_EXPIRED",
        message: "Authentication token has expired. Please log in again",
      });
    } else if (error.name === "JsonWebTokenError") {
      return reply.status(401).send({
        code: "TOKEN_INVALID",
        message: "Invalid authentication token",
      });
    } else {
      return reply.status(500).send({
        code: "TOKEN_ERROR",
        message: "An error occurred with the authentication token",
      });
    }
  }
};
