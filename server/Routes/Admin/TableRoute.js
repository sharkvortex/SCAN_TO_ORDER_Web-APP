import { getTable } from "../../Controllers/Admin/TableController.js";
const TableRoute = async (fastify, options) => {
  fastify.get("/table", getTable);
};

export default TableRoute;
