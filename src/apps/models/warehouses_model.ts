import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Warehouse } from "../interface";
import { dataBase } from "../../config/db";



class WarehouseModel {
    // Lấy tất cả tồn kho
    async getAll(): Promise<Warehouse[]> {
        const [rows] = await dataBase.query<Warehouse[] & RowDataPacket[]>(
            "SELECT * FROM warehouse"
        );
        return rows;
    }

    // Lấy tồn kho theo product_id (và size nếu có)
    async findByProduct(product_id: number, size?: string): Promise<Warehouse | null> {
        let query = "SELECT * FROM warehouse WHERE product_id = ?";
        const params: any[] = [product_id];
        if (size) {
            query += " AND size = ?";
            params.push(size);
        }
        const [rows] = await dataBase.query<Warehouse[] & RowDataPacket[]>(query, params);
        return rows[0] || null;
    }

    // Cập nhật tồn kho khi nhập hàng (hoặc khi cập nhật phiếu nhập)
    // Tính lại giá bán: selling_price = price_import * 1.3
    async updateStock(product_id: number, size: string, quantity: number, price_import: number): Promise<void> {
        const selling_price = price_import * 1.2; // Tính lại giá bán tự động
        await dataBase.query(
            `INSERT INTO warehouse (product_id, size, quantity, selling_price, created_at, updated_at)
             VALUES (?, ?, ?, ?, NOW(), NOW())
             ON DUPLICATE KEY UPDATE 
                quantity = quantity + VALUES(quantity),
                selling_price = VALUES(selling_price),
                updated_at = NOW()`,
            [product_id, size, quantity, selling_price]
        );
    }

    // Trừ tồn kho khi xóa phiếu nhập hoặc xuất kho
    async decreaseStock(product_id: number, size: string, quantity: number): Promise<void> {
        await dataBase.query(
            `UPDATE warehouse 
             SET quantity = GREATEST(quantity - ?, 0), updated_at = NOW()
             WHERE product_id = ? AND size = ?`,
            [quantity, product_id, size]
        );
    }

    // Xóa tồn kho theo id
    async deleteById(id: number): Promise<boolean> {
        const [result] = await dataBase.query<ResultSetHeader>(
            "DELETE FROM warehouse WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    }
}

export const warehouseModel = new WarehouseModel();
