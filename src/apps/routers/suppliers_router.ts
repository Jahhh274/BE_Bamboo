import express from 'express';
import { supplierscontroller } from '../controllers/suppliers_controller';

const supplierrouter = express.Router();

supplierrouter.get('/suppliers', supplierscontroller.getAllSuppliers);
supplierrouter.post('/supplier', supplierscontroller.createSupplier);
supplierrouter.put('/supplier/:id', supplierscontroller.updateSupplier);
supplierrouter.delete('/supplier/:id', supplierscontroller.deleteSupplier);
supplierrouter.get('/supplier/:id', supplierscontroller.getSupplierById);
supplierrouter.get('/suppliers/search', supplierscontroller.searchSuppliersByKeyword);

export default supplierrouter;