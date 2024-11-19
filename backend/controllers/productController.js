import slugify from "slugify";
import productModel from "../models/productModel.js";
import multer from "multer";
import path from "path";
import upload from "../config/multerConfig.js"

export const createProductController = async (req, res) => {
  upload.fields([{ name: "photo", maxCount: 1 }])(
    req,
    res,
    async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).send({ error: err.message });
      } else if (err) {
        return res.status(500).send({ error: err.message });
      }

      try {
        const {
          name,
          description,
          price,
          category,
          quantity,
          shipping,
          discountPrice,
        } = req.body;
        const photo = req.files["photo"]
          ? req.files["photo"][0].filename
          : undefined;

        // Validation
        if (
          !name ||
          !description ||
          !price ||
          !category ||
          !quantity ||
          !photo ||
          (discountPrice !== undefined && isNaN(Number(discountPrice)))
        ) {
          return res.status(400).send({
            error:
              "All fields including photo are required, and discountPrice must be a number if provided.",
          });
        }

        const product = new productModel({
          name,
          description,
          price,
          category,
          quantity,
          shipping,
          photo,
          discountPrice: discountPrice ? Number(discountPrice) : 0, // Use 'discountPrice' to set the 'discount'
          slug: slugify(name),
        });

        await product.save();
        res.status(201).send({
          success: true,
          message: "Product Created Successfully",
          product,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          error: error.message,
          message: "Error in creating product",
        });
      }
    }
  );
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  upload.fields([{ name: "photo", maxCount: 1 }])(
    req,
    res,
    async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).send({ error: err.message });
      } else if (err) {
        return res.status(500).send({ error: err.message });
      }

      try {
        const { name, description, price, category, quantity, discountPrice } =
          req.body;
        let updateData = {
          name,
          description,
          price,
          category,
          quantity,
          discountPrice,
          ...(name && { slug: slugify(name) }),
        };

        if (req.files && req.files.photo && req.files.photo[0]) {
          const photo = req.files.photo[0];
          updateData.photo = photo.filename;
        }

        // Validation
        if (
          !name ||
          !description ||
          !price ||
          !category ||
          !quantity ||
          !discountPrice
        ) {
          return res.status(400).send({ error: "All fields are required" });
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
          req.params.pid,
          updateData,
          { new: true }
        );

        if (!updatedProduct) {
          return res.status(404).send({ error: "Product not found" });
        }

        res.status(200).send({
          success: true,
          message: "Product Updated Successfully",
          product: updatedProduct,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({
          success: false,
          error: error.message,
          message: "Error in updating product",
        });
      }
    }
  );
};
