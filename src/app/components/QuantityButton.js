"use client";

import { useState, useEffect } from "react";
import styles from "./quantity.module.css";
export default function QuantityButton(props) {
    const [quantity, setQuantity] = useState(0);
    
    const getInitialQuantity = async () => {
        const cart = await fetch('/api/add-to-cart');
        const data = await cart.json();
        //find the item
        const item = data.cart.find(item => item.id === props.item.id);
        //assert that the item exists, so we return either the quantity or 0
        return item ? item.quantity : 0;
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
        await fetch('/api/add-to-cart', {
            method: 'DELETE',
            body: JSON.stringify({ 
                itemId: props.item.id, 
                item: props.item
            }),
        });
        setQuantity(prev => prev - 1);
    }

    useEffect(() => {
        const initializeQuantity = async () => {
            const qty = await getInitialQuantity();
            setQuantity(qty);
        };
        initializeQuantity();
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
        
        try {
            const response = await fetch('/api/add-to-cart', {
                method: 'POST',
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error('Failed to update cart');
            setQuantity(newQuantity);
        } catch (error) {
            console.error('Error updating cart:', error);
            // revert to previous quantity if there's an error
            const currentQty = await getInitialQuantity();
            setQuantity(currentQty);
        }
    }

    return (
        <div className={styles.quantityContainer}>
            <button onClick={handleDecrease} className={styles.decreaseButton}>-</button>
            <input type="number" className={styles.quantityText} value={quantity} onChange={handleChange} />
            <button onClick={handleIncrease} className={styles.increaseButton}>+</button>
        </div>
    )
}