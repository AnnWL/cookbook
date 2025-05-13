import jwt from "jsonwebtoken";

const isSignedIn = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res
      .status(401)
      .json({ status: "error", msg: "Unauthorized user, token missing" });
  }

  const token = req.headers["authorization"].replace("Bearer ", "");
  console.log("Token received:", token);

  if (token) {
    try {
      console.log(process.env.ACCESS_SECRET);
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      console.log("Decoded token:", decoded);
      req.decoded = decoded;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res
        .status(401)
        .json({ status: "error", msg: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({
      status: "error",
      msg: "Unauthorized user, token missing or invalid",
    });
  }
};

export default isSignedIn;
