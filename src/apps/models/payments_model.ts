import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Payment } from "../interface";
import { dataBase } from "../../config/db";

class PaymentModel {
    async getAllPayments(): Promise<Payment[]> {
        const [payments] = await dataBase.query<Payment[] & RowDataPacket[]>('SELECT * FROM payment');
        return payments;
    }

    async createPayment(newPayment: Partial<Payment>): Promise<Payment> {
        const { transaction_id, method } = newPayment;

        const [result] = await dataBase.query<ResultSetHeader>(
            `INSERT INTO payment (transaction_id, method) VALUES (?, ?)`,
            [transaction_id, method]
        );

        const insertId = result.insertId;

        const [rows] = await dataBase.query<RowDataPacket[]>(
            `SELECT * FROM payment WHERE id = ?`,
            [insertId]
        );

        return rows[0] as Payment;
    }

    async findById(id: number): Promise<Payment | null> {
        const [payments] = await dataBase.query<Payment[] & RowDataPacket[]>(`SELECT * FROM payment WHERE id = ?`, [id]);
        return payments.length > 0 ? payments[0] : null;
    }

    async updatePayment(id: number, updatedFields: Partial<Payment>): Promise<boolean> {
        const fields = Object.keys(updatedFields).map(field => `${field} = ?`).join(', ');
        const values = Object.values(updatedFields);
        values.push(id);

        const [result] = await dataBase.query<ResultSetHeader>(
            `UPDATE payment SET ${fields} WHERE id = ?`,
            values
        );

        return result.affectedRows > 0;
    }

    async deletePayment(id: number): Promise<boolean> {
        const [result] = await dataBase.query<ResultSetHeader>(`DELETE FROM payment WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    }
}

export const paymentmodel = new PaymentModel();
