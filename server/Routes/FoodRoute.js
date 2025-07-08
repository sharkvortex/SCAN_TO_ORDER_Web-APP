import { getFood } from "../Controllers/FoodController.js";
const FoodRoute = (fastify, options) => {
  fastify.get("/foods", getFood);
};

export default FoodRoute;
