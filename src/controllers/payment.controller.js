//src/controllers/payment.controller.js

const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Payment, Order } = require("../models");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createRazorpayOrder = async (req, res) => {
  const { order_id } = req.body;

  const order = await Order.findByPk(order_id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const options = {
    amount: order.total_amount * 100,
    currency: "INR",
    receipt: `order_${order.id}`
  };

  const razorpayOrder = await razorpay.orders.create(options);

  await Payment.create({
    order_id: order.id,
    payment_status_id: 1, // CREATED
    razorpay_order_id: razorpayOrder.id,
    amount: order.total_amount
  });

  res.json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID
  });
};

exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment signature" });
  }

  const payment = await Payment.findOne({
    where: { razorpay_order_id }
  });

  payment.razorpay_payment_id = razorpay_payment_id;
  payment.razorpay_signature = razorpay_signature;
  payment.payment_status_id = 2; // SUCCESS
  await payment.save();

  res.json({ message: "Payment verified successfully" });
};


