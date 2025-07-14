// import { ResultSetHeader, RowDataPacket } from "mysql2";
// import { OrderDetail } from "../interface";
// import { dataBase } from "../../config/db";


// class OrderDetailModel {
//     // 1. Xem chi tiết đơn hàng
//     async getOrderDetailById(id: number): Promise<OrderDetail | null> {
//         const [rows] = await dataBase.query<OrderDetail[] & RowDataPacket[]>(
//             `SELECT * FROM order_details WHERE id = ?`,
//             [id]
//         );
//         return rows.length > 0 ? rows[0] : null;
//     }

//     // 2. Sửa nội dung đơn hàng
//     async updateOrderDetail(
//         id: number,
//         quantity: number,
//         price: number,
//         total_price: number
//     ): Promise<boolean> {
//         const [result] = await dataBase.query<ResultSetHeader>(
//             `UPDATE order_details 
//              SET quantity = ?, price = ?, total_price = ?
//              WHERE id = ?`,
//             [quantity, price, total_price, id]
//         );
//         return result.affectedRows > 0;
//     }

//     // 3. Hủy đơn hàng (xóa chi tiết)
//     async deleteOrderDetail(id: number): Promise<boolean> {
//         const [result] = await dataBase.query<ResultSetHeader>(
//             `DELETE FROM order_details WHERE id = ?`,
//             [id]
//         );
//         return result.affectedRows > 0;
//     }
// }

// export const orderDetailModel = new OrderDetailModel();


import { ResultSetHeader, RowDataPacket } from "mysql2";
import { dataBase } from "../../config/db";
import { OrderDetail } from "../interface";
import { cartModel } from "./carts_model";

