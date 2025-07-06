import jwt from "jsonwebtoken";
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

export const Login = async (request, reply) => {
  const { username, password } = request.body;

  return reply.send(formData);
};
