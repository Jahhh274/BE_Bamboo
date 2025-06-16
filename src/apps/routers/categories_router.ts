import express from 'express';
import { categoriescontroller } from '../controllers/categories_controller';

const categoryrouter = express.Router();

categoryrouter.get('/categories', categoriescontroller.getAllCategories);
categoryrouter.post('/category', categoriescontroller.createCategory);
categoryrouter.put('/category/:id', categoriescontroller.updateCategory);
categoryrouter.delete('/category/:id', categoriescontroller.deleteCategory);
categoryrouter.get('/category/:id', categoriescontroller.getCategoryById);
categoryrouter.get('/categories/search', categoriescontroller.searchCategoriesByKeyword);

export default categoryrouter;