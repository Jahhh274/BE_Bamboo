import { Request, Response } from "express";
import { productsservice } from "../services/products_service";

class productsController {
    async getAllProducts(req: Request, res: Response){
        try{
            const result = await productsservice.getAllProducts();
            res.status(200).json(result);
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async createProduct(req: Request, res: Response){
        try{
            const newProduct = req.body;
            const result = await productsservice.createProduct(newProduct);
            if(result){
                res.status(201).json({message: "Product created successfully", product: result});
            }else{
                res.status(400).json({message: "Failed to create product"});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async updateProduct(req: Request, res: Response): Promise<void>{
        try{
            const {id} = req.params;
            const productId = await productsservice.getProductById(Number(id));
            if (!productId) {
                res.status(404).json({ message: "Product not found" });
                return 
            }
            const updatedFields = req.body;
            const result = await productsservice.updateProduct(Number(id), updatedFields);
            if(result){
                res.status(200).json({message: "Product updated successfully"});
            }else{
                res.status(400).json({message: "Failed to update product"});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async deleteProduct(req: Request, res: Response): Promise<void>{
        try{
            const {id} = req.params;
            const productId = await productsservice.getProductById(Number(id));
            if (!productId) {
                res.status(404).json({ message: "Product not found" });
                return 
            }
            const result = await productsservice.deleteProduct(Number(id));
            if(result){
                res.status(200).json({message: "Product deleted successfully"});
            }else{
                res.status(404).json({message: "Product not found"});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async getProductById(req: Request, res: Response){
        try{
            const {id} = req.params;
            const result = await productsservice.getProductById(Number(id));
            if(result){
                res.status(200).json(result);
            }else{
                res.status(404).json({message: "Product not found"});
            }
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    async searchProductsByKeyword(req: Request, res: Response){
        try{
            const { keyword } = req.query;
            const result = await productsservice.searchProductsByKeyword(keyword as string);
            res.status(200).json(result);
        }catch(err){
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }
}
export const productscontroller = new productsController();