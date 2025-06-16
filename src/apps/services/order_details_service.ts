import { OrderDetail } from "../interface";
import { orderDetailModel } from "../models/order_details_model";

class OrderDetailService {
    // Xem chi tiết đơn hàng
    async getDetail(id: number): Promise<OrderDetail | null> {
        return await orderDetailModel.getOrderDetailById(id);
    }

    // Sửa nội dung đơn hàng
    async updateDetail(
        id: number,
        quantity: number,
        price: number
    ): Promise<boolean> {
        const total_price = quantity * price;
        return await orderDetailModel.updateOrderDetail(id, quantity, price, total_price);
    }

    // Hủy đơn hàng (xóa chi tiết)
    async deleteDetail(id: number): Promise<boolean> {
        return await orderDetailModel.deleteOrderDetail(id);
    }
}

export const orderDetailService = new OrderDetailService();
