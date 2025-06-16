import { Color } from "../interface";
import { colorsmodel } from "../models/colors_model";

class colorsService {
    async getAllColors() {
        return await colorsmodel.getAllColors();
    }

    async createColor(newColor: Partial<Color>) : Promise<Color>{
        return await colorsmodel.createColor(newColor);
    }

    async updateColor(id: number, updatedFields: Partial<Color>){
        return await colorsmodel.updateColor(id, updatedFields);
    }

    async deleteColor(id: number){
        return await colorsmodel.deleteColor(id);
    }

    async getColorById(id: number){
        return await colorsmodel.findById(id);
    }

    async searchColorsByKeyword(keyword: string){
        return await colorsmodel.searchColorsByKeyword(keyword);
    }
}

export const colorsservice = new colorsService();