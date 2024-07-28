"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from 'js-cookie';
const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export function CartProvider({ children }) {
  const token = Cookies.get('token');
  const [cartItems, setCartItems] = useState([]);
  const [total, settotal] = useState(0);
  useEffect(() => {
    if (token) {
      (async () => {
        try {
          const items = await fetch("api/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (items.ok) {
            const data = await items.json();
            setCartItems(data);
            console.log("Inside context cartitems", data);
          } else {
            console.error("Error while fetching the cart: " + items.statusText);
          }
        } catch (error) {
          console.error(
            "An unexpected error occurred while fetching the cart: " +
              error.message
          );
        }
      })();
    }
  }, [token]);



  const addToCart = async (item, productId) => {
    try {
      const existingItemIndex = cartItems.findIndex(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItemIndex !== -1) {
 
        cartItems[existingItemIndex].quantity += item.quantity;
      } else {

        cartItems.push(item);
      }

      const total = cartItems.reduce(
        (acc, cartItem) => acc + cartItem.price * cartItem.quantity,
        0
      );
      settotal(total);

      const requestData = {
        items: cartItems,
        total: total,
        productId: productId,
      };

      const method = existingItemIndex !== -1 ? "PUT" : "POST";

      const res = await fetch("api/cart", {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (res.ok) {
        toast.success("Book Added To Cart successfully");
        setCartItems(cartItems);
        // Update local storage
      } else {
        console.error("Error while adding item to cart.");
        toast.success("Book Added To Cart successfully");
      }
    } catch (error) {
      console.error("Error while adding item to cart ", error.message);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch("api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId,
        }),
      });

      if (res.status === 200) {
        const res2 = await res.json();
        console.log("After removing from cart", res2);
        setCartItems(res2.items);
        settotal(res2.total); 
        console.log("After removing from cart itemsssss", res2.items);
      } else {
        console.log("Error during removing data from cart:", res.statusText);
      }
    } catch (error) {
      console.log("Error during removing data from cart:", error.message);
    }
  };
  const incrementQuantity = async (productId) => {
    try {
      const res = await fetch("api/cart", {
        method: "Put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId,
        }),
      });

      if (res.status === 200) {
        const res2 = await res.json();
        console.log("After removing from cart", res2);
        setCartItems(res2.items);
        settotal(res2.total); 
        console.log("After removing from cart itemsssss", res2.items);
      } else {
        console.log("Error during removing data from cart:", res.statusText);
      }
    } catch (error) {
      console.log("Error during removing data from cart:", error.message);
    }
  };
  const decrementQuantity = async (productId) => {
    try {
      const res = await fetch("api/decrement", {
        method: "Put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId,
        }),
      });

      if (res.status === 200) {
        const res2 = await res.json();
        console.log("After removing from cart", res2);
        setCartItems(res2.items);
        settotal(res2.total); // Update cart items specifically
        console.log("After removing from cart itemsssss", res2.items);
      } else {
        console.log("Error during removing data from cart:", res.statusText);
      }
    } catch (error) {
      console.log("Error during removing data from cart:", error.message);
    }
  };


  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        calculateTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
