"use client";

import React, { useEffect } from "react";
import Image from "next/image";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

function SideNav({ menuList }) {
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <>
      <div className="fixed hidden h-screen p-5 border shadow-sm md:w-64 md:block">
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
    </>
  );
}

export default SideNav;
