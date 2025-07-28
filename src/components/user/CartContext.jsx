import React, { createContext, useContext, useEffect, useState } from "react";

// Create context
export const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // update localStorage whenever cart changes
  useEffect(() => {
    if (cart.length > 0) {
      try {
        localStorage.setItem("cart", JSON.stringify(cart));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      if (!Array.isArray(prevCart)) {
        prevCart = [];
      }

      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem._id === item._id
      );
      if (existingItemIndex !== -1) {
        // If item exists, increase its count
        const newCart = prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, count: cartItem.count + 1 }
            : cartItem
        );
        console.log("Item count increased. Updated cart:", newCart); // Debugging
        return newCart;
      } else {
        const newItem = { ...item, count: 1 };
        const newCart = [...prevCart, newItem];
        return newCart;
      }
    });
  };

   const removeFromCart = (_id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== _id));
  };

  // Function to clear the cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Update item count
  const updateCartCount = (_id, count) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === _id ? { ...item, count: Math.max(count, 1) } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateCartCount, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => {
  return useContext(CartContext);
};
