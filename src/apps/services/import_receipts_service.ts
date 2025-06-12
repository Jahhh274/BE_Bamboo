import { ImportReceipt } from "../interface";
import { importReceiptsModel } from "../models/import_receipts_model";

class ImportReceiptsService {
    async getAllReceipts(): Promise<ImportReceipt[]> {
        return await importReceiptsModel.getAllReceipts();
    }

    async createReceipt(newReceipt: Partial<ImportReceipt>): Promise<ImportReceipt> {
        return await importReceiptsModel.createReceipt(newReceipt);
    }

    async updateReceipt(id: number, updatedFields: Partial<ImportReceipt>): Promise<boolean> {
        return await importReceiptsModel.updateReceipt(id, updatedFields);
    }

    async deleteReceipt(id: number): Promise<boolean> {
        return await importReceiptsModel.deleteReceipt(id);
    }

    async getReceiptById(id: number): Promise<ImportReceipt | null> {
        return await importReceiptsModel.findById(id);
    }

    async searchReceiptsByDate(from: string, to: string): Promise<ImportReceipt[]> {
        return await importReceiptsModel.searchReceiptsByDate(from, to);
    }
}

export const importReceiptsService = new ImportReceiptsService();
