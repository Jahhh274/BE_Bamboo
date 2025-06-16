import { Request, Response } from "express";
import { orderService } from "../services/orders_service";

class OrderController {
    // Lấy tất cả đơn hàng
    async getAllOrders(req: Request, res: Response) {
        try {
            const orders = await orderService.getAllOrders();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Lấy đơn hàng theo userId
    async getOrdersByUserId(req: Request, res: Response) {
        try {
            const userId = Number(req.params.userId);
            const orders = await orderService.getOrdersByUserId(userId);
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Lấy trạng thái đơn hàng
    async getOrderStatus(req: Request, res: Response) {
        try {
            const orderId = Number(req.params.orderId);
            const status = await orderService.getOrderStatus(orderId);
            if (status === null) {
                return res.status(404).json({ message: "Order not found" });
            }
            res.json({ status });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Cập nhật trạng thái đơn hàng
    async updateOrderStatus(req: Request, res: Response) {
        try {
            const orderId = Number(req.params.orderId);
            const { status } = req.body;
            if (!status) {
                return res.status(400).json({ message: "Missing status field" });
            }
            const success = await orderService.updateOrderStatus(orderId, status);
            if (!success) {
                return res.status(404).json({ message: "Order not found" });
            }
            res.json({ message: "Order status updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }
}

export const orderController = new OrderController();
