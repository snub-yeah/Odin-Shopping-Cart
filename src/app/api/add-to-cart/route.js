import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { itemId, item } = await request.json();
        const cookieStore = await cookies();
        
        // get existing cart from cookies
        const existingCart = await cookieStore.get('cart');
        const cart = existingCart ? JSON.parse(existingCart.value) : [];
        
        // add item to cart
        cart.push({
            ...item, //spreads the item into all its properties
            cartItemId: `${itemId}-${Date.now()}` //have to add the date to make it unique
        });
        
        // set the cookie with the updated cart
        const response = NextResponse.json({ message: "Item added to cart" });
        response.cookies.set('cart', JSON.stringify(cart), {
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