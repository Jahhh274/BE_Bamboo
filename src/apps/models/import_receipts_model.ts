import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ImportReceipt } from "../interface";
import { dataBase } from "../../config/db";

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

        // Parse and reformat import_date to YYYY-MM-DD
        if (import_date) {
            const date = new Date(import_date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            import_date = new Date(`${year}-${month}-${day}`); // 'YYYY-MM-DD'
        }

        const [result] = await dataBase.query<ResultSetHeader>(
            `INSERT INTO import_receipts 
                (product_id, price_import, quantity, import_date, supplier_id, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [product_id, price_import, quantity, import_date, supplier_id]
        );

        const insertId = result.insertId;

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
