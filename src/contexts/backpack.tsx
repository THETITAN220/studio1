"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Material } from "@/lib/types";

interface BackpackContextType {
  backpackItems: Material[];
  addToBackpack: (item: Material) => void;
  removeFromBackpack: (itemId: string) => void;
  isItemInBackpack: (itemId: string) => boolean;
}

const BackpackContext = createContext<BackpackContextType | undefined>(undefined);

export const BackpackProvider = ({ children }: { children: React.ReactNode }) => {
  const [backpackItems, setBackpackItems] = useState<Material[]>([]);

  useEffect(() => {
    const storedItems = localStorage.getItem("backpackItems");
    if (storedItems) {
      setBackpackItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    if (backpackItems.length > 0) {
      localStorage.setItem("backpackItems", JSON.stringify(backpackItems));
    } else if (localStorage.getItem("backpackItems")) {
       localStorage.removeItem("backpackItems");
    }
  }, [backpackItems]);

  const addToBackpack = (item: Material) => {
    setBackpackItems((prevItems) => {
      if (!prevItems.find((i) => i.id === item.id)) {
        return [...prevItems, item];
      }
      return prevItems;
    });
  };

  const removeFromBackpack = (itemId: string) => {
    setBackpackItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const isItemInBackpack = (itemId: string) => {
    return backpackItems.some((item) => item.id === itemId);
  };

  return (
    <BackpackContext.Provider value={{ backpackItems, addToBackpack, removeFromBackpack, isItemInBackpack }}>
      {children}
    </BackpackContext.Provider>
  );
};

export const useBackpack = () => {
  const context = useContext(BackpackContext);
  if (!context) {
    throw new Error("useBackpack must be used within a BackpackProvider");
  }
  return context;
};
