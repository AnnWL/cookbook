import { validationResult } from "express-validator";
import UsersModel from "../models/Users.js";
import { v4 as uuidv4 } from "uuid";

export const getAllFoods = async (req, res) => {
  try {
    console.log(req.decoded);
    const userId = req.decoded.userId;
    const user = await UsersModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        msg: "User not found",
      });
    }

    res.status(200).json({
      status: "ok",
      msg: "Listing all foods in the pantry",
      foods: user.foods,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      msg: "Error retrieving foods from pantry",
    });
  }
};

export const getFoodbyId = async (req, res) => {
  try {
    const userId = req.decoded.userId;
    const itemId = req.params.itemId;

    const user = await UsersModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", msg: `User ${userId} not found` });
    }
    const food = user.foods.id(itemId);

    if (!food) {
      return res.status(404).json({
        status: "error",
        msg: `Food item not found for user ${userId}`,
      });
    }

    res.status(200).json({
      status: "ok",
      msg: `Food item ${itemId} retrieved for user ${userId}`,
      food,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      status: "error",
      msg: `Error getting specified food for user ${userId}`,
    });
  }
};

export const addNewFood = async (req, res) => {
  try {
    const userId = req.decoded.userId;
    const user = await UsersModel.findById(userId);

    if (!user) {
      return res.status(404).json({ status: "error", msg: "User not found" });
    }

    const newFood = req.body;
    user.foods.push(newFood);
    await user.save();

    res.status(200).json({
      status: "ok",
      msg: `Food saved into user ${userId}'s pantry`,
      food: newFood,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      status: "error",
      msg: `Error creating new food for user ${userId}`,
    });
  }
};

export const deleteFoodbyId = async (req, res) => {
  try {
    const userId = req.decoded.userId;
    const itemId = req.params.itemId;

    const user = await UsersModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        msg: "User not found",
      });
    }

    const foodItem = user.foods.id(itemId);

    if (!foodItem) {
      return res.status(404).json({
        status: "error",
        msg: `Food item not found for user ${userId}`,
      });
    }

    foodItem.remove();
    await user.save();

    res.status(200).json({
      status: "ok",
      msg: "Food item deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      msg: "Error deleting food item from pantry",
    });
  }
};

export const updateFoodbyId = async (req, res) => {
  try {
    const userId = req.decoded.userId;
    const itemId = req.params.itemId;

    const user = await UsersModel.findById(userId);

    if (!user) {
      return res.status(404).json({ status: "error", msg: "User not found" });
    }

    const food = user.foods.id(itemId);
    if (!food) {
      return res
        .status(404)
        .json({ status: "error", msg: "Food item not found" });
    }

    if ("foodName" in req.body) food.name = req.body.foodName;
    await user.save();

    res.status(200).json({ status: "ok", msg: "Food item updated", food });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error updating food item" });
  }
};
