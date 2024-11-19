import mongoose from "mongoose";
import Counter from "../helpers/Counter.js";

const productSchema = new mongoose.Schema(
  {
    customId: Number,
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Pre-save hook to auto-increment the customId
productSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "product" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.customId = counter.seq;
    next();
  } else {
    next();
  }
});

export default mongoose.model("Product", productSchema);
