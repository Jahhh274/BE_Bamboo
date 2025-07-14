// import { Request, Response } from "express";
// import { orderDetailService } from "../services/order_details_service";

// class OrderDetailController {
//     // 1. Xem chi tiết đơn hàng
//     async getOrderDetail(req: Request, res: Response) {
//         try {
//             const id = Number(req.params.id);
//             if (isNaN(id)) {
//                 return res.status(400).json({ message: "Invalid order detail id" });
//             }

//             const detail = await orderDetailService.getDetail(id);
//             if (!detail) {
//                 return res.status(404).json({ message: "Order detail not found" });
//             }
//             res.json(detail);
//         } catch (error) {
//             console.error("getOrderDetail error:", error);
//             res.status(500).json({ message: "Internal server error" });
//         }
//     }

//     // 2. Sửa nội dung đơn hàng
//     async updateOrderDetail(req: Request, res: Response) {
//         try {
//             const id = Number(req.params.id);
//             const { quantity, price } = req.body;

//             if (
//                 isNaN(id) || 
//                 typeof quantity !== "number" || 
//                 typeof price !== "number" || 
//                 quantity < 0 || 
//                 price < 0
//             ) {
//                 return res.status(400).json({ message: "Invalid input data" });
//             }

//             const updated = await orderDetailService.updateDetail(id, quantity, price);

//             if (!updated) {
//                 return res.status(404).json({ message: "Order detail not found or not updated" });
//             }

//             res.json({ message: "Order detail updated successfully" });
//         } catch (error) {
//             console.error("updateOrderDetail error:", error);
//             res.status(500).json({ message: "Internal server error" });
//         }
//     }

//     // 3. Hủy đơn hàng (xóa chi tiết)
//     async deleteOrderDetail(req: Request, res: Response) {
//         try {
//             const id = Number(req.params.id);
//             if (isNaN(id)) {
//                 return res.status(400).json({ message: "Invalid order detail id" });
//             }

//             const deleted = await orderDetailService.deleteDetail(id);

//             if (!deleted) {
//                 return res.status(404).json({ message: "Order detail not found or not deleted" });
//             }

//             res.json({ message: "Order detail deleted successfully" });
//         } catch (error) {
//             console.error("deleteOrderDetail error:", error);
//             res.status(500).json({ message: "Internal server error" });
//         }
//     }
// }

// export const orderDetailController = new OrderDetailController();

import { Request, Response } from "express";
import { orderDetailService } from "../services/order_details_service";
import { cartModel } from "../models/carts_model";

class OrderDetailController {
  // 1. Lấy chi tiết đơn hàng theo ID

  async getOrderDetail(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID không hợp lệ" });

    try {
      const detail = await orderDetailService.getOrderDetail(id);
      if (!detail) return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng" });
      return res.status(200).json(detail);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  }
  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID không hợp lệ" });

    try {
      const detail = await orderDetailService.getById(id);
      if (!detail) return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng" });
      return res.status(200).json(detail);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  }

  // 2. Lấy danh sách chi tiết đơn hàng theo user_id
  async getByUserId(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "User ID không hợp lệ" });

    try {
      const list = await orderDetailService.getByUserId(userId);
      return res.status(200).json(list);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  }

  // 3. Lấy danh sách chi tiết đơn hàng theo payment_id
  async getByPaymentId(req: Request, res: Response) {
    const paymentId = Number(req.params.paymentId);
    if (isNaN(paymentId)) return res.status(400).json({ message: "Payment ID không hợp lệ" });

    try {
      const list = await orderDetailService.getByPaymentId(paymentId);
      return res.status(200).json(list);
    } catch (error) {
      return res.status(500).json({ message: "Lỗi server", error });
    }
  }

  // 4. Tạo mới chi tiết đơn hàng từ các cart_item_id
  // async create(req: Request, res: Response) {
  //   try {
  //     const {
  //       user_id,
  //       receiver_name,
  //       receiver_phone,
  //       receiver_address,
  //       note,
  //       items, // [{ cart_item_id }]
  //     } = req.body;

  //     console.log("REQ.BODY RECEIVED ---->", req.body);

  //     if (
  //       !user_id || !receiver_name ||
  //       !receiver_phone || !receiver_address || !Array.isArray(items)
  //     ) {
  //       return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  //     }

  //     const createdIds: number[] = [];

  //     for (const item of items) {
  //       const cartItem = await cartModel.getCartItemById(item.cart_item_id);
  //       if (!cartItem) continue;

  //       const id = await orderDetailService.create({
  //         user_id,
  //         quantity: cartItem.quantity,
  //         receiver_name,
  //         receiver_phone,
  //         receiver_address,
  //         note: note || "",
  //         total_price: 0
  //       },
  //         Number(cartItem.product_id),
  //         Number(cartItem.price),
  //       ); // truyền riêng

  //       createdIds.push(...id);
  //     }


  //     if (createdIds.length === 0) {
  //       return res.status(400).json({ message: "Không thể tạo chi tiết đơn hàng nào" });
  //     }

  //     return res.status(201).json({ message: "Tạo thành công", createdIds });
  //   } catch (error) {
  //     console.error("Create OrderDetail Error:", error);
  //     return res.status(500).json({ message: "Lỗi khi tạo chi tiết đơn hàng", error });
  //   }
  // }
async create(req: Request, res: Response) {
  try {
    const {
      user_id,
      receiver_name,
      receiver_phone,
      receiver_address,
      note,
      items, // [{ cart_item_id }]
    } = req.body;

    if (
      !user_id || !receiver_name ||
      !receiver_phone || !receiver_address || !Array.isArray(items)
    ) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const detailList = [];

    for (const item of items) {
      const cartItem = await cartModel.getCartItemById(item.cart_item_id);
      if (!cartItem) continue;

      detailList.push({
        user_id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        price: Number(cartItem.price),
        receiver_name,
        receiver_phone,
        receiver_address,
        note,
      });
    }

    if (detailList.length === 0) {
      return res.status(400).json({ message: "Không thể tạo chi tiết đơn hàng nào" });
    }

    const createdIds = await orderDetailService.create(detailList);
    return res.status(201).json({ message: "Tạo thành công", createdIds });
  } catch (error) {
    console.error("Create OrderDetail Error:", error);
    return res.status(500).json({ message: "Lỗi khi tạo chi tiết đơn hàng", error });
  }
}


  // 5. Cập nhật chi tiết đơn hàng
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID không hợp lệ" });

    try {
      const {
        quantity,
        price,
        receiver_name,
        receiver_phone,
        receiver_address,
        note
      } = req.body;

      const success = await orderDetailService.update(id, {
        quantity,
        price,
        receiver_name,
        receiver_phone,
        receiver_address,
        note,
      });

      if (success) {
        return res.status(200).json({ message: "Cập nhật thành công" });
      }

      return res.status(404).json({ message: "Không tìm thấy chi tiết để cập nhật" });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi khi cập nhật", error });
    }
  }

  // 6. Xoá chi tiết đơn hàng
  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID không hợp lệ" });

    try {
      const success = await orderDetailService.delete(id);
      if (success) {
        return res.status(200).json({ message: "Xoá thành công" });
      }
      return res.status(404).json({ message: "Không tìm thấy chi tiết để xoá" });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi khi xoá", error });
    }
  }
}

export const orderDetailController = new OrderDetailController();
