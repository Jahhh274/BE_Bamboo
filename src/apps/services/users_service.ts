import { User } from "../interface";
import { usersmodel } from "../models/users_model";

class UsersService {
    async loginUser(username: string) {
        return await usersmodel.findByUserName(username);
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
