import { ResultSetHeader, RowDataPacket } from "mysql2";
import { OrderDetail } from "../interface";
import { dataBase } from "../../config/db";


class OrderDetailModel {
    // 1. Xem chi tiết đơn hàng
    async getOrderDetailById(id: number): Promise<OrderDetail | null> {
        const [rows] = await dataBase.query<OrderDetail[] & RowDataPacket[]>(
            `SELECT * FROM order_details WHERE id = ?`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    // 2. Sửa nội dung đơn hàng
    async updateOrderDetail(
        id: number,
        quantity: number,
        price: number,
        total_price: number
    ): Promise<boolean> {
        const [result] = await dataBase.query<ResultSetHeader>(
            `UPDATE order_details 
             SET quantity = ?, price = ?, total_price = ?
             WHERE id = ?`,
            [quantity, price, total_price, id]
        );
        return result.affectedRows > 0;
    }

    // 3. Hủy đơn hàng (xóa chi tiết)
    async deleteOrderDetail(id: number): Promise<boolean> {
        const [result] = await dataBase.query<ResultSetHeader>(
            `DELETE FROM order_details WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }
}

export const orderDetailModel = new OrderDetailModel();
