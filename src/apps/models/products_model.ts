import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Product } from "../interface";
import { dataBase } from "../../config/db";

class productsModel {
    async getAllProducts(): Promise<Product[]> {
        const [rows] = await dataBase.query<RowDataPacket[]>("SELECT * FROM products");
        return rows as Product[];
    }

    async createProduct(newProduct: Partial<Product>): Promise<Product> {
        const { name, image_url, description, category_id, color_id } = newProduct;

        const [result] = await dataBase.query<ResultSetHeader>(`INSERT INTO products (name, image_url, description, category_id, color_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [name, image_url, description, category_id, color_id]
        );

        const insertId = result.insertId;

        const [rows] = await dataBase.query<RowDataPacket[]>(
            `SELECT * FROM products WHERE id = ?`,
            [insertId]
        );

        return rows[0] as Product;
    }

    async updateProduct(id: number, updatedFields: Partial<Product>): Promise<boolean> {
        // Tự động thêm updated_at vào các trường cần cập nhật
        const fieldsToUpdate = {
            ...updatedFields,
            updated_at: new Date()
        };

        const fields = Object.keys(fieldsToUpdate).map(field => `${field} = ?`).join(', ');
        const values = Object.values(fieldsToUpdate);
        values.push(id);

        const [result] = await dataBase.query(`UPDATE products SET ${fields} WHERE id = ?`,
            values
        );

        return (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0;
    }

    async deleteProduct(id: number): Promise<boolean> {
        const [result] = await dataBase.query<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    async findById(id: number): Promise<Product> {
        const [products] = await dataBase.query<Product[] & RowDataPacket[]>('SELECT * FROM products WHERE id = ?', [id]);
        return products[0]
    }

    async searchProductsByKeyword(keyword: string) {
        const [products] = await dataBase.query<Product[] & RowDataPacket[]>(
            'SELECT * FROM products WHERE name LIKE ?', 
            [`%${keyword}%`]
        );
        return products;
    }    
}

export const productsmodel = new productsModel();