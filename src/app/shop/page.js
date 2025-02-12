"use client";

import { useRouter } from "next/navigation";

export default function Shop() {
  const router = useRouter();
  return (
    <div>
      <nav className="navBar">
        <button onClick={() => router.push("/")}>Home</button>
        <button onClick={() => router.push("/shop")}>Shop</button>
      </nav>    
      <h1>shop</h1>
    </div>
  );
}
