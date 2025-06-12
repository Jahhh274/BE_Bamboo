import { cartModel } from '../models/carts_model';
import { Cart } from '../interface';

class CartService {
    // Lấy tất cả sản phẩm trong giỏ hàng (admin)
    async getAllCartItems(): Promise<Cart[]> {
        return await cartModel.getAllCartItems();
    }

    // Lấy giỏ hàng của 1 user
    async getCartByUserId(user_id: number): Promise<Cart[]> {
        return await cartModel.getCartByUserId(user_id);
    }

    // Lấy thông tin sản phẩm trong giỏ hàng theo id
    async getCartItemById(id: number): Promise<Cart | null> {
        return await cartModel.getCartItemById(id);
    }

    // Thêm sản phẩm vào giỏ hàng
    async addToCart(user_id: number, product_id: number, quantity: number): Promise<number> {
        // Lấy thông tin sản phẩm
        const product = await cartModel.getProductById(product_id);
        if (!product) throw new Error('Product not found');
        if (product.stock < quantity) throw new Error('Not enough stock');

        const totalPrice = product.price * quantity;
        return await cartModel.addToCart(user_id, product_id, quantity, totalPrice);
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    async updateCartItemQuantity(user_id: number, product_id: number, quantity: number): Promise<number> {
        const product = await cartModel.getProductById(product_id);
        if (!product) throw new Error('Product not found');
        if (product.stock < quantity) throw new Error('Not enough stock');

        const totalPrice = product.price * quantity;
        return await cartModel.updateCartItemQuantity(user_id, product_id, quantity, totalPrice);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    async removeCartItem(id: number): Promise<number> {
        return await cartModel.removeCartItem(id);
    }
}

export const cartService = new CartService();