import express from "express";
import { warehouseController } from "../controllers/warehouses_controller";

const warehouseRouter = express.Router();

// Lấy tất cả tồn kho
warehouseRouter.get("/warehouse", (req, res) => warehouseController.getAll(req, res));

warehouseRouter.get("/warehouse/all", (req, res) => warehouseController.getAllWarehouse(req, res));


export default warehouseRouter;
