import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { food_list as defaultFoodList } from "../../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState(defaultFoodList || []);

  const addToCart = async (itemId) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      } catch (err) {
        console.error("Add to cart error:", err);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems(prev => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      } catch (err) {
        console.error("Remove from cart error:", err);
      }
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;

    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = food_list.find(
          (item) => String(item._id) === String(itemId)
        );
        if (itemInfo) {
          total += itemInfo.price * cartItems[itemId];
        }
      }
    }
    return total;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      if (response.data && response.data.success && response.data.data?.length > 0) {
        setFoodList(response.data.data);
      }
    } catch (err) {
      console.log("Backend food list not reachable, using default menu:", err.message);
    }
  };

  const loadCartData = async (userToken) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token: userToken } }
      );
      if (response.data && response.data.cartData) {
        setCartItems(response.data.cartData);
      }
    } catch (err) {
      console.log("Cart data load error:", err.message);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []);

  return (
    <StoreContext.Provider value={{
      food_list,
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      getTotalCartAmount,
      url,
      token,
      setToken,
      fetchFoodList
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
