"use client";

import { useState, useEffect } from "react";
import styles from "./quantity.module.css";
export default function QuantityButton(props) {
    const [quantity, setQuantity] = useState(0);
    
    const getInitialQuantity = async () => {
        const cart = await fetch('/api/add-to-cart');
        const data = await cart.json();
        const count = data.cart.reduce((acc, item) => {
            return item.id === props.item.id ? acc + 1 : acc;
        }, 0);
        return count;
    }

    const handleIncrease = async () => {
        const newQuantity = quantity + 1;
        if (newQuantity > 50) {
            alert("Please enter a number between 1 and 50");
            return;
        }
        
        const body = {
            count: newQuantity,
            item: props.item,
            itemId: props.item.id
        };
        
        await fetch('/api/add-to-cart', {
            method: 'POST',
            body: JSON.stringify(body),
        });
        setQuantity(newQuantity);
    }

    const handleDecrease = async () => {
        if (quantity <= 0) return;
        const response = await fetch('/api/add-to-cart', {
            method: 'DELETE',
            body: JSON.stringify({ 
                itemId: props.item.id, 
                item: props.item
            }),
        });
        const data = await response.json();
        setQuantity(prev => prev - 1);
    }

    useEffect(() => {
        const initQuantity = async () => {
            const qty = await getInitialQuantity();
            setQuantity(qty);
        };
        initQuantity();
    }, []);

    const handleChange = async (e) => {
        const newQuantity = parseInt(e.target.value) || 0;
        
        if (newQuantity > 50) {
            alert("Please enter a number between 1 and 50");
            return;
        }

        const body = {
            count: newQuantity,
            item: props.item,
            itemId: props.item.id
        };
        
        await fetch('/api/add-to-cart', {
            method: 'POST',
            body: JSON.stringify(body),
        });
        setQuantity(newQuantity);
    }

    return (
        <div className={styles.quantityContainer}>
            <button onClick={handleDecrease} className={styles.decreaseButton}>−</button>
            <input type="number" className={styles.quantityText} value={quantity} onChange={handleChange} />
            <button onClick={handleIncrease} className={styles.increaseButton}>+</button>
        </div>
    )
}