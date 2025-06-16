import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Warehouse } from "../interface";
import { dataBase } from "../../config/db";



class WarehouseModel {
    // Lấy tất cả tồn kho
    async getAll(): Promise<Warehouse[]> {
        const [rows] = await dataBase.query<RowDataPacket[]>("SELECT * FROM warehouse");
        return rows as Warehouse[];
    }

    // Lấy tồn kho theo product_id
    async findByProduct(product_id: number): Promise<Warehouse | null> {
        let query = "SELECT * FROM warehouse WHERE product_id = ?";
        const params: any[] = [product_id];
        const [rows] = await dataBase.query<Warehouse[] & RowDataPacket[]>(query, params);
        return rows[0] || null;
    }

    // Cập nhật tồn kho khi nhập hàng (chỉ cho sản phẩm đã có trong bảng product)
    async updateStock(product_id: number, quantity: number, price_import: number): Promise<void> {
        // Kiểm tra sản phẩm có tồn tại trong bảng product không
        const [products] = await dataBase.query<RowDataPacket[]>("SELECT id FROM products WHERE id = ?", [product_id]);
        if (products.length === 0) {
            throw new Error("Product does not exist in products table");
        }

        const selling_price = price_import * 1.2; // Tính lại giá bán tự động
        await dataBase.query(
            `INSERT INTO warehouse (selling_price, quantity, product_id, created_at, updated_at)
             VALUES (?, ?, ?, NOW(), NOW())
             ON DUPLICATE KEY UPDATE 
                quantity = quantity + VALUES(quantity),
                selling_price = VALUES(selling_price),
                updated_at = NOW()`,
            [selling_price, quantity, product_id]
        );
    }

    // Trừ tồn kho khi xóa phiếu nhập hoặc xuất kho
    async decreaseStock(product_id: number, quantity: number): Promise<void> {
        await dataBase.query(
            `UPDATE warehouse 
             SET quantity = GREATEST(quantity - ?, 0), updated_at = NOW()
             WHERE product_id = ?`,
            [product_id, quantity]
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

    // Lấy thông tin tồn kho tổng hợp từ bảng product và import_receipt
    async getFullWarehouseInfo(): Promise<
        {
            product_id: number;
            product_name: string;
            quantity: number;
            total_imported: number;
            last_import_price: number;
            selling_price: number;
        }[]
    > {
        await dataBase.query<RowDataPacket[]>(`
            INSERT INTO warehouse (product_id, quantity, selling_price, created_at, updated_at)
            SELECT 
                p.id,
                COALESCE((
                    SELECT SUM(quantity) FROM import_receipts 
                    WHERE product_id = p.id
                ), 0) AS quantity,
                COALESCE((
                    SELECT price_import * 1.2 FROM import_receipts 
                    WHERE product_id = p.id 
                    ORDER BY import_date DESC LIMIT 1
                ), 0) AS selling_price,
                NOW(), NOW()
            FROM products p
            WHERE p.id NOT IN (SELECT product_id FROM warehouse)
        `);

        const [rows] = await dataBase.query<RowDataPacket[]>(
            `SELECT 
                p.id AS product_id,
                p.name AS product_name,
                COALESCE(w.quantity, 0) AS quantity,
                COALESCE(SUM(ir.quantity), 0) AS total_imported,
                COALESCE((
                    SELECT price_import FROM import_receipts 
                    WHERE product_id = p.id 
                    ORDER BY import_date DESC LIMIT 1
                ), 0) AS last_import_price,
                COALESCE((SELECT price_import * 1.2 FROM import_receipts                      
                WHERE product_id = p.id                      
                ORDER BY import_date DESC LIMIT 1                 
                ), 0) AS selling_price             
                FROM products p             
                LEFT JOIN warehouse w ON p.id = w.product_id             
                LEFT JOIN import_receipts ir ON p.id = ir.product_id             
                GROUP BY p.id, p.name, w.quantity 
            `
        );
        return rows as {
            product_id: number;
            product_name: string;
            quantity: number;
            total_imported: number;
            last_import_price: number;
            selling_price: number;
        }[];
    }
}

export const warehouseModel = new WarehouseModel();
