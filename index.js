import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routers/userRouter.js';
import authenticateUser from './middlewares/authentication.js';
import productRouter from './routers/productRouter.js';

// Create an Express application
const app = express();

// MongoDB connection URI
const mongodbURI = "mongodb+srv://admin:1234@cluster0.xuujurc.mongodb.net/icomputers?appName=Cluster0";

// Connect to MongoDB
mongoose.connect(mongodbURI).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/users", userRouter);
app.use("/products", productRouter);

app.use(authenticateUser);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})