import orderModel from "../models/orderModel.js";

export const createOrderController = async (req, res) => {
  try {
    const newOrder = new orderModel(req.body);
    const savedOrder = await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", data: savedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.toString() });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find().populate("cartItems.product");
    res
      .status(200)
      .json({ message: "Orders fetched successfully", data: orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.toString() });
  }
};

export const getUserOrdersController = async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await orderModel
      .find({ "userDetails.userId": userId })
      .populate("cartItems.product");

    if (orders.length === 0) {
      return res.status(200).json({
        message: "No orders placed by this user",
        data: [],
      });
    }

    res.status(200).json({
      message: "Orders for the user fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders for the user",
      error: error.toString(),
    });
  }
};

export const updateOrderStatusByIdController = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!["Pending", "Processing", "Completed", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error updating order status:", error);
    res.status(500).json({
      message: "Error updating order status",
      error: error.toString(),
    });
  }
};

export const deleteOrderController = async (req, res) => {
  try {
    const order = await orderModel.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res
      .status(200)
      .json({ message: "Order deleted successfully", data: order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting order", error: error.toString() });
  }
};
