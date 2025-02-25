'use client'
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

export default function Cart() {
    //TODO: Fix styling on this page and some others, add a - + button to change the quantity of each item
    const [cart, setCart] = useState([]);

    const getCart = async () => {
        const response = await fetch('/api/add-to-cart');
        const data = await response.json();

        let tempCart = [];
        //while the quantity is greater than 0, add the item to the cart
        for (const item of data.cart) {
            for (let i = 0; i < item.quantity; i++) {
                //have to change the cartItemId to a unique value
                tempCart.push({
                    ...item,
                    cartItemId: crypto.randomUUID(),
                });
            }
        }
        
        setCart(tempCart);
    }

    useEffect(() => {
        getCart();
    }, []);

    return (
        <div className="container">
            <NavBar />
            <main className="mainContent">
                <h1>Cart</h1>
                {cart.map((item) => (
                    <div key={item.cartItemId}>
                        <h2>{item.name}</h2>
                        <img src={item.photo} alt={item.name} />
                        <p>{item.description}</p>
                        <p>{item.price}</p>
                    </div>
                ))}
                <button onClick={() => alert("Checkout")}>Checkout</button>
            </main>
        </div>
    )
}