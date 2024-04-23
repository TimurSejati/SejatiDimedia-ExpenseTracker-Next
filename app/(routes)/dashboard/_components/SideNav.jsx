"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      id: 3,
      name: "Expenses",
      icon: ReceiptText,
      path: "/dashboard/expenses",
    },
    {
      id: 4,
      name: "Upgrade",
      icon: ShieldCheck,
      path: "/dashboard/upgrade",
    },
  ];

  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen p-5 border shadow-sm">
      <Image src={"/logo.svg"} alt="logo" width={30} height={30} />
      <div className="mt-5">
        {menuList.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <h2
              className={`flex items-center gap-2 p-5 font-medium text-gray-500 rounded-md cursor-pointer hover:text-primary hover:bg-blue-100 ${
                path == menu.path && "bg-blue-100 !text-primary"
              }`}
            >
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div className="fixed flex items-center gap-2 p-5 bottom-10">
        <UserButton />
        Profile
      </div>
    </div>
  );
}

export default SideNav;
