import { getFood } from "../Controllers/FoodController.js";
const FoodRoute = (fastify, options) => {
  fastify.get("/food", getFood);
};

export default FoodRoute;
