import express from "express";
import { getAllUsers, getUserById, seedUsers } from "../controllers/users.js";

const router = express.Router();

router.get("/seed", seedUsers);
router.get("/", getAllUsers);
router.get("/:userId", getUserById);

export default router;
