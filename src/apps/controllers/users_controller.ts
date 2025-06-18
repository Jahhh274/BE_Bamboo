import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { usersservice } from "../services/users_service";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}


class usersController {
   async loginUser(req: Request, res: Response) {
    try {
      const user = await usersservice.loginUser(
        req.body.username,
        req.body.password
      );

      if (!user) {
        return res.status(404).json({ message: "Wrong username!" });
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        return res.status(404).json({ message: "Wrong password!" });
      }

      const accessToken = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_ACCESS_TOKEN || "your_jwt_secret",
        { expiresIn: "30d" }
      );

      const { password, ...others } = user;
      return res.status(200).json({ ...others, accessToken });
      
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error", error: err });
     
      
    }
  }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await usersservice.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const { username, password, email, full_name, phone, address, role } = req.body;

            const existingUser = await usersservice.loginUser(username, password);
            if (existingUser) {
                res.status(400).json({ message: 'Username already exists' });
                return
            }
            const salt = await bcrypt.genSalt(10);

            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = {
                username,
                password: hashedPassword,
                email,
                full_name,
                phone,
                address,
                role: role || "user",
            };

            const createdUser = await usersservice.createUser(newUser);
            res.status(201).json({ message: 'User registered successfully', user: createdUser });
        } catch (error) {
            console.log("---> error", error);
            
            res.status(500).json({ message: 'Internal server error', error });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.params.id);
            const userName = req.params.username;
            const salt = await bcrypt.genSalt(10);
            const { username, password, email, full_name, phone, address, role } = req.body;
            const hashedPassword = await bcrypt.hash(password, salt);
    
            const updatedFields = {
                username,
                password: hashedPassword,
                email,
                full_name,
                phone,
                address,
                role,
            };
    
            const user = await usersservice.getUserById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
    
            if (updatedFields.username !== userName && updatedFields.role !== 'admin') {
                res.status(403).json({ message: 'You cannot update this user' });
                return;
            }
    
            if ('username' in updatedFields && updatedFields.username !== user.username) {
                res.status(400).json({ message: 'Username cannot be changed' });
                return;
            }
    
            const success = await usersservice.updateUser(userId, updatedFields);
            if (!success) {
                res.status(400).json({ message: 'Update failed' });
                return;
            }
    
            res.json({ message: 'User updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error });
        }
    }
    

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = await usersservice.getUserById(Number(id));
            if (!userId) {
                res.status(404).json({ message: "User not found" });
                return
            }
            const result = await usersservice.deleteUser(Number(id));
            if (result) {
                res.status(200).json({ message: "User deleted successfully" });
            } else {
                res.status(404).json({ message: "User not found" });
                res.json({ message: 'User deleted successfully' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await usersservice.getUserById(Number(id));
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async searchUsersByKeyword(req: Request, res: Response) {
        try {
            const { keyword } = req.query;
            const result = await usersservice.searchUsersByKeyword(String(keyword));
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
}

export const userscontroller = new usersController();