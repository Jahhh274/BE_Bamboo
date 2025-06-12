import { Request, Response } from "express";
import { cartService } from "../services/carts_service";

class CartsController {
    // Lấy tất cả sản phẩm trong giỏ hàng (admin)
    async getAllCartItems(req: Request, res: Response) {
        try {
            const carts = await cartService.getAllCartItems();
            res.json(carts);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Lấy giỏ hàng của 1 user
    async getCartByUserId(req: Request, res: Response) {
        try {
            const user_id = Number(req.params.user_id);
            const cart = await cartService.getCartByUserId(user_id);
            res.json(cart);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Lấy thông tin sản phẩm trong giỏ hàng theo id
    async getCartItemById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const cartItem = await cartService.getCartItemById(id);
            if (!cartItem) {
                res.status(404).json({ message: "Cart item not found" });
                return;
            }
            res.json(cartItem);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Thêm sản phẩm vào giỏ hàng
    async addToCart(req: Request, res: Response) {
        try {
            const { user_id, product_id, quantity } = req.body;
            const cartItemId = await cartService.addToCart(user_id, product_id, quantity);
            res.status(201).json({ message: "Added to cart", cartItemId });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    async updateCartItemQuantity(req: Request, res: Response) {
        try {
            const { user_id, product_id, quantity } = req.body;
            const affectedRows = await cartService.updateCartItemQuantity(user_id, product_id, quantity);
            res.json({ message: "Cart item updated", affectedRows });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    async removeCartItem(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const affectedRows = await cartService.removeCartItem(id);
            if (affectedRows === 0) {
                res.status(404).json({ message: "Cart item not found" });
                return;
            }
            res.json({ message: "Cart item removed" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }
}

export const cartsController = new CartsController();