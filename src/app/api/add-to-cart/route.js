import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { count, item } = await request.json();
        const cookieStore = await cookies();
        
        // get existing cart from cookies
        const existingCart = await cookieStore.get('cart');
        const cart = existingCart ? JSON.parse(existingCart.value) : [];

        // get current quantity of this item in cart
        const currentCount = cart.filter(currentItem => currentItem.id === item.id).length;

        // clear all instances of this item from cart. i wasn't doing this earlier, and it was messing up.
        const updatedCart = cart.filter(currentItem => currentItem.id !== item.id);
        
        // add the correct number of items
        for (let i = 0; i < count; i++) {
            updatedCart.push({
                ...item,
                cartItemId: crypto.randomUUID()
            });
        }
        
        // set the cookie with the updated cart
        const response = NextResponse.json({ message: "Item added to cart" });
        response.cookies.set('cart', JSON.stringify(updatedCart), {
            httpOnly: true,
            path: '/',
        });
        
        return response;
    } catch (error) {
        return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
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
        
        // find the first version of the item to remove
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            cart.splice(itemIndex, 1);
        }
        
        // update cookie
        const response = NextResponse.json({ message: "Item removed from cart" });
        response.cookies.set('cart', JSON.stringify(cart), {
            httpOnly: true,
            path: '/',
        });
        
        return response;
    } catch (error) {
        return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 });
    }
}