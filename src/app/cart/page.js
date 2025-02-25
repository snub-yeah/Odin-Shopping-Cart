'use client'
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import styles from './cart.module.css';
import QuantityButton from "../components/QuantityButton";

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const getCart = async () => {
        const response = await fetch('/api/add-to-cart');
        const data = await response.json();
        let tempTotal = 0;

        let tempCart = [];
        //while the quantity is greater than 0, add the item to the cart
        for (const item of data.cart) {
            for (let i = 0; i < item.quantity; i++) {
                //have to change the cartItemId to a unique value
                tempCart.push({
                    ...item,
                    cartItemId: crypto.randomUUID(),
                });
                tempTotal += item.price;
            }
        }
        setTotal(tempTotal);
        setCart(tempCart);
    }

    useEffect(() => {
        getCart();
    }, []);

    return (
        <div className="container">
            <NavBar />
            <main className="mainContent">
                <div className={styles.cartContainer}>
                    <h1 className={styles.cartHeader}>Shopping Cart</h1>
                    <table className={styles.cartTable}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.reduce((acc, item) => {
                                const existingItem = acc.find(i => i.id === item.id);
                                if (existingItem) {
                                    existingItem.quantity += 1;
                                } else {
                                    acc.push({ ...item, quantity: 1 });
                                }
                                return acc;
                            }, []).map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className={styles.productCell}>
                                            <img src={item.photo} alt={item.name} className={styles.productImage} />
                                            <div className={styles.productInfo}>
                                                <span className={styles.productName}>{item.name}</span>
                                                <span>{item.description}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>¥{item.price.toLocaleString()}</td>
                                    <td>
                                        <QuantityButton item={item} />
                                    </td>
                                    <td>¥{(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h1 className={styles.cartHeader}>Total: ¥{total.toLocaleString()}</h1>
                    <button className={styles.checkoutButton} onClick={() => alert("Checkout")}>
                        Proceed to Checkout
                    </button>
                </div>
            </main>
        </div>
    )
}