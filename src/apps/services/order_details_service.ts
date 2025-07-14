// import { OrderDetail } from "../interface";
// import { orderDetailModel } from "../models/order_details_model";

// class OrderDetailService {
//     // Xem chi tiết đơn hàng
//     async getDetail(id: number): Promise<OrderDetail | null> {
//         return await orderDetailModel.getOrderDetailById(id);
//     }

//     // Sửa nội dung đơn hàng
//     async updateDetail(
//         id: number,
//         quantity: number,
//         price: number
//     ): Promise<boolean> {
//         const total_price = quantity * price;
//         return await orderDetailModel.updateOrderDetail(id, quantity, price, total_price);
//     }

//     // Hủy đơn hàng (xóa chi tiết)
//     async deleteDetail(id: number): Promise<boolean> {
//         return await orderDetailModel.deleteOrderDetail(id);
//     }
// }

// export const orderDetailService = new OrderDetailService();


import { OrderDetail } from "../interface";
import { orderDetailModel } from "../models/order_details_model";

class OrderDetailService {
  // 1. Lấy chi tiết đơn hàng theo ID
 async getOrderDetail(id: number): Promise<OrderDetail | null> {
    return await orderDetailModel.getOrderDetail(id);
  }

  async getById(id: number): Promise<OrderDetail | null> {
    return await orderDetailModel.getOrderDetailById(id);
  }

  // 2. Lấy danh sách theo user_id
  async getByUserId(userId: number): Promise<OrderDetail[]> {
    return await orderDetailModel.getOrderDetailsByUser(userId);
  }

  // 3. Lấy danh sách theo payment_id
  async getByPaymentId(paymentId: number): Promise<OrderDetail[]> {
    return await orderDetailModel.getOrderDetailsByPayment(paymentId);
  }

  // 4. Tạo chi tiết đơn hàng mới
  //  async create( detail: Omit<OrderDetail, "id" | "price" | "product_id">, price: number, product_id: number): Promise<number[]> {
  //   return await orderDetailModel.createOrderDetail(detail);
  // }

  async create(details: {
  user_id: number;
  product_id: number;
  quantity: number;
  price: number;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  note?: string;
}[]): Promise<number[]> {
  return await orderDetailModel.createOrderDetail(details);
}

  // 5. Cập nhật chi tiết đơn hàng
  async update(
    id: number,
    data: Partial<Pick<OrderDetail, "quantity" | "price" | "receiver_name" | "receiver_phone" | "receiver_address" | "note">>
  ): Promise<boolean> {
    return await orderDetailModel.updateOrderDetail(id, data);
  }

  // 6. Xoá chi tiết đơn hàng
  async delete(id: number): Promise<boolean> {
    return await orderDetailModel.deleteOrderDetail(id);
  }
}

export const orderDetailService = new OrderDetailService();
