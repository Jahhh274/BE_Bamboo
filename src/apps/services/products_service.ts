import { Product } from "../interface";
import { productsmodel } from "../models/products_model";

class productsService {
    async getAllProducts() {
        return await productsmodel.getAllProducts();
    }

    async createProduct(newProduct: Partial<Product>) : Promise<Product>{
        return await productsmodel.createProduct(newProduct);
    }

    async updateProduct(id: number, updatedFields: Partial<Product>){
        return await productsmodel.updateProduct(id, updatedFields);
    }

    async deleteProduct(id: number){
        return await productsmodel.deleteProduct(id);
    }

    async getProductById(id: number){
        return await productsmodel.findById(id);
    }

    async searchProductsByKeyword(keyword: string){
        return await productsmodel.searchProductsByKeyword(keyword);
    }
}

export const productsservice = new productsService();