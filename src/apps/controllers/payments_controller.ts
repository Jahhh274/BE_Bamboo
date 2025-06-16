import { Request, Response } from "express";
import { paymentservice } from "../services/payment_service";

class PaymentController {
    async getAllPayments(req: Request, res: Response) {
        try {
            const payments = await paymentservice.getAllPayments();
            res.status(200).json(payments);
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async createPayment(req: Request, res: Response) {
        try {
            const newPayment = req.body;
            const createdPayment = await paymentservice.createPayment(newPayment);
            res.status(201).json({ message: "Payment created successfully", payment: createdPayment });
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async getPaymentById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const payment = await paymentservice.findPaymentById(Number(id));
            if (payment) {
                res.status(200).json(payment);
            } else {
                res.status(404).json({ message: "Payment not found" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async updatePayment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updatedFields = req.body;
            const success = await paymentservice.updatePayment(Number(id), updatedFields);
            if (success) {
                res.status(200).json({ message: "Payment updated successfully" });
            } else {
                res.status(400).json({ message: "Failed to update payment" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async deletePayment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const success = await paymentservice.deletePayment(Number(id));
            if (success) {
                res.status(200).json({ message: "Payment deleted successfully" });
            } else {
                res.status(404).json({ message: "Payment not found" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
}

export const paymentcontroller = new PaymentController();
