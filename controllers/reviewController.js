import Review from "../models/review.js";
import { isAdmin } from "./userController.js";

export async function createReview(req, res) {
    if (req.user == null) {
        res.status(401).json({
            message: "You need to be logged in to leave a review."
        });
        return;
    }

    const { productId, rating, comment } = req.body;

    if (!productId || rating === undefined || !comment) {
        res.status(400).json({
            message: "Product ID, rating, and comment are required."
        });
        return;
    }

    const ratingNumber = Number(rating);
    if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
        res.status(400).json({
            message: "Rating must be a number between 1 and 5."
        });
        return;
    }

    try {
        const newReview = new Review({
            productId,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            image: req.user.image,
            rating: ratingNumber,
            comment
        });

        await newReview.save();

        res.status(201).json({
            message: "Review added successfully.",
            review: newReview
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding review"
        });
    }
}

export async function getReviewsByProduct(req, res) {
    try {
        const reviews = await Review.find({
            productId: req.params.productId,
            isApproved: true
        }).sort({ date: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching reviews"
        });
    }
}

export async function getAllReviews(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Access denied. Admins only."
        });
        return;
    }

    try {
        const reviews = await Review.find().sort({ date: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching reviews"
        });
    }
}

export async function deleteReview(req, res) {
    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    try {
        const review = await Review.findById(req.params.id);
        if (review == null) {
            res.status(404).json({
                message: "Review not found"
            });
            return;
        }

        if (req.user.isAdmin || req.user.email === review.email) {
            await Review.findByIdAndDelete(req.params.id);
            res.json({
                message: "Review deleted successfully"
            });
        } else {
            res.status(403).json({
                message: "Access denied. You can only delete your own reviews."
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error deleting review"
        });
    }
}

export async function toggleReviewApproval(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Access denied. Admins only."
        });
        return;
    }

    try {
        const review = await Review.findById(req.params.id);
        if (review == null) {
            res.status(404).json({
                message: "Review not found"
            });
            return;
        }

        review.isApproved = !review.isApproved;
        await review.save();

        res.json({
            message: `Review approval status updated. Approved: ${review.isApproved}`,
            review
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating review status"
        });
    }
}