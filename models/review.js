import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "/images/default-profile.png"
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isApproved: {
        type: Boolean,
        default: true
    }
});

const Review = mongoose.model("Review", reviewSchema)
export default Review