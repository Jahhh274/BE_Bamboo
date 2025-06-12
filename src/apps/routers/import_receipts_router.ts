import express from 'express';
import { importReceiptsController } from '../controllers/import_receipts_controller';

const importreceiptrouter = express.Router();

// Lấy tất cả phiếu nhập
importreceiptrouter.get('/import_receipts', importReceiptsController.getAllReceipts);

// Lấy phiếu nhập theo ID
importreceiptrouter.get('/import_receipt/:id', importReceiptsController.getReceiptById);

// Tìm kiếm phiếu nhập theo khoảng ngày
importreceiptrouter.get('/import_receipts/search', importReceiptsController.searchReceiptsByDate);

// Tạo phiếu nhập mới
importreceiptrouter.post('/import_receipt', importReceiptsController.createReceipt);

// Cập nhật phiếu nhập
importreceiptrouter.put('/import_receipt/:id', importReceiptsController.updateReceipt);

// Xoá phiếu nhập
importreceiptrouter.delete('/import_receipt/:id', importReceiptsController.deleteReceipt);

export default importreceiptrouter;
