import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ImportReceipt } from "../interface";
import { dataBase } from "../../config/db";
// import { warehouseModel } from "./warehouses_model";

class ImportReceiptsModel {
    async getAllReceipts(): Promise<ImportReceipt[]> {
        const [receipts] = await dataBase.query<ImportReceipt[] & RowDataPacket[]>(
            'SELECT * FROM import_receipts'
        );
        return receipts;
    }

    async createReceipt(newReceipt: Partial<ImportReceipt>): Promise<ImportReceipt> {
        let {
            product_id,
            price_import,
            quantity,
            import_date,
            supplier_id,
        } = newReceipt;

        if (!product_id || !price_import || !quantity || !supplier_id) {
            throw new Error("Thiếu thông tin bắt buộc để tạo đơn nhập hàng.");
        }

        const quantityNum = Number(quantity);
        const priceImportNum = Number(price_import);

        let formattedDate: string | null = null;
        if (import_date) {
            const date = new Date(import_date);
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                formattedDate = `${year}-${month}-${day}`;
            }
        }

        const [result] = await dataBase.query<ResultSetHeader>(
            `INSERT INTO import_receipts 
            (product_id, price_import, quantity, import_date, supplier_id, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [product_id, priceImportNum, quantityNum, formattedDate, supplier_id]
        );

        const insertId = result.insertId;


        const [warehouseRows] = await dataBase.query<RowDataPacket[]>(
            'SELECT * FROM warehouse WHERE product_id = ?',
            [product_id]
        );

        const newSellingPrice = parseFloat((priceImportNum * 1.2).toFixed(2));

        if (warehouseRows.length > 0) {
            const existing = warehouseRows[0];
            const newQuantity = existing.quantity + quantityNum;

            await dataBase.query(
                `UPDATE warehouse 
             SET quantity = ?, selling_price = ?, updated_at = NOW() 
             WHERE product_id = ?`,
                [newQuantity, newSellingPrice, product_id]
            );
        } else {
            await dataBase.query(
                `INSERT INTO warehouse (product_id, quantity, selling_price, created_at, updated_at)
             VALUES (?, ?, ?, NOW(), NOW())`,
                [product_id, quantityNum, newSellingPrice]
            );
        }


        const [rows] = await dataBase.query<RowDataPacket[]>(
            'SELECT * FROM import_receipts WHERE id = ?',
            [insertId]
        );

        return rows[0] as ImportReceipt;
    }

    async updateReceipt(id: number, updatedFields: Partial<ImportReceipt>): Promise<boolean> {
        const fields = Object.keys(updatedFields).map(field => `${field} = ?`).join(', ');
        const values = Object.values(updatedFields);
        values.push(id);

        const [result] = await dataBase.query(
            `UPDATE import_receipts SET ${fields} WHERE id = ?`,
            values
        );

        return (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0;
    }

    async deleteReceipt(id: number): Promise<boolean> {
        const [result] = await dataBase.query<ResultSetHeader>(
            'DELETE FROM import_receipts WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    async findById(id: number): Promise<ImportReceipt | null> {
        const [receipts] = await dataBase.query<ImportReceipt[] & RowDataPacket[]>(
            'SELECT * FROM import_receipts WHERE id = ?',
            [id]
        );
        return receipts[0] || null;
    }

    async searchReceiptsByDate(from: string, to: string): Promise<ImportReceipt[]> {
        const [receipts] = await dataBase.query<ImportReceipt[] & RowDataPacket[]>(
            `SELECT * FROM import_receipts
             WHERE import_date BETWEEN ? AND ?`,
            [from, to]
        );
        return receipts;
    }
}

export const importReceiptsModel = new ImportReceiptsModel();
