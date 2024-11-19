import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  image: {
    type: String, // Changed from Buffer to String to store base64 data
    default: "",
    required: true,
  },
});

export default mongoose.model("Category", categorySchema);
