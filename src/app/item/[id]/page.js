"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import QuantityButton from "../../components/QuantityButton";
import styles from './item.module.css';

export default function Item() {
    const router = useRouter();
    const [item, setItem] = useState(null);

    useEffect(() => {
      //get the item id from the URL
        const itemId = window.location.pathname.split('/').pop();
        
        const fetchItem = async () => {
            // try to get preloaded data from sessionStorage
            const preloadedData = sessionStorage.getItem(`preloaded-item-${itemId}`);
            
            if (preloadedData) {
                setItem(JSON.parse(preloadedData));
                return;
            }

            // if there is no preloaded data, fetch as normal
            const response = await fetch(`/api/items?id=${itemId}`);
            const data = await response.json();

            //if the item is not found, redirect to the shop page
            if (data.error) {
                router.push("/shop");
            } else {
                setItem(data);
            }
        };
        
        fetchItem();
    }, []);


    if (!item) return <div>Loading...</div>;

    return (
        <div className="container">
            <NavBar />
            <main className="mainContent">
                <h1 className={styles.itemHeader}>Item Info</h1>
                <div className={styles.itemContainer}>
                    <div className={styles.itemInfo}>
                        <img src={item.photo} alt={item.name} className={styles.itemImage} />
                        <div className={styles.itemDetails}>
                            <h2 className={styles.itemName}>{item.name}</h2>
                            <p className={styles.itemDescription}>{item.description}</p>
                            <p className={styles.itemPrice}>¥{item.price.toLocaleString()}</p>
                            <QuantityButton item={item} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}