import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { itemId } = await request.json();
        const cookieStore = cookies();
        
        // get existing cart from cookies
        const existingCart = cookieStore.get('cart');
        const cart = existingCart ? JSON.parse(existingCart.value) : [];
        
        // add item to cart
        cart.push(itemId);
        
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