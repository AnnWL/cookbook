import dotenv from "dotenv";
dotenv.config();
import express from "express";

import authRouter from "./src/routers/auth.js";
import usersRouter from "./src/routers/users.js";
import foodsRouter from "./src/routers/foods.js";
import isSignedIn from "./src/middleware/is-signed-in.js";

import connectDB from "./src/db/db.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

connectDB();
const app = express();
app.use(cors());
app.use(helmet());
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/users/foods", isSignedIn, foodsRouter);
app.use("/users", usersRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ status: "error", msg: "Invalid JSON" });
  }
  res.status(err.status || 500).json({
    status: "error",
    msg: err.message || "An unexpected error occurred",
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;
