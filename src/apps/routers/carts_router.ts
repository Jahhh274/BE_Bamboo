import { Router } from "express";
import { cartsController } from "../controllers/carts_controller";

const router = Router();

// Lấy tất cả sản phẩm trong giỏ hàng (admin)
router.get("carts", cartsController.getAllCartItems);

// Lấy giỏ hàng của 1 user
router.get("/users/id", cartsController.getCartByUserId);

// Lấy thông tin sản phẩm trong giỏ hàng theo id
router.get("cart/:id", cartsController.getCartItemById);

// Thêm sản phẩm vào giỏ hàng
router.post("cart", cartsController.addToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put("cart/:id", cartsController.updateCartItemQuantity);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("carts/:id", cartsController.removeCartItem);

export default router;