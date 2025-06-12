import { Category } from "../interface";
import { catergoriesmodel } from "../models/categories_model";

class categoriesService {
    async getAllCategories() {
        return await catergoriesmodel.getAllCategories();
    }

    async createCategory(newCategory: Partial<Category>) : Promise<Category>{
        return await catergoriesmodel.createCategory(newCategory);
    }

    async updateCategory(id: number, updatedFields: Partial<Category>){
        return await catergoriesmodel.updateCategory(id, updatedFields);
    }

    async deleteCategory(id: number){
        return await catergoriesmodel.deleteCategory(id);
    }

    async getCategoryById(id: number){
        return await catergoriesmodel.findById(id);
    }

    async searchCategoriesByKeyword(keyword: string){
        return await catergoriesmodel.searchCategoriesByKeyword(keyword);
    }
}

export const categoriesservice = new categoriesService();