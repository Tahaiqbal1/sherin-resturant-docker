import multer from "multer";
import clientModel from "../models/clientModel.js"; // Adjust this path as necessary
import path from "path";
import upload from "../config/multerConfig.js"


export const createClientController = async (req, res) => {
  upload.single("photo")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).send({ error: err.message });
    } else if (err) {
      return res.status(500).send({ error: err.message });
    }

    try {
      const { name, cell, email, budget, size, houseType, city, state } =
        req.body;
      const photo = req.file ? req.file.path : undefined;

      // Ensure required fields are present
      if (!name || !cell || !email || !photo) {
        return res
          .status(400)
          .send({ error: "All fields including a photo are required." });
      }

      const newClient = new clientModel({
        name,
        cell,
        email,
        photo,
        budget,
        size,
        houseType,
        city,
        state,
      });

      await newClient.save();
      res.status(201).send({
        success: true,
        message: "Client Created Successfully",
        client: newClient,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        error: error.message,
        message: "Error in creating client",
      });
    }
  });
};

export const getAllClientsController = async (req, res) => {
  try {
    const clients = await clientModel.find({});
    res.status(200).send({
      success: true,
      count: clients.length,
      clients,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in getting clients",
    });
  }
};

export const getClientController = async (req, res) => {
  try {
    const client = await clientModel.findById(req.params.id);
    if (!client) {
      return res.status(404).send({ error: "Client not found" });
    }
    res.status(200).send({
      success: true,
      client,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error while getting single client",
    });
  }
};

export const updateClientController = async (req, res) => {
  upload.single("photo")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).send({ error: err.message });
    } else if (err) {
      return res.status(500).send({ error: err.message });
    }

    try {
      const updateData = req.body;
      if (req.file) {
        updateData.photo = req.file.path;
      }

      const updatedClient = await clientModel.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      if (!updatedClient) {
        return res.status(404).send({ error: "Client not found" });
      }

      res.status(200).send({
        success: true,
        message: "Client Updated Successfully",
        client: updatedClient,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        error: error.message,
        message: "Error in updating client",
      });
    }
  });
};

export const deleteClientController = async (req, res) => {
  try {
    const deletedClient = await clientModel.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).send({ error: "Client not found" });
    }
    res.status(200).send({
      success: true,
      message: "Client Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error while deleting client",
    });
  }
};
