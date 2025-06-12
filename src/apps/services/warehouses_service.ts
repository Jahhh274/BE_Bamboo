import { warehouseModel } from "../models/warehouses_model";
import { Warehouse } from "../interface";

class WarehouseService {
    // Lấy tất cả tồn kho
    async getAll(): Promise<Warehouse[]> {
        return await warehouseModel.getAll();
    }

    // Lấy tồn kho theo product_id (và size nếu có)
    async findByProduct(product_id: number, size?: string): Promise<Warehouse | null> {
        return await warehouseModel.findByProduct(product_id, size);
    }

    // Cập nhật tồn kho khi nhập hàng (hoặc khi cập nhật phiếu nhập)
    async updateStock(product_id: number, size: string, quantity: number, price_import: number): Promise<void> {
        await warehouseModel.updateStock(product_id, size, quantity, price_import);
    }

    // Trừ tồn kho khi xóa phiếu nhập hoặc xuất kho
    async decreaseStock(product_id: number, size: string, quantity: number): Promise<void> {
        await warehouseModel.decreaseStock(product_id, size, quantity);
    }

    // Xóa tồn kho theo id
    async deleteById(id: number): Promise<boolean> {
        return await warehouseModel.deleteById(id);
    }
}

export const warehouseService = new WarehouseService();
