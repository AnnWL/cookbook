import express from "express";

import {
  addNewFood,
  deleteFoodbyId,
  getAllFoods,
  getFoodbyId,
  updateFoodbyId,
} from "../controllers/foods.js";

const router = express.Router();

router.get("/", getAllFoods);
router.post("/", addNewFood);
router.get("/:itemId", getFoodbyId);
router.put("/:itemId", updateFoodbyId);
router.delete("/:itemId", deleteFoodbyId);

export default router;
