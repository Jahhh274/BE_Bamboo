import { reviewsModel } from "../models/reviews_model";
import { Review } from "../interface";

class ReviewsService {
    // Lấy tất cả đánh giá
    async getAllReviews(): Promise<Review[]> {
        return await reviewsModel.getAllReviews();
    }

    // Lấy đánh giá theo id
    async findById(id: number): Promise<Review | undefined> {
        return await reviewsModel.findById(id);
    }

    // Thêm đánh giá mới
    async createReview(newReview: Partial<Review>): Promise<number> {
        return await reviewsModel.createReview(newReview);
    }

    // Cập nhật đánh giá
    async updateReview(id: number, updatedFields: Partial<Review>): Promise<boolean> {
        return await reviewsModel.updateReview(id, updatedFields);
    }

    // Xóa đánh giá
    async deleteReview(id: number): Promise<boolean> {
        return await reviewsModel.deleteReview(id);
    }

    // Tìm kiếm đánh giá theo tên
    async findByReviewName(name: string): Promise<Review[]> {
        return await reviewsModel.findByReviewName(name);
    }
}

export const reviewsService = new ReviewsService();
