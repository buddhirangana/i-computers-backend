import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, searchProducts, updateProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", getAllProducts)
productRouter.post("/", createProduct)
productRouter.get("/search/:query" ,searchProducts)
productRouter.delete("/:productId",deleteProduct)
productRouter.put("/:productId", updateProduct)
productRouter.get("/:productId", getProductById)


export default productRouter;