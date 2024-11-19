import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Assumes Bearer token
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res
          .status(401)
          .send({ success: false, message: "Invalid Token" });
      }
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).send({
      success: false,
      message: "Authorization token must be provided",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user && user.role === 1) {
      next();
    } else {
      res
        .status(403)
        .send({ success: false, message: "Admin access required" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Server Error", error });
  }
};
