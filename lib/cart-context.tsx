"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from "react";
import type { CartItem, Cart } from "@/types";
import { dummySiteSettings } from "./dummy-data";

interface CartContextType extends Cart {
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  isHydrated: boolean;
  cartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((i) => i.productId === action.payload.productId);
      if (existing) {
        return state.map((i) =>
          i.productId === action.payload.productId
            ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
            : i
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "REMOVE_ITEM":
      return state.filter((i) => i.productId !== action.payload);
    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return state.filter((i) => i.productId !== action.payload.productId);
      }
      return state.map((i) =>
        i.productId === action.payload.productId
          ? {
              ...i,
              quantity: Math.min(action.payload.quantity, i.stock),
            }
          : i
      );
    case "CLEAR_CART":
      return [];
    case "LOAD_CART":
      return action.payload;
    default:
      return state;
  }
}

function computeCart(items: CartItem[]): Cart {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryCharge =
    dummySiteSettings.freeDeliveryMin && subtotal >= dummySiteSettings.freeDeliveryMin
      ? 0
      : items.length > 0
      ? dummySiteSettings.deliveryCharge
      : 0;
  return {
    items,
    subtotal,
    deliveryCharge,
    total: subtotal + deliveryCharge,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const openCartDrawer  = useCallback(() => setCartDrawerOpen(true), []);
  const closeCartDrawer = useCallback(() => setCartDrawerOpen(false), []);

  // Load from localStorage on mount — set isHydrated after loading
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sh_cart");
      if (saved) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
      }
    } catch {
      // ignore
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage only after hydration to avoid overwriting saved cart on first mount
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("sh_cart", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, isHydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const cart = computeCart(items);
  const itemCount = items.length;

  return (
    <CartContext.Provider
      value={{ ...cart, addItem, removeItem, updateQuantity, clearCart, itemCount, isHydrated, cartDrawerOpen, openCartDrawer, closeCartDrawer }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
