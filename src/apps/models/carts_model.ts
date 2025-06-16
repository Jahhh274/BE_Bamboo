import { dataBase } from '../../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Cart } from '../interface';

class CartModel {
    // Lấy thông tin sản phẩm theo id
    async getProductById(product_id: number) {
        const [productRows] = await dataBase.query<RowDataPacket[]>(
            `SELECT price, stock FROM products WHERE id = ?`,
            [product_id]
        );
        return productRows[0];
    }

    // Lấy sản phẩm trong giỏ hàng theo user và product
    async getCartItem(user_id: number, product_id: number) {
        const [cartRows] = await dataBase.query<RowDataPacket[]>(
            `SELECT id, quantity FROM carts WHERE user_id = ? AND product_id = ?`,
            [user_id, product_id]
        );
        return cartRows[0];
    }

    // Thêm sản phẩm vào giỏ hàng
    async addToCart(user_id: number, product_id: number, quantity: number, totalPrice: number) {
        // Kiểm tra giỏ hàng đã tồn tại chưa
        const [cartRows] = await dataBase.query<RowDataPacket[]>(
            `SELECT id FROM carts WHERE user_id = ?`,
            [user_id]
        );
        
        let cart_id;
        if (cartRows.length === 0) {
            const [newCart] = await dataBase.query<ResultSetHeader>(
                `INSERT INTO carts (user_id, created_at, updated_at) VALUES (?, NOW(), NOW())`,
                [user_id]
            );
            cart_id = newCart.insertId;
        } else {
            cart_id = cartRows[0].id;
        }

        // Thêm sản phẩm vào bảng product_cart
        const [result] = await dataBase.query<ResultSetHeader>(
            `INSERT INTO carts (user_id, product_id, cart_id, quantity, price) VALUES (?, ?, ?, ?, ?)`,
            [user_id, product_id, cart_id, quantity, totalPrice]
        );
        return result.insertId;
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    async updateCartItemQuantity(user_id: number, product_id: number, quantity: number, totalPrice: number) {
        const [result] = await dataBase.query<ResultSetHeader>(
            `UPDATE carts SET quantity = ?, price = ? WHERE user_id = ? AND product_id = ?`,
            [quantity, totalPrice, user_id, product_id]
        );
        return result.affectedRows;
    }

    // Cập nhật tồn kho sản phẩm
    async updateProductStock(product_id: number, quantityChange: number) {
        const [result] = await dataBase.query<ResultSetHeader>(
            `UPDATE products SET stock = stock + ? WHERE id = ?`,
            [quantityChange, product_id]
        );
        return result.affectedRows;
    }

    // Xóa sản phẩm khỏi giỏ hàng
    async removeCartItem(id: number) {
        const [result] = await dataBase.query<ResultSetHeader>(
            "DELETE FROM carts WHERE id = ?",
            [id]
        );
        return result.affectedRows;
    }

    // Lấy thông tin sản phẩm trong giỏ hàng theo id
    async getCartItemById(id: number) {
        const [cartItems] = await dataBase.query<Cart[] & RowDataPacket[]>(
            "SELECT * FROM carts WHERE id = ?",
            [id]
        );
        return cartItems[0];
    }

    // Lấy tất cả sản phẩm trong giỏ hàng (admin)
    async getAllCartItems() {
        const [cartItems] = await dataBase.query<Cart[] & RowDataPacket[]>(
            "SELECT pc.*, p.name as product_name, p.image_url as product_image FROM carts pc " +
            "JOIN products p ON pc.product_id = p.id"
        );
        return cartItems;
    }

    // Lấy giỏ hàng của 1 user
    async getCartByUserId(user_id: number) {
        const [cartItems] = await dataBase.query<Cart[] & RowDataPacket[]>(
            "SELECT pc.*, p.name as product_name, p.image_url as product_image FROM carts pc " +
            "JOIN product p ON pc.product_id = p.id " +
            "WHERE pc.user_id = ?",
            [user_id]
        );
        return cartItems;
    }
}

export const cartModel = new CartModel();