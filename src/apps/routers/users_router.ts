import { userscontroller } from './../controllers/users_controller';
import express, { Router } from 'express';

const userrouter = express.Router();

userrouter.get('/users', userscontroller.getAllUsers);
userrouter.post('/login', userscontroller.loginUser);
userrouter.post('/register', userscontroller.registerUser);
userrouter.put('/user/:id',userscontroller.updateUser);
userrouter.delete('/user/:id',userscontroller.deleteUser);
userrouter.get('/user/:id', userscontroller.getUserById);
userrouter.get('/users/search', userscontroller.searchUsersByKeyword);

export default userrouter;