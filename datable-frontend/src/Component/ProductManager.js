import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ product: "", category: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch products when the component loads
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/v1/products");
      setProducts(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      setProducts([]);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product || !formData.category) return alert("Please fill all fields");

    try {
      if (editingId) {
        // UPDATE existing product
        await api.put(`/api/v1/products/${editingId}`, formData);
        setEditingId(null);
      } else {
        // CREATE new product
        await api.post("/api/v1/products", formData);
      }
      // Clear form and refresh list
      setFormData({ product: "", category: "" });
      fetchProducts();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
    }
  };

  // Handle setting a product up for editing
  const handleEdit = (product) => {
    setFormData({ product: product.product, category: product.category });
    setEditingId(product.id);
  };

  // Handle deleting a product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await api.delete(`/api/v1/products/${id}`);
      fetchProducts(); // Refresh list after deletion
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Product Manager</h2>
      
      {/* --- FORM SECTION --- */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
        
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Product Name:</label>
          <input
            type="text"
            name="product"
            value={formData.product}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        
        <button type="submit" style={{ padding: "10px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}>
          {editingId ? "Update Product" : "Save Product"}
        </button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => { setEditingId(null); setFormData({ product: "", category: "" }); }}
            style={{ marginLeft: "10px", padding: "10px 15px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* --- LIST SECTION --- */}
      <h3>Product List</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd", textAlign: "left" }}>ID</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd", textAlign: "left" }}>Product</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd", textAlign: "left" }}>Category</th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: "15px", textAlign: "center" }}>No products found.</td>
            </tr>
          ) : (
            products.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{item.id}</td>
                <td style={{ padding: "10px" }}>{item.product}</td>
                <td style={{ padding: "10px" }}>{item.category}</td>
                <td style={{ padding: "10px" }}>
                  <button onClick={() => handleEdit(item)} style={{ marginRight: "5px", padding: "5px 10px", backgroundColor: "#ffc107", border: "none", borderRadius: "3px", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
