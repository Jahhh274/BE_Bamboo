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

    async getAllWarehouse(req: Request, res: Response) {
        try {
            const warehouses = await warehouseService.getAllWarehouse();
            res.json(warehouses);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

}

export const warehouseController = new WarehouseController();
