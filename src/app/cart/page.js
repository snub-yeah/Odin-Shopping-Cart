'use client'
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import styles from './cart.module.css';
import QuantityButton from "../components/QuantityButton";

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [updateCart, setUpdateCart] = useState(0); // useless variable for useEffect. This may seem like it could be done in a better way, but this somehow was faster
    const [previousCart, setPreviousCart] = useState([]);

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
        setCart(keepPreviousItems(tempCart));
    }

    // this is a method that will prevent items from instantly disappearing if the user changes the quantity to 0.
    const keepPreviousItems = (tempCart) => {
        if (tempCart.length < previousCart.length) {
            let newCart = [];
            for (const cartItem of previousCart) {
                const itemStillExists = tempCart.some(item => item.id === cartItem.id);
                if (!itemStillExists) {
                    newCart.push({
                        ...cartItem,
                        quantity: 0
                    });
                } else {
                    newCart.push(cartItem);
                }
            }
            return newCart;
        }
        return tempCart;
    }

    const handleCartChange = () => {
        setUpdateCart(updateCart + 1);
    }

    useEffect(() => {
        getCart();
    }, [updateCart]);

    useEffect(() => {
        setPreviousCart(cart);
    }, [cart]);

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
                                        <QuantityButton item={item} onQuantityChange={handleCartChange}/>
                                    </td>
                                    <td>¥{(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h1 className={styles.cartSubprices}>Subtotal: ¥{(total.toFixed(2)).toLocaleString()}</h1>
                    <h1 className={styles.cartSubprices}>Sales Tax: ¥{(((total * 0.086)).toFixed(2)).toLocaleString()}</h1>
                    <h1 className={styles.cartHeader}>Total: ¥{((total + (total * 0.086)).toFixed(2)).toLocaleString()}</h1>
                    <button className={styles.checkoutButton} onClick={() => alert("You don't have enough motion for allat")}>
                        Proceed to Checkout
                    </button>
                </div>
            </main>
        </div>
    )
}