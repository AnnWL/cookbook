import UsersModel from "../models/Users.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export const seedUsers = async (req, res) => {
  try {
    await UsersModel.deleteMany({});

    const password1 = await bcrypt.hash("password123", 12);
    const password2 = await bcrypt.hash("password456", 12);

    await UsersModel.create([
      {
        username: "Ann",
        email: "ann@example.com",
        password: password1,
        foods: [{ name: "Apple" }, { name: "Milk" }],
      },
      {
        username: "Ben",
        email: "ben@example.com",
        password: password2,
        foods: [{ name: "Bread" }],
      },
    ]);

    res.json({ status: "ok", msg: "Seed data saved." });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Seeding error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await UsersModel.find();
    res.status(200).json({ status: "ok", msg: "listing all users" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error getting all users" });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UsersModel.findById(userId, "username foods");

    if (!user) {
      return res.status(404).json({
        status: "error",
        msg: `User with ID ${userId} not found`,
      });
    }

    res.status(200).json({
      status: "ok",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({
      status: "error",
      msg: "Unable to retrieve user pantry",
    });
  }
};
