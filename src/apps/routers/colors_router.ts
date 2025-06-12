import express from 'express';
import { colorscontroller } from '../controllers/colors_controller';

const colorrouter = express.Router();

colorrouter.get('/colors', colorscontroller.getAllColors);
colorrouter.post('/color', colorscontroller.createColor);
colorrouter.put('/color/:id', colorscontroller.updateColor);
colorrouter.delete('/color/:id', colorscontroller.deleteColor);
colorrouter.get('/color/:id', colorscontroller.getColorById);
colorrouter.get('/colors/search', colorscontroller.searchColorsByKeyword);

export default colorrouter;