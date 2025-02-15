"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Item from "../components/Item";

export default function Shop() {
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch("/api/items");
      const data = await response.json();
      setItems(data.items);
    };
    fetchItems();
  }, []);

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
        <h1>shop</h1>
        {items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </main>
    </div>
  );
}
