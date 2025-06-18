import { warehouseModel } from "../models/warehouses_model";
import { Warehouse } from "../interface";

class WarehouseService {
    // Lấy tất cả tồn kho
    async getAll(): Promise<Warehouse[]> {
        return await warehouseModel.getAll();
    }
    async getAllWarehouse(): Promise<Warehouse[]> {
        return await warehouseModel.getAllWarehouse();
    }

}

export const warehouseService = new WarehouseService();
