import { User } from "../interface";
import { usersmodel } from "../models/users_model";
const bcrypt = require("bcrypt");

class UsersService {
    async loginUser(username: string, password: string) {
    const user = await usersmodel.findUserByUsername(username);
    if (!user) throw "Username is incorrect";

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw "Password is incorrect";

    return user;
  }
    async getAllUsers() {
        return await usersmodel.getAllUsers();
    }

    async createUser(newUser: Partial<User>): Promise<User> {
        return await usersmodel.createUser(newUser);
    }

    async updateUser(id: number, updatedFields: Partial<User>) {
        return await usersmodel.updateUser(id, updatedFields);
    }

    async deleteUser(id: number) {
        return await usersmodel.deleteUser(id);
    }

    async getUserById(id: number) {
        return await usersmodel.findById(id);
    }

    async searchUsersByKeyword(keyword: string) {
        return await usersmodel.searchUsersByKeyword(keyword);
    }
}

export const usersservice = new UsersService();
