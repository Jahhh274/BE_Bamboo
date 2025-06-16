import { suppliersmodel } from './../models/suppliers_model';
import { Supplier } from "../interface";

class suppliersService {
    async getAllSuppliers() {
        return await suppliersmodel.getAllSuppliers();
    }

    async createSupplier(newSupplier: Partial<Supplier>) : Promise<Supplier>{
        return await suppliersmodel.createSupplier(newSupplier);
    }

    async updateSupplier(id: number, updatedFields: Partial<Supplier>){
        return await suppliersmodel.updateSupplier(id, updatedFields);
    }

    async deleteSupplier(id: number){
        return await suppliersmodel.deleteSupplier(id);
    }

    async getSupplierById(id: number){
        return await suppliersmodel.findById(id);
    }

    async searchSuppliersByKeyword(keyword: string){
        return await suppliersmodel.searchSuppliersByKeyword(keyword);
    }
}

export const suppliersservice = new suppliersService();