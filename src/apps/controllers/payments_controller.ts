// import { Request, Response } from "express";
// import { paymentservice } from "../services/payment_service";

// class PaymentController {
//     async getAllPayments(req: Request, res: Response) {
//         try {
//             const payments = await paymentservice.getAllPayments();
//             res.status(200).json(payments);
//         } catch (err) {
//             res.status(500).json({ message: "Internal Server Error", error: err });
//         }
//     }

//     async createPayment(req: Request, res: Response) {
//         try {
//             const newPayment = req.body;
//             const createdPayment = await paymentservice.createPayment(newPayment);
//             res.status(201).json({ message: "Payment created successfully", payment: createdPayment });
//         } catch (err) {
//             res.status(500).json({ message: "Internal Server Error", error: err });
//         }
//     }

//     async getPaymentById(req: Request, res: Response) {
//         try {
//             const { id } = req.params;
//             const payment = await paymentservice.findPaymentById(Number(id));
//             if (payment) {
//                 res.status(200).json(payment);
//             } else {
//                 res.status(404).json({ message: "Payment not found" });
//             }
//         } catch (err) {
//             res.status(500).json({ message: "Internal Server Error", error: err });
//         }
//     }

//     async updatePayment(req: Request, res: Response) {
//         try {
//             const { id } = req.params;
//             const updatedFields = req.body;
//             const success = await paymentservice.updatePayment(Number(id), updatedFields);
//             if (success) {
//                 res.status(200).json({ message: "Payment updated successfully" });
//             } else {
//                 res.status(400).json({ message: "Failed to update payment" });
//             }
//         } catch (err) {
//             res.status(500).json({ message: "Internal Server Error", error: err });
//         }
//     }

//     async deletePayment(req: Request, res: Response) {
//         try {
//             const { id } = req.params;
//             const success = await paymentservice.deletePayment(Number(id));
//             if (success) {
//                 res.status(200).json({ message: "Payment deleted successfully" });
//             } else {
//                 res.status(404).json({ message: "Payment not found" });
//             }
//         } catch (err) {
//             res.status(500).json({ message: "Internal Server Error", error: err });
//         }
//     }
// }

// export const paymentcontroller = new PaymentController();
import { Request, Response } from "express";
import { createPaymentUrl, verifyPayment } from "../services/payment_service";
import { orderService } from "../services/orders_service";

export const createOrderAndPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      user_id,
      receiver_name,
      receiver_phone,
      receiver_address,
      note,
      payment_method,
      items,
    } = req.body;

    const shippingInfo = {
      receiver_name,
      receiver_phone,
      receiver_address,
      note,
    };

    // Nếu service/model không cần payment_method, hãy bỏ tham số này
    const orderId = await orderService.createOrderWithItems(
      user_id,
      shippingInfo,
      items
    );

    // Lấy tổng tiền từ DB
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return void res.status(404).json({ message: "Order not found" });
    }

    if (payment_method === "VNPAY") {
      const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const paymentUrl = createPaymentUrl(
        orderId.toString(),
        Number(order.total_price), // Đảm bảo là số
        ipAddr as string
      );
      console.log("PaymentUrl: ", paymentUrl);
      return void res.status(200).json({
        message: "Redirect to VNPay",
        paymentUrl,
      });
    }

    return void res.status(201).json({
      message: "Order created successfully",
      orderId: orderId.toString(),
    });
  } catch (err: any) {
    console.error(err);
    return void res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const handleReturn = (req: Request, res: Response) => {
  console.log("VNPay callback query:", req.query);
  const isValid = verifyPayment(req.query as Record<string, any>);
  if (isValid) {
    res.status(200).json({ message: "Thanh toán thành công", data: req.query });
  } else {
    res.status(400).json({ message: "Sai chữ ký hoặc thanh toán thất bại" });
  }
};