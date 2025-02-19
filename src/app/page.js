"use client";

import { useRouter } from "next/navigation";
import NavBar from "./components/NavBar";

export default function Home() {
  const router = useRouter();


  return (
    <div className="container">
      <NavBar />
      <main className="mainContent">
        <h1>hey guys welcome to my shop</h1>
        <p>shop</p>
        <button onClick={() => router.push("/shop")}>Visit the main shop!</button>
      </main>
    </div>
  );
}
