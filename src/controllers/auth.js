import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import UsersModel from "../models/Users.js";

export const register = async (req, res) => {
  try {
    const auth = await UsersModel.findOne({ username: req.body.username });

    if (auth) {
      return res
        .status(400)
        .json({ status: "error", msg: "duplicate username" });
    }

    const hash = await bcrypt.hash(req.body.password, 12);

    await UsersModel.create({
      username: req.body.username,
      password: hash,
    });
    res.json({ status: "ok", msg: "auth created" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "invalid registration" });
  }
};

export const login = async (req, res) => {
  try {
    console.log("Request body:", req.body.username);
    const auth = await UsersModel.findOne({
      username: req.body.username.trim(),
    });
    console.log("Database result:", auth);

    if (!auth) {
      console.error(`User not found: ${req.body.username}`);
      return res.status(400).json({ status: "error", msg: "not authorised" });
    }

    if (!req.body.password) {
      console.error("Password not provided in request");
      return res
        .status(400)
        .json({ status: "error", msg: "Password is required" });
    }

    const result = await bcrypt.compare(req.body.password, auth.password);

    if (!result) {
      console.error("username or password error");
      return res.status(400).json({ status: "error", msg: "login failed" });
    }

    const claims = { username: auth.username };
    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });
    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });

    res.json({ access, refresh });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(400).json({ status: "error", msg: "login failed" });
  }
};

export const refresh = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);

    const claims = { username: decoded.username };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });
    res.json({ access });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "refreshing token error" });
  }
};
