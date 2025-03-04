import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
  try {
    const { items, amount, address, discount, delivery_fee, note, promoCode } =
      req.body;
    const userId = req.user.id;
    const orderData = {
      userId,
      items,
      address,
      amount,
      discount: discount || 0,
      delivery_fee: delivery_fee || 0,
      paymentMethod: "COD",
      payment: false,
      note: note || "",
      promoCode: promoCode || null,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    return res
      .status(200)
      .json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const placeOrderStripe = async (req, res) => {};

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ createdAt: -1 });
    if (!orders) {
      return res
        .status(404)
        .json({ success: false, message: "Orders not found" });
    }
    if (orders.length === 0) {
      return res.status(200).json({
        success: true,
        orders: [],
        message: "There is no orders to show",
      });
    }
    return res
      .status(200)
      .json({ success: true, orders, count: orders.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderModel.find({
      userId,
      status: { $ne: "Cancelled" },
    });
    if (!orders) {
      return res
        .status(404)
        .json({ success: false, message: "Orders not found" });
    }
    if (orders.length === 0) {
      return res.status(200).json({
        success: true,
        orders: [],
        message: "Create your first order to track it",
      });
    }
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    return res
      .status(200)
      .json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const reviewDeliveredOrder = async (req, res) => {
  try {
    const { orderId, rating, comment, userName, phone } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    order.review = { rating, comment, userName, date: Date.now(), phone };
    await order.save();
    return res
      .status(200)
      .json({ success: true, message: "Order reviewed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getOrdersReviews = async (req, res) => {
  try {
    const ordersReviews = await orderModel
      .find({
        "review.rating": { $exists: true },
      })
      .select("userId review")
      .populate("userId", "name");
    return res.status(200).json({
      success: true,
      ordersReviews,
      message: "Done",
      count: ordersReviews.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAllOrdersReviews = async (req, res) => {
  try {
    await orderModel.updateMany({}, { $set: { review: [] } });
    return res
      .status(200)
      .json({ success: true, message: "All reviews deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  const userId = req.user.id;
  const { orderId, cancelNote } = req.body;
  try {
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (order.userId !== userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (order.status === "Out for delivery" || order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this time",
      });
    }
    order.status = "Cancelled";
    order.orderCancelNote = cancelNote || "";
    await order.save();
    return res
      .status(200)
      .json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  reviewDeliveredOrder,
  getOrdersReviews,
  deleteAllOrdersReviews,
  getOrderById,
  cancelOrder,
};
