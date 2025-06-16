import { Request, Response } from "express";
import { warehouseService } from "../services/warehouses_service";

class WarehouseController {
    // Lấy tất cả tồn kho
    async getAll(req: Request, res: Response) {
        try {
            const warehouses = await warehouseService.getAll();
            res.json(warehouses);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Lấy tồn kho theo product_id
    async findByProduct(req: Request, res: Response) {
        try {
            const product_id = Number(req.params.product_id);
            const warehouse = await warehouseService.findByProduct(product_id);
            if (!warehouse) {
                return res.status(404).json({ message: "Warehouse not found" });
            }
            res.json(warehouse);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Cập nhật tồn kho khi nhập hàng (hoặc khi cập nhật phiếu nhập)
    async updateStock(req: Request, res: Response) {
        try {
            const { product_id, quantity, price_import } = req.body;
            if (!product_id || !quantity || !price_import) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            await warehouseService.updateStock(product_id, quantity, price_import);
            res.json({ message: "Stock updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Trừ tồn kho khi xóa phiếu nhập hoặc xuất kho
    async decreaseStock(req: Request, res: Response) {
        try {
            const { product_id, quantity } = req.body;
            if (!product_id || !quantity) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            await warehouseService.decreaseStock(product_id, quantity);
            res.json({ message: "Stock decreased successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Xóa tồn kho theo id
    async deleteById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const success = await warehouseService.deleteById(id);
            if (!success) {
                return res.status(404).json({ message: "Warehouse not found" });
            }
            res.json({ message: "Warehouse deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Lấy thông tin tồn kho tổng hợp từ bảng product và import_receipt
    async getFullWarehouseInfo(req: Request, res: Response) {
        try {
            const info = await warehouseService.getFullWarehouseInfo();
            res.json(info);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }
}

export const warehouseController = new WarehouseController();
