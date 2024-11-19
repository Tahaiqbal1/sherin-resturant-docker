import Settings from "../models/settingModel.js";

export const SettingsController = {
  creatediscount: async (req, res) => {
    const { orderDiscount } = req.body;

    try {
      const settings = await Settings.findOneAndUpdate(
        {},
        { orderDiscount: orderDiscount },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      res.status(200).json({
        success: true,
        message: "Order discount updated successfully",
        data: settings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update order discount",
        error: error.message,
      });
    }
  },

  getOrderDiscount: async (req, res) => {
    try {
      const settings = await Settings.findOne();

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Settings not found",
        });
      }

      const orderDiscount = settings.orderDiscount;

      res.status(200).json({
        success: true,
        message: "Order discount retrieved successfully",
        data: { orderDiscount },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve order discount",
        error: error.message,
      });
    }
  },

  createGST: async (req, res) => {
    const { gst } = req.body;

    try {
      const settings = await Settings.findOneAndUpdate(
        {},
        { gst: gst },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      res.status(200).json({
        success: true,
        message: "GST updated successfully",
        data: settings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update GST",
        error: error.message,
      });
    }
  },

  getGST: async (req, res) => {
    try {
      const settings = await Settings.findOne();

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Settings not found",
        });
      }

      const gst = settings.gst;

      res.status(200).json({
        success: true,
        message: "GST retrieved successfully",
        data: { gst },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve GST",
        error: error.message,
      });
    }
  },

  createDeliveryCharges: async (req, res) => {
    const { deliveryCharges } = req.body;

    try {
      const settings = await Settings.findOneAndUpdate(
        {},
        { deliveryCharges: deliveryCharges },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      res.status(200).json({
        success: true,
        message: "Delivery charges updated successfully",
        data: settings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update delivery charges",
        error: error.message,
      });
    }
  },

  getDeliveryCharges: async (req, res) => {
    try {
      const settings = await Settings.findOne();

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Settings not found",
        });
      }

      const deliveryCharges = settings.deliveryCharges;

      res.status(200).json({
        success: true,
        message: "Delivery charges retrieved successfully",
        data: { deliveryCharges },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve delivery charges",
        error: error.message,
      });
    }
  },
};
