import mysql from 'mysql2/promise';

export const dataBase = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bamboo_db'
}) 