import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Access denied. Admins only.",
        });
        return;
    }

    try {
        const existingProduct = await Product.findOne({
            productId: req.body.productId

        });

        if (existingProduct != null) {
            res.status(400).json({
                message: "Product with the same productId already exists."
            });
            return;
        }

        const newProduct = new Product({
            productId: req.body.productId,
            name: req.body.name,
            altNames: req.body.altNames,
            price: req.body.price,
            labeledPrice: req.body.labeledPrice,
            description: req.body.description,
            images: req.body.images,
            brand: req.body.brand,
            model: req.body.model,
            category: req.body.category,
            stock: req.body.stock
        });

        await newProduct.save();

        res.status(201).json({
            message: "Product Created Successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error Creating Product"
        })
    }
}

export async function getAllProducts(req, res) {
    try {
        if (isAdmin(req)) {
            const products = await Product.find();
            res.json(products);
        } else {
            const products = await Product.find({ isAvailable: true });
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({
            message: "Error fetching products"
        })
    }
}

export async function deleteProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Access Denied. Admin only."
        })
        return;
    }

    try {
        await Product.deleteOne({
            productId: req.params.productId
        });
        res.json({
            message: "Product Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting product"
        });
    }

}

export async function updateProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Access Denied. Admin only."
        })
        return;
    }
    try {
        await Product.updateOne({
            productId: req.params.productId
        }, {
            name: req.body.name,
            altNames: req.body.altNames,
            price: req.body.price,
            labeledPrice: req.body.labeledPrice,
            description: req.body.description,
            images: req.body.images,
            brand: req.body.brand,
            model: req.body.model,
            category: req.body.category,
            stock: req.body.stock,
            isAvailable: req.body.isAvailable
        });
        res.json({
            message: "Product Updated Successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating product"
        });
    }
}

export async function getProductById(req, res) {
    try {
        const product = await Product.findOne({ productId: req.params.productId });
        if (product == null) {
            res.status(404).json({
                message: "Product Not Found"
            });
        } else {
            if (product.isAvailable) {
                res.json(product);
            } else {
                if (isAdmin(req)) {
                    res.json(product);
                } else {
                    res.status(404).json({
                        message: "Product Not Found"
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Error fetching product"
        })
    }
}