import { Request, Response } from "express";
import { importReceiptsService } from "../services/import_receipts_service";

class ImportReceiptsController {
    async getAllReceipts(req: Request, res: Response): Promise<void> {
        try {
            const result = await importReceiptsService.getAllReceipts();
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async createReceipt(req: Request, res: Response): Promise<void> {
        try {
            const newReceipt = req.body;
            const result = await importReceiptsService.createReceipt(newReceipt);
            if (result) {
                res.status(201).json({ message: "Import receipt created successfully", receipt: result });
            } else {
                res.status(400).json({ message: "Failed to create import receipt" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async updateReceipt(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const receipt = await importReceiptsService.getReceiptById(Number(id));
            if (!receipt) {
                res.status(404).json({ message: "Import receipt not found" });
                return;
            }

            const updatedFields = req.body;
            const result = await importReceiptsService.updateReceipt(Number(id), updatedFields);

            if (result) {
                res.status(200).json({ message: "Import receipt updated successfully" });
            } else {
                res.status(400).json({ message: "Failed to update import receipt" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async deleteReceipt(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const receipt = await importReceiptsService.getReceiptById(Number(id));
            if (!receipt) {
                res.status(404).json({ message: "Import receipt not found" });
                return;
            }

            const result = await importReceiptsService.deleteReceipt(Number(id));
            if (result) {
                res.status(200).json({ message: "Import receipt deleted successfully" });
            } else {
                res.status(400).json({ message: "Failed to delete import receipt" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async getReceiptById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const result = await importReceiptsService.getReceiptById(Number(id));
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "Import receipt not found" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async searchReceiptsByDate(req: Request, res: Response): Promise<void> {
        try {
            const { from, to } = req.query;

            if (!from || !to) {
                res.status(400).json({ message: "Missing 'from' or 'to' query parameters" });
                return;
            }

            const result = await importReceiptsService.searchReceiptsByDate(from as string, to as string);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
}

export const importReceiptsController = new ImportReceiptsController();
