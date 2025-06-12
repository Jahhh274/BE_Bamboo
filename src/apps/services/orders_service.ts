import { orderModel } from "../models/orders_model";
import { Order } from "../interface";

class OrderService {
    // Lấy tất cả đơn hàng
    async getAllOrders(): Promise<Order[]> {
        return await orderModel.getAllOrders();
    }

    // Lấy đơn hàng theo userId
    async getOrdersByUserId(userId: number): Promise<Order[]> {
        return await orderModel.getOrdersByUserId(userId);
    }

    // Lấy trạng thái đơn hàng
    async getOrderStatus(orderId: number): Promise<string | null> {
        return await orderModel.getOrderStatus(orderId);
    }

    // Cập nhật trạng thái đơn hàng
    async updateOrderStatus(orderId: number, status: string): Promise<boolean> {
        return await orderModel.updateOrderStatus(orderId, status);
    }
}

export const orderService = new OrderService();
