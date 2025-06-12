import express from "express";
import { orderController } from "../controllers/orders_controller";

const orderRouter = express.Router();

// Lấy tất cả đơn hàng
orderRouter.get("/orders", (req, res) => orderController.getAllOrders(req, res));

// Lấy đơn hàng theo userId
orderRouter.get("order/user/:userId", (req, res) => orderController.getOrdersByUserId(req, res));

// Lấy trạng thái đơn hàng
orderRouter.get("order/status/:orderId", (req, res) => orderController.getOrderStatus(req, res));

// Cập nhật trạng thái đơn hàng
orderRouter.put("/orders/status/:orderId", (req, res) => orderController.updateOrderStatus(req, res));

export default orderRouter;
