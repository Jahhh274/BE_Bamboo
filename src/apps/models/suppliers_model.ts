import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Supplier } from "../interface";
import { dataBase } from "../../config/db";

class suppliersModel {
    async getAllSuppliers(): Promise<Supplier[]> {
        const [rows] = await dataBase.query<RowDataPacket[]>("SELECT * FROM suppliers");
        return rows as Supplier[];
    }

    async createSupplier(newSupplier: Partial<Supplier>): Promise<Supplier> {
        const { name, email, phone, address } = newSupplier;

        const [result] = await dataBase.query<ResultSetHeader>(
            `INSERT INTO suppliers (name, email, phone, address, created_at, updated_at) 
             VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [name, email, phone, address]
        );

        const insertId = result.insertId;

        const [rows] = await dataBase.query<RowDataPacket[]>(
            `SELECT * FROM suppliers WHERE id = ?`,
            [insertId]
        );

        return rows[0] as Supplier;
    }

    async updateSupplier(id: number, updatedFields: Partial<Supplier>): Promise<boolean> {
        const fields = Object.keys(updatedFields).map(field => `${field} =?`).join(', ');
        const values = Object.values(updatedFields);
        values.push(id);

        const [result] = await dataBase.query(
            `UPDATE suppliers SET ${fields} WHERE id = ?`,
            [...values]
        );

        return (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0;
    }

    async deleteSupplier(id: number): Promise<boolean> {
        const [result] = await dataBase.query<ResultSetHeader>('DELETE FROM suppliers WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async findById(id: number): Promise<Supplier> {
        const [suppliers] = await dataBase.query<Supplier[] & RowDataPacket[]>('SELECT * FROM suppliers WHERE id = ?', [id]);
        return suppliers[0]
    }

    async searchSuppliersByKeyword(keyword: string) {
        const [suppliers] = await dataBase.query<Supplier[] & RowDataPacket[]>(
            'SELECT * FROM suppliers WHERE name LIKE ?',
            [`%${keyword}%`]
        );
        return suppliers;
    }
}

export const suppliersmodel = new suppliersModel();