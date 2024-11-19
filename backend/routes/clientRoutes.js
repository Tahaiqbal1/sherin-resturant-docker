// In your clientRoutes.js
import express from "express";
import multer from "multer";
import {
  createClientController,
  getAllClientsController,
  getClientController,
  updateClientController,
  deleteClientController,
} from "../controllers/clientController.js"; // Ensure the path is correct

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/create-client", createClientController);
router.get("/get-clients", getAllClientsController);
router.get("/client/:id", getClientController);
router.put("/client/:id", updateClientController);
router.delete("/delete-client/:id", deleteClientController);

export default router;
