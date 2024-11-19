// models/Settings.js
import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  gst: {
    type: Number,
    required: true,
  },
  orderDiscount: {
    type: Number,
    default: 0,
    required: true,
  },
  deliveryCharges: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
