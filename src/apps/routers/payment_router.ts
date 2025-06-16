import express from 'express';
import { paymentcontroller } from '../controllers/payments_controller';

const paymentrouter = express.Router();

paymentrouter.get('/payments', paymentcontroller.getAllPayments);
paymentrouter.post('/payment', paymentcontroller.createPayment);
paymentrouter.get('/payment/:id', paymentcontroller.getPaymentById);
paymentrouter.put('/payment/:id', paymentcontroller.updatePayment);
paymentrouter.delete('/payment/:id', paymentcontroller.deletePayment);

export default paymentrouter;
