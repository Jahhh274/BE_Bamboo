import { RowDataPacket } from 'mysql2';
import { Request, Response } from "express";
import { dataBase } from '../../config/db';
import { colorsservice } from '../services/colors_service';

class colorsController {
    async getAllColors(req: Request, res: Response) {
        try {
            const result = await colorsservice.getAllColors();
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
    async createColor(req: Request, res: Response) {
        try {
            const newColor = req.body;

            const name_check = newColor.name.trim();

            const [check] = await dataBase.query<RowDataPacket[]>('SELECT * FROM colors WHERE name = ?',
                [name_check]);

            if (check.length > 0) {
                res.status(400).json({ message: "Color with same name already exists" });
                return;
            }

            const result = await colorsservice.createColor({
                ...newColor,
                name: name_check,
            });
            if (result) {
                res.status(201).json({ message: "Color created successfully", color: result });
            } else {
                res.status(400).json({ message: "Failed to create color" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async updateColor(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updatedFields = req.body;

            const name_check = updatedFields.name.trim();

            const colorId = await colorsservice.getColorById(Number(id));

            if (!colorId) {
                res.status(404).json({ message: "Color not found" });
                return;
            }

            const [check] = await dataBase.query<RowDataPacket[]>(
                'SELECT * FROM colors WHERE (name = ?) AND id != ?',
                [name_check, Number(id)]
            );

            if (check.length > 0) {
                res.status(400).json({ message: "Another color with same name already exists" });
                return;
            }

            const result = await colorsservice.updateColor(Number(id), {
                ...updatedFields,
                name: name_check,
            });

            if (result) {
                res.status(200).json({ message: "Color updated successfully" });
            } else {
                res.status(400).json({ message: "Failed to update color" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async deleteColor(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const colorId = await colorsservice.getColorById(Number(id));
            if (!colorId) {
                res.status(404).json({ message: "Color not found" });
                return
            }
            const result = await colorsservice.deleteColor(Number(id));
            if (result) {
                res.status(200).json({ message: "Color deleted successfully" });
            } else {
                res.status(404).json({ message: "Color not found" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async getColorById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await colorsservice.getColorById(Number(id));
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "Color not found" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async searchColorsByKeyword(req: Request, res: Response) {
        try {
            const { keyword } = req.query;
            const result = await colorsservice.searchColorsByKeyword(keyword as string);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
}

export const colorscontroller = new colorsController();