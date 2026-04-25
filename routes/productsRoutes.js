const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");

// GET route to fetch all products
router.get("/products", productController.index);

// GET route to fetch a single product by ID
router.get("/products/:id", productController.show);

// POST route to insert product
router.post("/products", productController.createProduct);

// PUT route to update product
router.put("/products/:id", productController.updateProduct);

// DELETE route to delete product
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;