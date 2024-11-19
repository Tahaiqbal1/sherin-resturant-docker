import slugify from "slugify";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";

// Ensure you have your model imported or defined

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file; // Assuming 'req.file' is provided by a middleware like 'multer'.

    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }

    if (!image) {
      return res.status(400).send({ message: "Image is required" });
    }

    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(409).send({
        message: "Category already exists",
      });
    }

    // Convert the image buffer to a base64 string
    const imageBase64 = `data:${
      image.mimetype
    };charset=utf-8;base64,${image.buffer.toString("base64")}`;

    const category = new categoryModel({
      name,
      slug: slugify(name),
      image: imageBase64, // Save the image as a base64 string
    });

    await category.save();

    res.status(201).send({
      success: true,
      message: "New Category Created",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error while creating category",
      error,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    console.log(req.body);

    const category = await categoryModel.findByIdAndUpdate(
      id,
      {
        name,
        // slug: slugify(name),
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category Updated",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

export const getCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

export const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get single category successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error,
    });
  }
};
