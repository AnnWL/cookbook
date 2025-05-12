import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, require: true },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    pantry: [foodSchema],
  },
  { collection: "users" }
);

export default mongoose.model("Users", userSchema);
