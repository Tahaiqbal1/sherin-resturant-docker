import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    cell: {
      type: String,
      required: [true, "Cell number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    photo: {
      type: String,
      required: [true, "Photo is required"],
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
    },
    size: {
      type: String,
      required: [true, "Size of the house is required"],
    },
    houseType: {
      type: String,
      required: [true, "House type is required"],
      enum: ["Bungalow", "Villa", "Farmhouse"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Client = mongoose.model("Client", clientSchema);

export default Client;
