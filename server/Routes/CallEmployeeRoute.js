import { callEmployee } from "../Controllers/CallEmployee.js";
const CallEmployeeRoute = async (fastify, options) => {
  fastify.get("/call-Employee", callEmployee);
};

export default CallEmployeeRoute;
