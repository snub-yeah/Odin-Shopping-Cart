"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();


  return (
    <div className="container">
      <nav className="navBar">
        <p>This will be a link later</p>
        <button onClick={() => router.push("/")}>Home</button>
        <button onClick={() => router.push("/shop")}>Shop</button>
      </nav>
      <main className="mainContent">
        <h1>hey guys welcome to my shop</h1>
        <p>shop</p>
        <button onClick={() => router.push("/shop")}>Visit the main shop!</button>
        {/* todo: make this whole thing. i think i might style it like the store from yakuza */}
      </main>
    </div>
  );
}
