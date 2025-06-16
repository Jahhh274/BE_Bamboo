import { Payment } from "../interface";
import { paymentmodel } from "../models/payments_model";

class PaymentService {
    async getAllPayments(): Promise<Payment[]> {
        return await paymentmodel.getAllPayments();
    }

    async createPayment(newPayment: Partial<Payment>): Promise<Payment> {
        return await paymentmodel.createPayment(newPayment);
    }

    async findPaymentById(id: number): Promise<Payment | null> {
        return await paymentmodel.findById(id);
    }

    async updatePayment(id: number, updatedFields: Partial<Payment>): Promise<boolean> {
        return await paymentmodel.updatePayment(id, updatedFields);
    }

    async deletePayment(id: number): Promise<boolean> {
        return await paymentmodel.deletePayment(id);
    }
}

export const paymentservice = new PaymentService();
