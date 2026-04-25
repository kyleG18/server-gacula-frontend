const db = require("../config/db");

// GET all products
exports.getAllProducts = async () => {
    const [rows] = await db.promise().query("SELECT * FROM tblproducts");
    return rows;
};

// GET product by ID
exports.getProductById = async (id) => {
    const [rows] = await db.promise().query("SELECT * FROM tblproducts WHERE id = ?", [id]);
    return rows[0];
};

// INSERT product
exports.createProduct = async (product, category) => {
    const [result] = await db.promise().query(
        "INSERT INTO tblproducts (product, category) VALUES (?, ?)",
        [product, category]
    );
    return result;
};

// UPDATE product
exports.updateProduct = async (id, product, category) => {
    const [result] = await db.promise().query(
        "UPDATE tblproducts SET product = ?, category = ? WHERE id = ?",
        [product, category, id]
    );
    return result;
};

// DELETE product
exports.deleteProduct = async (id) => {
    const [result] = await db.promise().query(
        "DELETE FROM tblproducts WHERE id = ?",
        [id]
    );
    return result;
};