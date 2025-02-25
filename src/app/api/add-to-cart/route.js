import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { count, item } = await request.json();
        const cookieStore = await cookies();
        
        // get existing cart from cookies
        const existingCart = await cookieStore.get('cart');
        const cart = existingCart ? JSON.parse(existingCart.value) : [];

        // find if item already exists in cart
        const existingItemIndex = cart.findIndex(currentItem => currentItem.id === item.id);

        let updatedCart;
        if (existingItemIndex >= 0) {
            // if count is 0, remove the item
            if (count === 0) {
                updatedCart = cart.filter(currentItem => currentItem.id !== item.id);
            } else {
                // set the exact quantity instead of incrementing
                updatedCart = cart.map(currentItem => 
                    currentItem.id === item.id 
                        ? { ...currentItem, quantity: count }
                        : currentItem
                );
            }
        } else {
            // if item doesn't exist and count > 0, add it
            if (count > 0) {
                updatedCart = [
                    ...cart,
                    {
                        ...item,
                        quantity: count,
                        cartItemId: crypto.randomUUID(),
                    }
                ];
            } else {
                updatedCart = cart;
            }
        }
        
        // set the cookie with the updated cart
        const response = NextResponse.json({ message: "Cart updated" });
        response.cookies.set('cart', JSON.stringify(updatedCart), {
            httpOnly: true,
            path: '/',
        });
        
        return response;
    } catch (error) {
        return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
    }
}

export async function GET(request) {
    const cookieStore = await cookies();
    const cart = await cookieStore.get('cart');
    return NextResponse.json({ cart: cart ? JSON.parse(cart.value) : [] });
}

export async function DELETE(request) {
    try {
        const { itemId } = await request.json();
        const cookieStore = await cookies();
        const existingCart = await cookieStore.get('cart');
        let cart = existingCart ? JSON.parse(existingCart.value) : [];
        
        // find the item and decrease its quantity
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            const item = cart[itemIndex];
            if (item.quantity > 1) {
                // if quantity > 1, decrease it by 1
                cart[itemIndex] = { ...item, quantity: item.quantity - 1 };
            } else {
                // if quantity is 1 or less, remove the item completely
                cart.splice(itemIndex, 1);
            }
        }
        
        // update cookie
        const response = NextResponse.json({ message: "Item updated in cart" });
        response.cookies.set('cart', JSON.stringify(cart), {
            httpOnly: true,
            path: '/',
        });
        
        return response;
    } catch (error) {
        return NextResponse.json({ error: "Failed to update item in cart" }, { status: 500 });
    }
}