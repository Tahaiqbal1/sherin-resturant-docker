import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
} from "../controllers/productController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/create-product", requireSignIn, isAdmin, createProductController);
router.get("/get-products", getProductController);
router.get("/single-product/:slug", getSingleProductController);
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  updateProductController
);
router.get("/product-photo/:pid", productPhotoController);
router.delete("/delete-product/:pid", deleteProductController);

export default router;
