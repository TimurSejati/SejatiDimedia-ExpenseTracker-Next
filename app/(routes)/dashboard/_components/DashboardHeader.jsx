import React from "react";
import { UserButton } from "@clerk/nextjs";

function DashboardHeader() {
  return (
    <div className="flex justify-between p-5 border-b shadow-sm">
      <div></div>
      <div>
        <UserButton />
      </div>
    </div>
  );
}

export default DashboardHeader;
