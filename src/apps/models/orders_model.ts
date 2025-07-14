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
        const conn = await dataBase.getConnection();
        try {
            await conn.beginTransaction();

            // Insert từng order_detail
            const orderDetailIds: number[] = [];
            for (const item of items) {
                const [detailResult] = await conn.query<ResultSetHeader>(
                    `INSERT INTO order_details (user_id, quantity, price, receiver_name, receiver_phone, receiver_address, note)
                     VALUES (?, ?, ?, ?,  ?, ?, ?)`,
                    [
                        user_id,
                        item.quantity,
                        item.price,
                        // item.price * item.quantity,
                        shippingInfo.receiver_name,
                        shippingInfo.receiver_phone,
                        shippingInfo.receiver_address,
                        shippingInfo.note || ""
                    ]
                );
                orderDetailIds.push(detailResult.insertId);
            }

            // Tổng tiền
            const total_price = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

            // Insert vào orders
            const [orderResult] = await conn.query<ResultSetHeader>(
                `INSERT INTO orders (order_detail_id, status, total_price)
                 VALUES (?, ?, ?)`,
                [
                    orderDetailIds[0], // hoặc xử lý lấy id phù hợp
                    'Đang chờ xử lý',
                    total_price
                ]
            );
            const orderId = orderResult.insertId;

            await conn.commit();
            return orderId;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }

    // Lấy đơn hàng theo id (dùng cho lấy tổng tiền)
    async getOrderById(orderId: number): Promise<Order> {
        const [rows] = await dataBase.query<RowDataPacket[]>(
            "SELECT * FROM orders WHERE id = ?",
            [orderId]
        );
        return rows[0] as Order;
    }
}

export const orderModel = new OrderModel();
