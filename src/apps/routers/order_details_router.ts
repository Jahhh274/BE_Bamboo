import express from "express";
import { orderDetailController } from "../controllers/order_details_controller";

const orderdetailrouter = express.Router();

orderdetailrouter.get("/order_details/:id", orderDetailController.getOrderDetail);
orderdetailrouter.put("/order_details/:id", orderDetailController.updateOrderDetail);
orderdetailrouter.delete("/order_details/:id", orderDetailController.deleteOrderDetail);

export default orderdetailrouter;
