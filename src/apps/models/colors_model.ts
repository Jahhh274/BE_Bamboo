import { Color } from "../interface";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { dataBase } from "../../config/db";

class colorsModel {
    async getAllColors() {
        const [colors] = await dataBase.query<Color[] & RowDataPacket[]>('SELECT * FROM colors');
        return colors;
    }

    async createColor(newColor: Partial<Color>): Promise<Color> {
        const { name } = newColor;

        const [result] = await dataBase.query<ResultSetHeader>(
            `INSERT INTO colors (name) 
             VALUES (?)`,
            [name]
        );

        const insertId = result.insertId;

        const [rows] = await dataBase.query<RowDataPacket[]>(
            `SELECT * FROM colors WHERE id = ?`,
            [insertId]
        );

        return rows[0] as Color;
    }

    async updateColor(id: number, updatedFields: Partial<Color>): Promise<boolean> {
        const fields = Object.keys(updatedFields).map(field => `${field} =?`).join(', ');
        const values = Object.values(updatedFields);
        values.push(id);

        const [result] = await dataBase.query(
            `UPDATE colors SET ${fields} WHERE id = ?`,
            [...values]
        );

        return (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0;
    }

    async deleteColor(id: number): Promise<boolean> {
        const [result] = await dataBase.query<ResultSetHeader>('DELETE FROM colors WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async findById(id: number): Promise<Color> {
        const [colors] = await dataBase.query<Color[] & RowDataPacket[]>('SELECT * FROM colors WHERE id = ?', [id]);
        return colors[0]
    }

    async searchColorsByKeyword(keyword: string) {
        const [colors] = await dataBase.query<Color[] & RowDataPacket[]>(
            'SELECT * FROM colors WHERE name LIKE ?',
            [`%${keyword}%`]
        );
        return colors;
    }
}

export const colorsmodel = new colorsModel();
