import { Request, Response } from "express";
import { orderDetailService } from "../services/order_details_service";

class OrderDetailController {
    // 1. Xem chi tiết đơn hàng
    async getOrderDetail(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid order detail id" });
            }

            const detail = await orderDetailService.getDetail(id);
            if (!detail) {
                return res.status(404).json({ message: "Order detail not found" });
            }
            res.json(detail);
        } catch (error) {
            console.error("getOrderDetail error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // 2. Sửa nội dung đơn hàng
    async updateOrderDetail(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { quantity, price } = req.body;

            if (
                isNaN(id) || 
                typeof quantity !== "number" || 
                typeof price !== "number" || 
                quantity < 0 || 
                price < 0
            ) {
                return res.status(400).json({ message: "Invalid input data" });
            }

            const updated = await orderDetailService.updateDetail(id, quantity, price);

            if (!updated) {
                return res.status(404).json({ message: "Order detail not found or not updated" });
            }

            res.json({ message: "Order detail updated successfully" });
        } catch (error) {
            console.error("updateOrderDetail error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // 3. Hủy đơn hàng (xóa chi tiết)
    async deleteOrderDetail(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid order detail id" });
            }

            const deleted = await orderDetailService.deleteDetail(id);

            if (!deleted) {
                return res.status(404).json({ message: "Order detail not found or not deleted" });
            }

            res.json({ message: "Order detail deleted successfully" });
        } catch (error) {
            console.error("deleteOrderDetail error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const orderDetailController = new OrderDetailController();
