"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
                console.log("preloaded data", preloadedData);
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
            <nav className="navBar">
                <button onClick={() => router.push("/")}>Home</button>
                <button onClick={() => router.push("/shop")}>Shop</button>
                <div className="cart">
                    <button>Cart</button>
                </div>
            </nav>
            <main className="mainContent">
                <h1>Item Info</h1>
                <div className="itemInfo">
                <h2>{item.name}</h2>
                <img src={item.photo} alt={item.name} />
                <p>{item.description}</p>
                <p>{item.price}</p>
                </div>
                <button>Add to Cart</button>
            </main>
        </div>
    );
}