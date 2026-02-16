import express from "express";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter.js";
import authenticateUser from "./middlewares/authentication.js";
import productRouter from "./routers/productRouter.js";

const app = express();

const mongodbURI = "mongodb+srv://admin:1234@cluster0.xuujurc.mongodb.net/icomputers?appName=Cluster0"

mongoose.connect(mongodbURI).then(
    ()=>{
        console.log("Connected to MongoDB");
    }
)

app.use( express.json() )

app.use(authenticateUser)

app.use("/users",userRouter)
app.use("/products",productRouter)

app.listen(3000, (req,res) => {
    console.log("Server is running on port 3000");
});