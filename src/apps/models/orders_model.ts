import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Order } from "../interface";
import { dataBase } from "../../config/db";

class OrderModel {
    // 1. Xem danh sách đơn hàng (tất cả)
    async getAllOrders(): Promise<Order[]> {
        const [orders] = await dataBase.query<Order[] & RowDataPacket[]>(
            `SELECT * FROM orders ORDER BY id DESC`
        );
        return orders;
    }

    // 2. Xem danh sách đơn hàng theo người dùng
    async getOrdersByUserId(userId: number): Promise<Order[]> {
        const [orders] = await dataBase.query<Order[] & RowDataPacket[]>(
            `SELECT o.* 
             FROM orders o 
             JOIN order_details od ON o.order_detail_id = od.id 
             WHERE od.user_id = ? 
             ORDER BY o.id DESC`,
            [userId]
        );
        return orders;
    }

    // 3. Theo dõi đơn hàng - xem trạng thái
    async getOrderStatus(orderId: number): Promise<string | null> {
        const [orders] = await dataBase.query<Order[] & RowDataPacket[]>(
            `SELECT status FROM orders WHERE id = ?`,
            [orderId]
        );
        return orders.length > 0 ? orders[0].status : null;
    }

    // 4. Cập nhật trạng thái đơn hàng
    async updateOrderStatus(orderId: number, status: string): Promise<boolean> {
        const [result] = await dataBase.query<ResultSetHeader>(
            `UPDATE orders SET status = ? WHERE id = ?`,
            [status, orderId]
        );
        return result.affectedRows > 0;
    }
}

export const orderModel = new OrderModel();
