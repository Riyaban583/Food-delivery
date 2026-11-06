import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {

  const { food_list } = useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>

      <div className="food-display-list">
        {food_list.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={item._id}          // ✅ unique key
                id={item._id}           // ✅ same id everywhere
                name={item.name}
                price={item.price}
                description={item.description}
                image={item.image}
              />
            )
          }
          return null
        })}
      </div>
    </div>
  )
}

export default FoodDisplay