class OrderDetailModel {
  // 1. Lấy chi tiết đơn hàng theo ID
  async getOrderDetail(id: number): Promise<OrderDetail | null> {
    const [rows] = await dataBase.query<OrderDetail[] & RowDataPacket[]>(
      `SELECT * FROM order_details WHERE id = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async getOrderDetailById(orderDetailId: number): Promise<any | null> {
    const [rows] = await dataBase.query<RowDataPacket[]>(
      `SELECT 
      od.id AS order_detail_id,
      od.receiver_name,
      od.receiver_phone,
      od.receiver_address,
      od.note,
      od.price,

      o.id AS order_id,
      o.status,

      COALESCE(p.method, 'COD') AS payment_method

    FROM order_details od
    LEFT JOIN orders o ON o.order_detail_id = od.id
    LEFT JOIN payments p ON p.transaction_id = o.id
    WHERE od.id = ?`,
      [orderDetailId]
    );

    return rows.length > 0 ? rows[0] : null;
  }



  // 2. Lấy theo user_id
  async getOrderDetailsByUser(userId: number): Promise<OrderDetail[]> {
    const [rows] = await dataBase.query<OrderDetail[] & RowDataPacket[]>(
      `SELECT * FROM order_details WHERE user_id = ?`,
      [userId]
    );
    return rows;
  }

  // 3. Lấy theo payment_id
  async getOrderDetailsByPayment(paymentId: number): Promise<OrderDetail[]> {
    const [rows] = await dataBase.query<OrderDetail[] & RowDataPacket[]>(
      `SELECT * FROM order_details WHERE payment_id = ?`,
      [paymentId]
    );
    return rows;
  }

  // 4. Cập nhật chi tiết đơn hàng
  async updateOrderDetail(
    id: number,
    data: Partial<Pick<OrderDetail, "quantity" | "price" | "receiver_name" | "receiver_phone" | "receiver_address" | "note">>
  ): Promise<boolean> {
    const current = await this.getOrderDetailById(id);
    if (!current) return false;

    const quantity = data.quantity ?? current.quantity;
    const price = data.price ?? current.price;
    const total_price = quantity * price;

    const receiver_name = data.receiver_name ?? current.receiver_name;
    const receiver_phone = data.receiver_phone ?? current.receiver_phone;
    const receiver_address = data.receiver_address ?? current.receiver_address;
    const note = data.note ?? current.note;

    const [result] = await dataBase.query<ResultSetHeader>(
      `UPDATE order_details
       SET quantity = ?, price = ?, total_price = ?,
           receiver_name = ?, receiver_phone = ?, receiver_address = ?, note = ?
       WHERE id = ?`,
      [
        quantity,
        price,
        total_price,
        receiver_name,
        receiver_phone,
        receiver_address,
        note,
        id,
      ]
    );

    return result.affectedRows > 0;
  }

  // 5. Xoá một mục trong chi tiết đơn hàng
  async deleteOrderDetail(id: number): Promise<boolean> {
    const [result] = await dataBase.query<ResultSetHeader>(
      `DELETE FROM order_details WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
  // 6. Tạo chi tiết đơn hàng
  // async createOrderDetail(detail: Omit<OrderDetail, "id" | "price" | "product_id">): Promise<number[]> {
  //   const conn = await dataBase.getConnection();
  //   await conn.beginTransaction();

  //   try {
  //     // 1. Lấy danh sách sản phẩm trong giỏ hàng của người dùng
  //     const cartItems = await cartModel.getCartByUserId(detail.user_id);
  //     if (!cartItems || cartItems.length === 0) {
  //       throw new Error("Không có sản phẩm trong giỏ hàng để tạo đơn hàng");
  //     }

  //     const insertedIds: number[] = [];

  //     for (const item of cartItems) {
  //       const total_price = item.quantity * Number(item.price);

  //       // 2. Tạo chi tiết đơn hàng cho từng sản phẩm
  //       const [result] = await conn.query<ResultSetHeader>(
  //         `INSERT INTO order_details 
  //        (user_id, product_id, quantity, price, total_price,
  //         receiver_name, receiver_phone, receiver_address, note)
  //        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  //         [
  //           detail.user_id,
  //           item.product_id,
  //           item.quantity,
  //           item.price,
  //           total_price,
  //           detail.receiver_name,
  //           detail.receiver_phone,
  //           detail.receiver_address,
  //           detail.note,
  //         ]
  //       );

  //       insertedIds.push(result.insertId);

  //       // 3. Trừ số lượng sản phẩm trong kho
  //       const [updateResult] = await conn.query<ResultSetHeader>(
  //         `UPDATE warehouse 
  //        SET quantity = quantity - ? 
  //        WHERE product_id = ? AND quantity >= ?`,
  //         [item.quantity, item.product_id, item.quantity]
  //       );

  //       if (updateResult.affectedRows === 0) {
  //         throw new Error(`Không đủ hàng trong kho cho sản phẩm ID ${item.product_id}`);
  //       }
  //     }

  //     await conn.commit();
  //     return insertedIds; // trả về mảng các order_detail_id đã tạo
  //   } catch (err) {
  //     await conn.rollback();
  //     console.error("❌ Lỗi khi tạo chi tiết đơn hàng hoặc cập nhật kho:", err);
  //     throw err;
  //   } finally {
  //     conn.release();
  //   }
  // }




  //   async createOrderDetail(
  //     details: {
  //       user_id: number;
  //       product_id: number;
  //       quantity: number;
  //       price: number;
  //       receiver_name: string;
  //       receiver_phone: string;
  //       receiver_address: string;
  //       note?: string;
  //     }[]
  //   ): Promise<number[]> {
  //     const conn = await dataBase.getConnection();
  //     await conn.beginTransaction();

  //     try {
  //       const insertedIds: number[] = [];

  //       for (const item of details) {
  //         const total_price = item.quantity * item.price;

  //         const [result] = await conn.query<ResultSetHeader>(
  //           `INSERT INTO order_details 
  //         (user_id, product_id, quantity, price, total_price,
  //          receiver_name, receiver_phone, receiver_address, note)
  //         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  //           [
  //             item.user_id,
  //             item.product_id,
  //             item.quantity,
  //             item.price,
  //             total_price,
  //             item.receiver_name,
  //             item.receiver_phone,
  //             item.receiver_address,
  //             item.note || "",
  //           ]
  //         );

  //         insertedIds.push(result.insertId);

  //         const [updateResult] = await conn.query<ResultSetHeader>(
  //           `UPDATE warehouse 
  //         SET quantity = quantity - ? 
  //         WHERE product_id = ? AND quantity >= ?`,
  //           [item.quantity, item.product_id, item.quantity]
  //         );

  //         if (updateResult.affectedRows === 0) {
  //           throw new Error(`Không đủ hàng trong kho cho sản phẩm ID ${item.product_id}`);
  //         }
  //       }

  //       await conn.commit();
  //       return insertedIds;
  //     } catch (err) {
  //       await conn.rollback();
  //       console.error("❌ Lỗi khi tạo chi tiết đơn hàng hoặc cập nhật kho:", err);
  //       throw err;
  //     } finally {
  //       conn.release();
  //     }
  //   }

  // }

  async createOrderDetail(
    details: {
      user_id: number;
      product_id: number;
      quantity: number;
      price: number;
      receiver_name: string;
      receiver_phone: string;
      receiver_address: string;
      note?: string;
    }[]
  ): Promise<number[]> {
    const conn = await dataBase.getConnection();
    await conn.beginTransaction();

    try {
      const insertedIds: number[] = [];

      for (const item of details) {
        const total_price = item.quantity * item.price;

        // Insert vào order_details
        const [result] = await conn.query<ResultSetHeader>(
          `INSERT INTO order_details 
        (user_id, product_id, quantity, price, total_price,
         receiver_name, receiver_phone, receiver_address, note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.user_id,
            item.product_id,
            item.quantity,
            item.price,
            total_price,
            item.receiver_name,
            item.receiver_phone,
            item.receiver_address,
            item.note || "",
          ]
        );
        const paymentId = 1;

        const orderDetailId = result.insertId;
        insertedIds.push(orderDetailId);

        // ✅ Insert vào orders ngay tại đây
        await conn.query(
          `INSERT INTO orders (order_detail_id, status, total_price, payment_id)
         VALUES (?, ?, ?, ?)`,
          [orderDetailId, 'pending', total_price, paymentId]
        );

        // Trừ kho
        const [updateResult] = await conn.query<ResultSetHeader>(
          `UPDATE warehouse 
        SET quantity = quantity - ? 
        WHERE product_id = ? AND quantity >= ?`,
          [item.quantity, item.product_id, item.quantity]
        );

        if (updateResult.affectedRows === 0) {
          throw new Error(`Không đủ hàng trong kho cho sản phẩm ID ${item.product_id}`);
        }
      }

      await conn.commit();
      return insertedIds;
    } catch (err) {
      await conn.rollback();
      console.error("❌ Lỗi khi tạo chi tiết đơn hàng hoặc cập nhật kho:", err);
      throw err;
    } finally {
      conn.release();
    }
  }
}


export const orderDetailModel = new OrderDetailModel();