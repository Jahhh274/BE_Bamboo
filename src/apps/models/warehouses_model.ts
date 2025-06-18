import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Warehouse } from "../interface";
import { dataBase } from "../../config/db";



class WarehouseModel {
    // Lấy tất cả tồn kho
    async getAll(): Promise<Warehouse[]> {
        const [rows] = await dataBase.query<RowDataPacket[]>("SELECT * FROM warehouse");
        return rows as Warehouse[];
    }

    // Lấy tồn kho theo product_id
    async getAllWarehouse(): Promise<Warehouse[]> {
    const [rows] = await dataBase.query<RowDataPacket[]>(
        `SELECT 
            w.*, 
            ir.price_import
         FROM 
            warehouse w
         LEFT JOIN (
             SELECT 
                 product_id, 
                 price_import
             FROM 
                 import_receipts
             WHERE (product_id, id) IN (
                 SELECT 
                     product_id, MAX(id) 
                 FROM 
                     import_receipts 
                 GROUP BY 
                     product_id
             )
         ) ir ON w.product_id = ir.product_id`
    );

    return rows as Warehouse[];
}


}

export const warehouseModel = new WarehouseModel();
