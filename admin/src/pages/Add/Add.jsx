import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify' 

const Add = ({ url = import.meta.env.VITE_API_URL || "http://localhost:4000" }) => {

  const [image, setImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad"
  })

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    if (!image) {
      toast.warning("Please upload a food image")
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("description", data.description)
      formData.append("price", Number(data.price))
      formData.append("category", data.category)
      formData.append("image", image)

      const response = await axios.post(`${url}/api/food/add`, formData)

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad"
        })
        setImage(false)
        toast.success(response.data.message || "Food dish added successfully! 🎉")
      } else {
        toast.error(response.data.message || "Failed to add dish")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className='add-dish-container'>
      <div className="add-dish-header">
        <h1 className="page-title">Add New Food Item</h1>
        <p className="page-subtitle">Publish a new dish to your NukkadEats customer menu.</p>
      </div>

      <div className="add-dish-card">
        <form onSubmit={onSubmitHandler} className="add-dish-form">

          {/* Image Upload Area */}
          <div className="form-group upload-group">
            <label className="form-label">Dish Image</label>
            <label htmlFor="food-image-input" className="image-dropzone">
              {image ? (
                <div className="preview-container">
                  <img src={URL.createObjectURL(image)} alt="Preview" className="preview-image" />
                  <span className="change-image-badge">Click to Change Image</span>
                </div>
              ) : (
                <div className="dropzone-placeholder">
                  <img src={assets.upload_area} alt="Upload" className="upload-icon-img" />
                  <div className="dropzone-text">
                    <strong>Click to upload dish photo</strong>
                    <small>Supports PNG, JPG, WebP</small>
                  </div>
                </div>
              )}
            </label>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="food-image-input"
              accept="image/*"
              hidden
              required
            />
          </div>

          {/* Dish Name & Category Row */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Dish Name</label>
              <input
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                name="name"
                placeholder="e.g. Paneer Butter Masala"
                required
                className="form-input"
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Category</label>
              <select
                onChange={onChangeHandler}
                name="category"
                value={data.category}
                className="form-select"
              >
                <option value="Salad">Salad</option>
                <option value="Rolls">Rolls</option>
                <option value="Deserts">Deserts</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Cake">Cake</option>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Pasta">Pasta</option>
                <option value="Noodles">Noodles</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Dish Description</label>
            <textarea
              onChange={onChangeHandler}
              value={data.description}
              name="description"
              rows="4"
              placeholder="Describe ingredients, taste, spices and portion size..."
              required
              className="form-textarea"
            />
          </div>

          {/* Price */}
          <div className="form-group price-group">
            <label className="form-label">Price (₹)</label>
            <div className="price-input-wrap">
              <span className="price-currency-tag">₹</span>
              <input
                onChange={onChangeHandler}
                value={data.price}
                type="number"
                name="price"
                placeholder="199"
                min="1"
                required
                className="form-input price-input"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-add-dish">
            {loading ? "Adding Dish..." : "Publish to Menu ✨"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Add
