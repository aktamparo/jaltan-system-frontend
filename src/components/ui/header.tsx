"use client";
import { CurrentUser } from "@/lib/types/account";
import Image from "next/image";

export default function Header({ account }: CurrentUser) {
  const username = `${account.firstName} ${account.lastName}`;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
        <p className="text-sm font-medium">Today | {today}</p>
      </div>
    </header>
  );
}
