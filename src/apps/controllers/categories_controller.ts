import { categoriesservice } from './../services/categories_service';
import { Request, Response } from "express";

class categoriesController{
    async getAllCategories(req: Request, res: Response){
        try{
            const result = await categoriesservice.getAllCategories();
            res.status(200).json(result);
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
    async createCategory(req: Request, res: Response){
        try{
            const newCategory = req.body;
            const result = await categoriesservice.createCategory(newCategory);
            if(result){
                res.status(201).json({message: "Category created successfully", category: result});
            }else{
                res.status(400).json({message: "Failed to create category"});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async updateCategory(req: Request, res: Response): Promise<void>{
        try{
            const {id} = req.params;
            const categoryId = await categoriesservice.getCategoryById(Number(id));
            if (!categoryId) {
                res.status(404).json({ message: "Category not found" });
                return 
            }
            const updatedFields = req.body;
            const result = await categoriesservice.updateCategory(Number(id), updatedFields);
            if(result){
                res.status(200).json({message: "Category updated successfully"});
            }else{
                res.status(400).json({message: "Failed to update category"});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const categoryId = await categoriesservice.getCategoryById(Number(id));
            if (!categoryId) {
                res.status(404).json({ message: "Category not found" });
                return 
            }
            const result = await categoriesservice.deleteCategory(Number(id));
            if (result) {
                res.status(200).json({ message: "Category deleted successfully" });
            } else {
                res.status(404).json({ message: "Category not found" });
            }
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async getCategoryById(req: Request, res: Response){
            try{
                const {id} = req.params;
                const result = await categoriesservice.getCategoryById(Number(id));
                if(result){
                    res.status(200).json(result);
                }else{
                    res.status(404).json({message: "Category not found"});
                }
            }catch(err){
                res.status(500).json({ message: "Internal Server Error", error: err });
            }
        }

    async searchCategoriesByKeyword(req: Request, res: Response){
        try{
            const {keyword} = req.query;
            const result = await categoriesservice.searchCategoriesByKeyword(keyword as string);
            res.status(200).json(result);
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
}
export const categoriescontroller = new categoriesController();