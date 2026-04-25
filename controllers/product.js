const { success, error } = require("../utils/response");
const Product = require("../model/productModel");

// GET ALL PRODUCTS
const index = async (req, res) => {
    try {
        const result = await Product.getAllProducts();
        return success(res, result, "Products retrieved successfully");
    } catch (err) {
        return error(res, err.message, 500);
    }
};

// GET PRODUCT BY ID
const show = async (req, res) => {
    try {
        const result = await Product.getProductById(req.params.id);
        if (!result) {
            return error(res, "Product not found", 404);
        }
        return success(res, result, "Product retrieved successfully");
    } catch (err) {
        return error(res, err.message, 500);
    }
};

// INSERT PRODUCT
const createProduct = async (req, res) => {
    try {
        const { product, category } = req.body;

        // Basic validation
        if (!product || !category) {
            return error(res, "Product name and category are required", 400);
        }

        const result = await Product.createProduct(product, category);
        return success(res, { id: result.insertId }, "Product created successfully", 201);
    } catch (err) {
        return error(res, err.message, 500);
    }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const { product, category } = req.body;
        const { id } = req.params;

        // Basic validation
        if (!product || !category) {
            return error(res, "Product name and category are required", 400);
        }

        const result = await Product.updateProduct(id, product, category);
        if (result.affectedRows === 0) {
            return error(res, "Product not found", 404);
        }

        return success(res, { id }, "Product updated successfully");
    } catch (err) {
        return error(res, err.message, 500);
    }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Product.deleteProduct(id);
        if (result.affectedRows === 0) {
            return error(res, "Product not found", 404);
        }

        return success(res, null, "Product deleted successfully");
    } catch (err) {
        return error(res, err.message, 500);
    }
};

module.exports = {
    index,
    show,
    createProduct,
    updateProduct,
    deleteProduct,
};
