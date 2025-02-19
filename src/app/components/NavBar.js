'use client'

import { useRouter } from "next/navigation";

export default function NavBar() {
    const router = useRouter();

    return (
        <nav className="navBar">
            <button onClick={() => router.push("/")}>Home</button>
            <button onClick={() => router.push("/shop")}>Shop</button>
            <div className="cart">
                <button onClick={() => router.push("/cart")}>Cart</button>
            </div>
        </nav>
    );
}
