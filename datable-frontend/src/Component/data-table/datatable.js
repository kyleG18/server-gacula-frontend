import React, { useState, useEffect } from 'react';
import './datatable.css';
import api from '../../api/axios';

const DataTable = ({ initialData }) => {
  const [items, setItems] = useState(initialData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // New Tool Form State
  const [newTool, setNewTool] = useState({ name: '', brand: '', category: '', price: '' });

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Fetch from database on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/v1/products');
        const dbItems = res.data.data.map(item => ({
          id: item.id,
          name: item.product,
          category: item.category,
          brand: 'Standard',
          price: 50.00
        }));
        setItems(dbItems);
      } catch(err) {
        console.error("Error fetching", err);
      }
    };
    fetchProducts();
  }, []);

  // --- Logic: Dynamic Categories ---
  const categoriesList = ['All', ...new Set(items.map(item => item.category))];

  // --- Logic: Filtering ---
  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  // --- Logic: Pagination Calculations ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDisplayedItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // --- Logic: Sidebar Crypto Stats ---
  const totalValue = filteredItems.reduce((acc, item) => acc + Number(item.price), 0);
  const maxPrice = filteredItems.length > 0 ? Math.max(...filteredItems.map(i => i.price), 1) : 1;

  const generatePath = () => {
    if (filteredItems.length < 2) return "0,60 200,60";
    const width = 200;
    const height = 60;
    return filteredItems.map((item, i) => {
      const x = (i / (filteredItems.length - 1)) * width;
      const y = height - (item.price / maxPrice) * height;
      return `${x},${y}`;
    }).join(" ");
  };

  // --- Actions ---
  const toggleSelectAll = () => {
    if (selectedIds.length === currentDisplayedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentDisplayedItems.map(i => i.id));
    }
  };

  const deleteSelected = async () => {
    if (window.confirm(`Delete ${selectedIds.length} items?`)) {
      try {
        await Promise.all(selectedIds.map(id => api.delete(`/api/v1/products/${id}`)));
        const idsToRemove = new Set(selectedIds);
        setItems(items.filter(i => !idsToRemove.has(i.id)));
        setSelectedIds([]);
      } catch(err) { console.error(err); }
    }
  };

  const handleAddTool = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/v1/products', {
        product: newTool.name,
        category: newTool.category
      });
      const tool = { 
        ...newTool, 
        id: res.data.data.id, 
        price: parseFloat(newTool.price) || 0 
      };
      setItems([tool, ...items]);
      setIsModalOpen(false);
      setNewTool({ name: '', brand: '', category: '', price: '' });
    } catch(err) {
      console.error(err);
      alert("Failed to save to database");
    }
  };

  const handleSort = (direction) => {
    const sorted = [...items].sort((a, b) => {
      return direction === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    });
    setItems(sorted);
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      
      {/* SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">TOOLBOX PRO</div>
        
        <div className="sidebar-crypto-card">
          <p className="label">{activeCategory.toUpperCase()} ASSETS</p>
          <h3>${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
          <div className="crypto-chart">
            <svg viewBox="0 0 200 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cryptoGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline fill="url(#cryptoGrad)" points={`0,60 ${generatePath()} 200,60`} />
              <polyline fill="none" stroke="#10b981" strokeWidth="2" points={generatePath()} />
            </svg>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-title">Navigation</p>
          <button 
            className={`nav-item ${activeCategory === 'All' ? 'active' : ''}`} 
            onClick={() => setActiveCategory('All')}
          >
            📦 All Inventory
          </button>
          
          <p className="nav-section-title">Categories</p>
          {categoriesList.filter(c => c !== 'All').map(cat => (
            <button 
              key={cat}
              className={`nav-item ${activeCategory === cat ? 'active' : ''}`} 
              onClick={() => setActiveCategory(cat)}
            >
              🏷️ {cat}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="top-nav">
          <div className="nav-left">
            <button className="btn-toggle-sidebar" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
            <h1>{activeCategory === 'All' ? 'Main Inventory' : `${activeCategory}`}</h1>
          </div>
          <button className="btn-theme" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </header>

        <div className="content-area">
          <div className="top-toolbar">
            <div className="toolbar-group">
              <button className="btn-control add-btn" onClick={() => setIsModalOpen(true)}>+ Add Tool</button>
              
              <button className="btn-control" onClick={toggleSelectAll}>
                {selectedIds.length === currentDisplayedItems.length && currentDisplayedItems.length > 0 ? 'Deselect All' : 'Select All'}
              </button>
              
              {selectedIds.length > 0 && (
                <button className="btn-control delete-selected-btn" onClick={deleteSelected}>
                  Remove ({selectedIds.length})
                </button>
              )}
            </div>

            <div className="toolbar-group">
               <button className="btn-control" onClick={() => handleSort('asc')}>A-Z</button>
               <button className="btn-control" onClick={() => handleSort('desc')}>Z-A</button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th width="40">Select</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentDisplayedItems.map(item => (
                  <tr key={item.id} className={selectedIds.includes(item.id) ? 'row-selected' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(item.id)} 
                        onChange={() => setSelectedIds(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])} 
                      />
                    </td>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.brand}</td>
                    <td><span className="badge">{item.category}</span></td>
                    <td>${Number(item.price).toFixed(2)}</td>
                    <td>
                      <button className="text-red" onClick={async () => {
                        try {
                          await api.delete(`/api/v1/products/${item.id}`);
                          setItems(items.filter(i => i.id !== item.id));
                        } catch(err) { console.error(err); }
                      }}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredItems.length === 0 && (
              <div className="empty-state">No items found in this category.</div>
            )}
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="btn-pager" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                &larr; Previous
              </button>
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i + 1}
                    className={`page-num ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                className="btn-pager" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ADD TOOL MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>New Inventory Entry</h3>
            <form onSubmit={handleAddTool}>
              <input required placeholder="Tool Name" value={newTool.name} onChange={e => setNewTool({...newTool, name: e.target.value})} />
              <input required placeholder="Brand" value={newTool.brand} onChange={e => setNewTool({...newTool, brand: e.target.value})} />
              <input required placeholder="Category (e.g. Power Tools)" value={newTool.category} onChange={e => setNewTool({...newTool, category: e.target.value})} />
              <input required type="number" step="0.01" placeholder="Price" value={newTool.price} onChange={e => setNewTool({...newTool, price: e.target.value})} />
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="add-btn">Save Tool</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;