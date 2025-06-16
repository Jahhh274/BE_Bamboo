import express from "express";
import { reviewsController } from "../controllers/reviews_controller";

const reviewsRouter = express.Router();

// Lấy tất cả đánh giá
reviewsRouter.get("/reviews", (req, res) => reviewsController.getAllReviews(req, res));

// Lấy đánh giá theo id
reviewsRouter.get("/review/:id", (req, res) => reviewsController.findById(req, res));

// Thêm đánh giá mới
reviewsRouter.post("/review", (req, res) => reviewsController.createReview(req, res));

// Cập nhật đánh giá
reviewsRouter.put("/review/:id", (req, res) => reviewsController.updateReview(req, res));

// Xóa đánh giá
reviewsRouter.delete("/review/:id", (req, res) => reviewsController.deleteReview(req, res));

// Tìm kiếm đánh giá theo tên
reviewsRouter.get("/search/name", (req, res) => reviewsController.findByReviewName(req, res));

export default reviewsRouter;
