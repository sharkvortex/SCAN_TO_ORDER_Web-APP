import { getCategory } from "../Controllers/CategoryController.js";
const CategoryRoute = async (fastify, options) => {
  fastify.get("/category", getCategory);
};

export default CategoryRoute;
