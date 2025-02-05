import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
export const StoreContext = createContext(null);


export const StoreContextProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState({});
    const url = 'http://localhost:4000';
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [healthy_food, setHealthyFood] = useState([]);

    // add to card
    const addToCart = async (itemId) => {
        const newCartItems = { ...cartItems };
        if (!newCartItems[itemId]) {
            newCartItems[itemId] = 1;
        } else {
            newCartItems[itemId] += 1;
        }
        setCartItems(newCartItems);


        if (token) {
            await axios.post(
                `${url}/api/cart/add`,
                { itemId },
                { headers: { token } }
            );
        }
    };

    // Remove from cart 
    const removeFromCart = async (itemId) => {
        const newCartItems = { ...cartItems };
        if (newCartItems[itemId] > 0) {
            newCartItems[itemId] -= 1;
            if (newCartItems[itemId] === 0) {
                delete newCartItems[itemId];
            }
            setCartItems(newCartItems);

            if (token) {
                await axios.post(
                    `${url}/api/cart/remove`,
                    { itemId },
                    { headers: { token } }
                );
            }
        }
    };

    //  total cart amount
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = [...food_list, ...healthy_food].find(
                    (product) => product._id === item
                );
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    // Fetch food list
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    // Fetch healthy food list 
    const fetchHealthyFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/healthyfood/list`);
            setHealthyFood(response.data.data);
        } catch (error) {
            console.error("Error fetching healthy food list:", error);
        }
    };

    // Load cart data from the server
    const loadCartData = async (token) => {
        try {
            const response = await axios.post(
                `${url}/api/cart/get`,
                {},
                { headers: { token } }
            );
            setCartItems(response.data.cartData);
        } catch (error) {
            console.error("Error loading cart data:", error);
        }
    };

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            await fetchFoodList();
            await fetchHealthyFoodList();

            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken);
            }
        };
        loadData();
    }, []);

    return (
        <StoreContext.Provider
            value={{
                food_list,
                healthy_food,
                cartItems,
                addToCart,
                removeFromCart,
                getTotalCartAmount,
                url,
                token,
                setToken,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};
