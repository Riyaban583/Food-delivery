import React, { useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import { toast } from "react-toastify"
import { assets } from '../../assets/assets'

const List = ({ url = import.meta.env.VITE_API_URL || "https://food-delivery-9lr0.onrender.com" }) => {

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const fetchList = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${url}/api/food/list`)
      if (response.data.success) {
        setList(response.data.data)
      } else {
        toast.error("Error fetching food list")
      }
    } catch (err) {
      console.error(err)
      toast.error("Could not load foods")
    } finally {
      setLoading(false)
    }
  }

  const removeFood = async (foodId, foodName) => {
    if (!window.confirm(`Are you sure you want to delete "${foodName}" from the menu?`)) {
      return
    }

    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
      if (response.data.success) {
        toast.success(`"${foodName}" deleted successfully!`)
        await fetchList()
      } else {
        toast.error("Error removing food")
      }
    } catch (err) {
      toast.error("Failed to remove item")
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  // Filter list by category and search
  const filteredList = list.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className='menu-list-container'>
      {/* Header */}
      <div className="menu-list-header">
        <div>
          <h1 className="page-title">Food Menu Inventory</h1>
          <p className="page-subtitle">View, search and manage all food items currently live on your menu.</p>
        </div>

        <button onClick={fetchList} className="btn-refresh-list" title="Reload inventory">
          <span>🔄</span> Refresh
        </button>
      </div>

      {/* Control Bar: Search & Category Filter */}
      <div className="list-controls-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search dish by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="clear-search">✕</button>
          )}
        </div>

        <div className="filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-dropdown"
          >
            <option value="All">All Categories</option>
            <option value="Salad">Salad</option>
            <option value="Rolls">Rolls</option>
            <option value="Deserts">Deserts</option>
            <option value="Sandwich">Sandwich</option>
            <option value="Cake">Cake</option>
            <option value="Pure Veg">Pure Veg</option>
            <option value="Pasta">Pasta</option>
            <option value="Noodles">Noodles</option>
          </select>

          <span className="count-badge">
            Showing <strong>{filteredList.length}</strong> of {list.length} Dishes
          </span>
        </div>
      </div>

      {/* Food Table */}
      <div className="table-wrapper">
        <div className="menu-table-header">
          <span className="col-img">Photo</span>
          <span className="col-name">Dish Name</span>
          <span className="col-category">Category</span>
          <span className="col-price">Price</span>
          <span className="col-action">Action</span>
        </div>

        {loading ? (
          <div className="table-loading-state">
            <p>Loading dishes...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="table-empty-state">
            <p>No dishes match your search or filter.</p>
            {list.length === 0 && (
              <small>Click "Add New Item" from sidebar to populate dishes into your database!</small>
            )}
          </div>
        ) : (
          filteredList.map((item) => (
            <div key={item._id} className="menu-table-row">
              <div className="col-img">
                <img
                  src={
                    item.image?.startsWith('http') || item.image?.startsWith('/')
                      ? item.image
                      : `${url}/images/${item.image}`
                  }
                  alt={item.name}
                  className="table-dish-thumbnail"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = assets.parcel_icon
                  }}
                />
              </div>

              <div className="col-name">
                <strong className="dish-title">{item.name}</strong>
                {item.description && (
                  <small className="dish-short-desc">{item.description}</small>
                )}
              </div>

              <div className="col-category">
                <span className="category-pill">{item.category}</span>
              </div>

              <div className="col-price">
                <span className="dish-price-text">₹{item.price}</span>
              </div>

              <div className="col-action">
                <button
                  onClick={() => removeFood(item._id, item.name)}
                  className="btn-delete-dish"
                  title="Delete from menu"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default List
