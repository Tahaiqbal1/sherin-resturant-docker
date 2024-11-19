import express from "express";
import { SettingsController } from "../controllers/settingsController.js";

const router = express.Router();

router.post("/create-discount", SettingsController.creatediscount);
router.get("/order-discount", SettingsController.getOrderDiscount);
router.post("/create-gst", SettingsController.createGST);
router.get("/get-gst", SettingsController.getGST);
router.post("/create-delivery", SettingsController.createDeliveryCharges);
router.get("/get-delivery", SettingsController.getDeliveryCharges);

export default router;
