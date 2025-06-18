import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Supplier, User } from "../interface";
import { dataBase } from "../../config/db";

class UsersModel {
    async getAllUsers(): Promise<User[]> {
        const [rows] = await dataBase.query<RowDataPacket[]>("SELECT * FROM users");
        return rows as User[];
    }

    async createUser(newUser: Partial<User>): Promise<User> {
        const { username, password, email, full_name, phone, address, role } = newUser;

        const [result] = await dataBase.query<ResultSetHeader>(
            `INSERT INTO users (username, password, email, full_name, phone, address, role, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [username, password, email, full_name, phone, address, role]
        );

        const insertId = result.insertId;

        const [rows] = await dataBase.query<RowDataPacket[]>(
            `SELECT * FROM users WHERE id = ?`,
            [insertId]
        );

        return rows[0] as User;
    }

    async updateUser(id: number, updatedFields: Partial<Supplier>): Promise<boolean> {
        const fields = Object.keys(updatedFields).map(field => `${field} =?`).join(', ');
        const values = Object.values(updatedFields);
        values.push(id);

        const [result] = await dataBase.query(
            `UPDATE users SET ${fields} WHERE id = ?`,
            [...values]
        );

        return (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0;
    }

    async deleteUser(id: number): Promise<boolean> {
        const [result] = await dataBase.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async findById(id: number): Promise<User> {
        const [users] = await dataBase.query<User[] & RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
        return users[0]
    }

    async searchUsersByKeyword(keyword: string) {
        const [users] = await dataBase.query<User[] & RowDataPacket[]>(
            'SELECT * FROM users WHERE full_name LIKE ?',
            [`%${keyword}%`]
        );
        return users;
    }

   async findUserByUsername(username: string): Promise<User | null> {
    const [users] = await dataBase.query<User[] & RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (users.length === 0) return null;
    return users[0];
  }
}

export const usersmodel = new UsersModel();