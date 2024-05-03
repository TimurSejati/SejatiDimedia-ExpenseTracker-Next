import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

function DashboardHeader({ menuList }) {
  const [showMenuMobile, setShowMenuMobile] = useState(false);
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="flex justify-between p-5 border-b shadow-sm">
      <div className="block md:hidden">
        <Menu
          className="relative cursor-pointer"
          onClick={() => setShowMenuMobile(!showMenuMobile)}
        />
        {showMenuMobile && (
          <div className="absolute p-2 m-5 mt-5 bg-white shadow-md top-6">
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
        )}
      </div>
      <div className="text-lg font-bold">
        Tracker Your Money <span className="text-[20px]">💰</span>
      </div>
      <div>
        <UserButton />
      </div>
    </div>
  );
}

export default DashboardHeader;
