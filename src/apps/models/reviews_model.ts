import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Review } from "../interface";
import { dataBase } from "../../config/db";

class ReviewsModel {
  async findById(id: number): Promise<Review> {
    const [reviews] = await dataBase.query<Review[] & RowDataPacket[]>(
      "SELECT * FROM reviews WHERE id = ?",
      [id]
    );
    return reviews[0];
  }
  async getAllReviews() {
    const [reviews] = await dataBase.query<Review[] & RowDataPacket[]>(
      "SELECT * FROM reviews"
    );
    return reviews;
  }

  async createReview(newReview: Partial<Review>): Promise<number> {
    const { user_id, product_id, rating, comment } = newReview;

    const [result] = await dataBase.query(
      `INSERT INTO reviews (user_id, product_id, rating, comment, created_at) 
             VALUES (?, ?, ?, ?, NOW())`,
      [user_id, product_id, rating, comment]
    );

    return (result as ResultSetHeader & { insertId: number }).insertId;
  }

  async updateReview(
    id: number,
    updatedFields: Partial<Review>
  ): Promise<boolean> {
    const fields = Object.keys(updatedFields)
      .map((field) => `${field} =?`)
      .join(", ");
    const values = Object.values(updatedFields);
    values.push(id);

    const [result] = await dataBase.query(
      `UPDATE reviews SET ${fields} WHERE id = ?`,
      [...values]
    );

    return (
      (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0
    );
  }

  async deleteReview(id: number): Promise<boolean> {
    const [result] = await dataBase.query<ResultSetHeader>(
      "DELETE FROM reviews WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  async findByReviewName(name: string) {
    const [reviews] = await dataBase.query<Review[] & RowDataPacket[]>(
      "SELECT * FROM reviews WHERE name LIKE?",
      [`%${name}%`]
    );
    return reviews;
  }
}
export const reviewsModel = new ReviewsModel();