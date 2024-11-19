import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import path from "path";
import authRoute from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoute.js";
import orderRoutes from "./routes/orderRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import serviceRoute from "./routes/services.js";
import clientRoutes from "./routes/clientRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

connectDB();

const app = express();


// Setup CORS to allow specific origins
app.use(cors({ origin: ["https://sh.fayazk.com", "http://localhost:3000"] }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/services", serviceRoute);
app.use("/api/v1/settings", settingRoutes);
app.use("/api/v1/clients", clientRoutes);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to Sherin Restaurant",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
