"use client";


import { useState } from "react";
import Image from "next/image";


export default function Header() {
  const [username] = useState("User");


  return (
    <header className="w-full h-[80px] bg-white flex flex-row items-center justify-between px-6 rounded-t-xl">
      <div className="flex flex-col items-start">
        <Image
          src="/JaltanLogo.png"
          alt="Jaltan Logo"
          width={100}
          height={100}
        />
        <p className="text-sm font-medium">Hello, {username}!</p>
      </div>


      <div className="flex flex-row items-center gap-4">
        <p className="text-sm font-medium">Today</p>
      </div>
    </header>
  );
}
