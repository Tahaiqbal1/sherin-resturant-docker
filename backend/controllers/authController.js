import userModel from "../models/userModel.js";
import {
  comparePassword,
  hashPassword,
  hashPassword as hashPasswordFunction,
} from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import path from "path";
import upload from "../config/multerConfig.js"


export const registerController = async (req, res) => {
  upload.single("image")(req, res, async function (err) {
    try {
      const { name, email, password, phone, address } = req.body;
      const userImage = req.file ? req.file.filename : undefined;
      console.log(req.file);
      if (!name || !email || !password || !phone || !address || !userImage) {
        return res.status(400).json({
          success: false,
          message: "All fields including a user image are required.",
        });
      }

      const existingUser = await userModel.findOne({ email }).lean().exec();
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already registered, please login.",
        });
      }

      const hashedPassword = await hashPasswordFunction(password);
      const user = new userModel({
        name,
        email,
        phone,
        address,
        password: hashedPassword,
        image: userImage,
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        userId: user._id,
        imagePath: userImage,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Error while registering user",
        error: error.message,
      });
    }
  });
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        userId: user._id, // Include userId here
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        image: user.image,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occurred while login",
      error,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is Required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New password is required" });
    }

    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }

    const hashed = await hashPasswordFunction(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: "Something went wrong",
      error,
    });
  }
};

export const testController = (req, res) => {
  try {
    res.send("Protected Route");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and 6 charater long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Update Profile",
      error,
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password");
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching users",
      error: error.message,
    });
  }
};

export const deleteUserByIdController = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await userModel.findByIdAndDelete(userId);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User successfully deleted",
      data: result,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error while deleting user",
      error: error.message,
    });
  }
};
