import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// For Customer
export const verifyToken = async (request, reply) => {
  const authHeader = request.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return reply.status(400).send({ message: "token is requre!" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return reply.status(200).send({
      tableNumber: decoded.tableNumber,
      orderId: decoded.orderId,
    });
  } catch (error) {
    return reply.status(401).send({ message: "Invalid or expired token" });
  }
};

// Registration
export const Register = async (request, reply) => {
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "username",
    "password",
  ];

  const body = request.body || {};

  const missingFields = requiredFields.filter(
    (field) => !body[field] || body[field].toString().trim() === ""
  );

  if (missingFields.length > 0) {
    return reply.status(400).send({
      message: `${missingFields.join(", ")} ${missingFields.length === 1 ? "is" : "are"} required`,
    });
  }

  const { firstName, lastName, email, username, password } = body;

  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();
  const trimmedUsername = username.trim().toLowerCase();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  if (trimmedFirstName.length < 3 || trimmedLastName.length < 3) {
    return reply.status(400).send({
      message: "firstName and lastName must be at least 3 characters long",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return reply.status(400).send({
      message: "email format is invalid",
    });
  }

  if (trimmedEmail.startsWith("admin")) {
    return reply.status(400).send({
      message: "email cannot start with 'admin'",
    });
  }

  if (trimmedUsername.length < 5) {
    return reply.status(400).send({
      message: "username must be at least 5 characters long",
    });
  }

  if (trimmedUsername.startsWith("admin")) {
    return reply.status(400).send({
      message: "username cannot start with 'admin'",
    });
  }

  const forbiddenUsernames = ["admin", "root", "system", "support", "staff"];
  if (forbiddenUsernames.includes(trimmedUsername)) {
    return reply.status(400).send({
      message: "username is not allowed",
    });
  }

  if (trimmedPassword.length < 6) {
    return reply.status(400).send({
      message: "password must be at least 6 characters long",
    });
  }

  const weakPasswords = ["123456", "password", "qwerty", "admin", "abc123"];
  if (weakPasswords.includes(trimmedPassword.toLowerCase())) {
    return reply.status(400).send({
      message: "password is too weak",
    });
  }

  try {
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingUserByEmail) {
      return reply.status(400).send({
        message: "Email is already in use",
      });
    }
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });
    if (existingUserByUsername) {
      return reply.status(400).send({
        message: "Username is already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashedPassword,
      },
    });

    return reply.status(201).send({
      message: "User registered successfully",
      username: newUser.username,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};
// Login
export const Login = async (request, reply) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return reply.status(400).send({
      message: "username and password are required!",
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username.toLowerCase() },
          { email: username.toLowerCase() },
        ],
      },
    });

    if (!user) {
      return reply.status(404).send({
        code: "USER_NOT_FOUND",
        message: "Invalid username or email",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({
        code: "INVALID_PASSWORD",
        message: "Invalid password.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    reply.setCookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return reply.send({
      message: "Login successful.",
      username: user.username,
      role: user.role,
      token,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};
// Logout
export const Logout = async (request, reply) => {
  try {
    reply.clearCookie("token", {
      path: "/",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return reply.send({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return reply.status(500).send({ error: "Logout failed" });
  }
};
// Authentication User
export const Authentication = (request, reply) => {
  const token = request.cookies.token;

  if (!token) {
    return reply.status(401).send({
      code: "TOKEN_NOT_FOUND",
      message: "Token not provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return reply.status(200).send({
      code: "AUTH_SUCCESS",
      user: {
        id: decoded.id,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
      },
    });
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
        code: "SERVER_ERROR",
        message: "Internal server error. Please try again later.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
};
