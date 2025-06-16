import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Category } from "../interface";
import { dataBase } from "../../config/db";

class catergoriesModel {
    async getAllCategories() {
        const [categories] = await dataBase.query<Category[] & RowDataPacket[]>('SELECT * FROM categories');
        return categories;
    }

    async createCategory(newCategory: Partial<Category>): Promise<Category> {
        const { name, description } = newCategory;

        const [result] = await dataBase.query<ResultSetHeader>(
            `INSERT INTO categories (name, description, created_at, updated_at)
             VALUES (?, ?, NOW(), NOW())`, 
            [name, description]
        );

        const insertId = result.insertId;

        const [rows] = await dataBase.query<RowDataPacket[]>(
            `SELECT * FROM categories WHERE id = ?`,
            [insertId]
        );

        return rows[0] as Category;
    }

    async updateCategory(id: number, updatedFields: Partial<Category>): Promise<boolean> {
        const fields = Object.keys(updatedFields).map(field => `${field} =?`).join(', ');
        const values = Object.values(updatedFields);
        values.push(id);

        const [result] = await dataBase.query(
            `UPDATE categories SET ${fields} WHERE id = ?`,
            [...values]
        );

        return (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0;
    }

    async deleteCategory(id: number): Promise<boolean> {
        const [result] = await dataBase.query<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async findById(id: number): Promise<Category> {
        const [categories] = await dataBase.query<Category[] & RowDataPacket[]>('SELECT * FROM categories WHERE id = ?', [id]);
        return categories[0]
    }

    async searchCategoriesByKeyword(keyword: string) {
        const [categories] = await dataBase.query<Category[] & RowDataPacket[]>(
            'SELECT * FROM categories WHERE name LIKE ?',
            [`%${keyword}%`]
        );
        return categories;
    }
}

export const catergoriesmodel = new catergoriesModel();
