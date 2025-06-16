import { Request, Response } from "express";
import { suppliersservice } from "../services/suppliers_service";
import { RowDataPacket } from "mysql2";
import { dataBase } from "../../config/db";

class suppliersController {
    async getAllSuppliers(req: Request, res: Response) {
        try {
            const result = await suppliersservice.getAllSuppliers();
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async createSupplier(req: Request, res: Response): Promise<void> {
        try {
            const newSupplier = req.body;

            const phone_check = newSupplier.phone.trim();
            const email_check = newSupplier.email.trim();

            const [check] = await dataBase.query<RowDataPacket[]>('SELECT * FROM suppliers WHERE phone = ? OR email = ?',
                [phone_check, email_check]);

            if (check.length > 0) {
                res.status(400).json({ message: "Supplier with same phone or email already exists" });
                return;
            }

            const result = await suppliersservice.createSupplier({
                ...newSupplier,
                phone: phone_check,
                email: email_check,
            });
            if (result) {
                res.status(201).json({ message: "Supplier created successfully", supplier: result });
            } else {
                res.status(400).json({ message: "Failed to create supplier" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async updateSupplier(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updatedFields = req.body;

            const phone_check = updatedFields.phone.trim();
            const email_check = updatedFields.email.trim();

            const supplierId = await suppliersservice.getSupplierById(Number(id));

            if (!supplierId) {
                res.status(404).json({ message: "Supplier not found" });
                return;
            }

            const [check] = await dataBase.query<RowDataPacket[]>(
                'SELECT * FROM suppliers WHERE (phone = ? OR email = ?) AND id != ?',
                [phone_check, email_check, Number(id)]
            );

            if (check.length > 0) {
                res.status(400).json({ message: "Another supplier with same phone or email already exists" });
                return;
            }

            const result = await suppliersservice.updateSupplier(Number(id), {
                ...updatedFields,
                phone: phone_check,
                email: email_check,
            });

            if (result) {
                res.status(200).json({ message: "Supplier updated successfully" });
            } else {
                res.status(400).json({ message: "Failed to update supplier" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async deleteSupplier(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const supplierId = await suppliersservice.getSupplierById(Number(id));
            if (!supplierId) {
                res.status(404).json({ message: "Supplier not found" });
                return
            }
            const result = await suppliersservice.deleteSupplier(Number(id));
            if (result) {
                res.status(200).json({ message: "Supplier deleted successfully" });
            } else {
                res.status(404).json({ message: "Supplier not found" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async getSupplierById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await suppliersservice.getSupplierById(Number(id));
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "Supplier not found" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async searchSuppliersByKeyword(req: Request, res: Response) {
        try {
            const { keyword } = req.query;
            const result = await suppliersservice.searchSuppliersByKeyword(keyword as string);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
}

export const supplierscontroller = new suppliersController();