import React from "react";
import { UserButton } from "@clerk/nextjs";

function DashboardHeader() {
  return (
    <div className="flex justify-between p-5 border-b shadow-sm">
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
