"use client";

import { useRouter } from "next/navigation";
import NavBar from "./components/NavBar";
import { useState, useEffect } from "react";
import Item from "./components/Item";
import styles from './home.module.css';

export default function Home() {
  const router = useRouter();
  const [randomItems, setRandomItems] = useState([]);
  const [preloadedItems, setPreloadedItems] = useState({});

  useEffect(() => {
    const fetchRandomItems = async () => {
      const response = await fetch("/api/items");
      const data = await response.json();
      
      // Get two random items
      const shuffled = [...data.items].sort(() => 0.5 - Math.random());
      setRandomItems(shuffled.slice(0, 2));
    };
    fetchRandomItems();
  }, []);

  const handleRandomItemClick = (item) => {
    router.push(`/item/${item.id}`);
  };

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


  return (
    <div className="container">
      <NavBar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Welcome to the UNOFFICIAL Yakuza 0 Store!</h1>
          <p>This store features multiple items from the series.</p>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.imageContainer}>
            <img src="/images/kiryu.png" alt="Kiryu Kazuma" />
          </div>
          <div className={styles.itemSection}>
            <h2>Featured Items:</h2>
            <div className={styles.itemGrid}>
              {randomItems.map(item => (
                <Item 
                  key={item.id}
                  item={item} 
                  onClick={() => handleRandomItemClick(item)}
                  onHover={() => preloadItem(item.id)}
                />
              ))}
            </div>
            <button 
              className={styles.shopButton}
              onClick={() => router.push("/shop")}
            >
              Visit the main shop!
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
