import express from 'express';
import { productscontroller } from "../controllers/products_controller";

const productrouter = express.Router();

productrouter.get('/products', productscontroller.getAllProducts);
productrouter.post('/product', productscontroller.createProduct);
productrouter.put('/product/:id', productscontroller.updateProduct);
productrouter.delete('/product/:id', productscontroller.deleteProduct);
productrouter.get('/product/:id', productscontroller.getProductById);
productrouter.get('/products/search', productscontroller.searchProductsByKeyword);

export default productrouter;

