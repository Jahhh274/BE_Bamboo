import express from "express";
import { warehouseController } from "../controllers/warehouses_controller";

const warehouseRouter = express.Router();

// Lấy tất cả tồn kho
warehouseRouter.get("/warehouses", (req, res) => warehouseController.getAll(req, res));

// Lấy tồn kho theo product_id (và size nếu có)
warehouseRouter.get("/warehouses/:product_id", (req, res) => warehouseController.findByProduct(req, res));

// Cập nhật tồn kho khi nhập hàng (hoặc khi cập nhật phiếu nhập)
warehouseRouter.post("/warehouse/update-stock", (req, res) => warehouseController.updateStock(req, res));

// Trừ tồn kho khi xóa phiếu nhập hoặc xuất kho
warehouseRouter.post("/warehouse/decrease-stock", (req, res) => warehouseController.decreaseStock(req, res));

// Xóa tồn kho theo id
warehouseRouter.delete("/warehouse/:id", (req, res) => warehouseController.deleteById(req, res));

export default warehouseRouter;
