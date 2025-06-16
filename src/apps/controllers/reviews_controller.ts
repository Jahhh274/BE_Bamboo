import { Request, Response } from "express";
import { reviewsService } from "../services/reviews_service";

class ReviewsController {
    // Lấy tất cả đánh giá
    async getAllReviews(req: Request, res: Response) {
        try {
            const reviews = await reviewsService.getAllReviews();
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Lấy đánh giá theo id
    async findById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const review = await reviewsService.findById(id);
            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }
            res.json(review);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Thêm đánh giá mới
    async createReview(req: Request, res: Response) {
        try {
            const { user_id, product_id, rating, comment } = req.body;
            if (!user_id || !product_id || !rating) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const reviewId = await reviewsService.createReview({ user_id, product_id, rating, comment });
            res.status(201).json({ message: "Review created successfully", reviewId });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Cập nhật đánh giá
    async updateReview(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const updatedFields = req.body;
            const success = await reviewsService.updateReview(id, updatedFields);
            if (!success) {
                return res.status(404).json({ message: "Review not found" });
            }
            res.json({ message: "Review updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Xóa đánh giá
    async deleteReview(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const success = await reviewsService.deleteReview(id);
            if (!success) {
                return res.status(404).json({ message: "Review not found" });
            }
            res.json({ message: "Review deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }

    // Tìm kiếm đánh giá theo tên
    async findByReviewName(req: Request, res: Response) {
        try {
            const name = req.query.name as string;
            if (!name) {
                return res.status(400).json({ message: "Missing name query parameter" });
            }
            const reviews = await reviewsService.findByReviewName(name);
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    }
}

export const reviewsController = new ReviewsController();
