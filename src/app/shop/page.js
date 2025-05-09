"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Item from "../components/Item";
import NavBar from "../components/NavBar";
import styles from "./shop.module.css";

export default function Shop() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [preloadedItems, setPreloadedItems] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch("/api/items");
      const data = await response.json();
      setItems(data.items);
    };
    fetchItems();
  }, []);

  const handleItemClick = (item) => {
    router.push(`/item/${item.id}`);
  };

  // this will attempt to preload the item data in the sessionStorage. this will significantly speed up the page load time
  const preloadItem = async (itemId) => {
    // skip if already preloaded
    if (preloadedItems[itemId]) return;

    try {
      const response = await fetch(`/api/items?id=${itemId}`);
      const data = await response.json();
      

      setPreloadedItems(prev => ({
        ...prev,
        [itemId]: data
      }));
      
      // store data in sessionStorage
      sessionStorage.setItem(`preloaded-item-${itemId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error preloading item:', error);
    }
  };

  
  //potential TODO: add different sorting options
  return (
    <div className="container">
      <NavBar />
      <main className="mainContent">
        <h1 className={styles.shopHeader}>shop</h1>
        <div className={styles.shopContainer}>
          <div className={styles.itemContainer}>
            {items.map((item) => (
              <Item 
                key={item.id} 
                item={item} 
                onClick={() => handleItemClick(item)}
                onHover={() => preloadItem(item.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
