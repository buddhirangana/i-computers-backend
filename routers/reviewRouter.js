import express from 'express';
import { createReview, getReviewsByProduct, getAllReviews, deleteReview, toggleReviewApproval } from '../controllers/reviewController.js';

const reviewRouter = express.Router();

reviewRouter.get("/product/:productId", getReviewsByProduct);
reviewRouter.post("/", createReview);
reviewRouter.delete("/:id", deleteReview);
reviewRouter.get("/", getAllReviews);
reviewRouter.put("/:id/approve", toggleReviewApproval);

export default reviewRouter;