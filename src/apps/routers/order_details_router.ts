// import express from "express";
// import { orderDetailController } from "../controllers/order_details_controller";

// const orderdetailrouter = express.Router();

// orderdetailrouter.get("/order_details/:id", orderDetailController.getOrderDetail);
// orderdetailrouter.put("/order_details/:id", orderDetailController.updateOrderDetail);
// orderdetailrouter.delete("/order_details/:id", orderDetailController.deleteOrderDetail);

// export default orderdetailrouter;


import express from "express";
import { orderDetailController } from "../controllers/order_details_controller";

const orderdetailrouter = express.Router();

orderdetailrouter.get("/order_details/:id", orderDetailController.getOrderDetail);
orderdetailrouter.get("/order_detail/:id", orderDetailController.getById);
orderdetailrouter.get("/order_detail/user/:userId", orderDetailController.getByUserId);
orderdetailrouter.get("/order_detail/payment/:paymentId", orderDetailController.getByPaymentId);
orderdetailrouter.post("/order_detail/", orderDetailController.create);
orderdetailrouter.put("/order_detail/:id", orderDetailController.update);
orderdetailrouter.delete("/order_detail/:id", orderDetailController.delete);

export default orderdetailrouter;
