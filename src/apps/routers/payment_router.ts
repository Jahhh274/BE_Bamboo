// import express from 'express';
// import { paymentcontroller } from '../controllers/payments_controller';

// const paymentrouter = express.Router();

// paymentrouter.get('/payments', paymentcontroller.getAllPayments);
// paymentrouter.post('/payment', paymentcontroller.createPayment);
// paymentrouter.get('/payment/:id', paymentcontroller.getPaymentById);
// paymentrouter.put('/payment/:id', paymentcontroller.updatePayment);
// paymentrouter.delete('/payment/:id', paymentcontroller.deletePayment);

// export default paymentrouter;
import { Router } from "express";
import express from "express";
import {
  createOrderAndPayment,
  handleReturn,
} from "../controllers/payments_controller";

const router = express.Router();

router.post("/create_payment", createOrderAndPayment);
router.get("/vnpay_return", handleReturn);

export const routers = (app: Router) => {
  app.use("/api", router);
};

export default router;