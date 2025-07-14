import { orderModel } from "../models/orders_model";
import { Order } from "../interface";

class OrderService {
    [x: string]: any;
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

    // Thêm mới: Tạo đơn hàng kèm items
    async createOrderWithItems(
        user_id: number,
        shippingInfo: {
            receiver_name: string;
            receiver_phone: string;
            receiver_address: string;
            note?: string;
        },
        items: {
            quantity: number;
            price: number;
        }[]
    ): Promise<number> {
        // Gọi hàm tương ứng ở orderModel (bạn cần có hàm này ở orders_model)
        return await orderModel.createOrderWithItems(user_id, shippingInfo, items);
    }
}

export const orderService = new OrderService();
