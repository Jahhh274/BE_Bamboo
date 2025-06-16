import { warehouseModel } from "../models/warehouses_model";
import { Warehouse } from "../interface";

class WarehouseService {
    // Lấy tất cả tồn kho
    async getAll(): Promise<Warehouse[]> {
        return await warehouseModel.getAll();
    }

    // Lấy tồn kho theo product_id
    async findByProduct(product_id: number): Promise<Warehouse | null> {
        return await warehouseModel.findByProduct(product_id);
    }

    // Cập nhật tồn kho khi nhập hàng (hoặc khi cập nhật phiếu nhập)
    async updateStock(product_id: number, quantity: number, price_import: number): Promise<void> {
        await warehouseModel.updateStock(product_id, quantity, price_import);
    }

    // Trừ tồn kho khi xóa phiếu nhập hoặc xuất kho
    async decreaseStock(product_id: number, quantity: number): Promise<void> {
        await warehouseModel.decreaseStock(product_id, quantity);
    }

    // Xóa tồn kho theo id
    async deleteById(id: number): Promise<boolean> {
        return await warehouseModel.deleteById(id);
    }

    // Lấy thông tin tồn kho tổng hợp từ bảng product và import_receipt
    async getFullWarehouseInfo(): Promise<
        { product_id: number; product_name: string; selling_price: number; quantity: number }[]
    > {
        return await warehouseModel.getFullWarehouseInfo();
    }
}

export const warehouseService = new WarehouseService();
