import React from "react";

function BudgetItem({ budget }) {
  return (
    <div className="p-5 border rounded-lg cursor-pointer hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="p-3 px-4 text-2xl rounded-full bg-slate-100">
            {budget?.icon}
          </h2>
          <div>
            <h2 className="font-bold">{budget?.name}</h2>
            <h2 className="text-sm text-gray-500">{budget?.totalItem} Item</h2>
          </div>
        </div>
        <h2 className="text-lg font-bold text-primary">${budget?.amount}</h2>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xxs text-slate-400">
            ${budget?.totalSpend ? budget?.totalSpend : 0} Spend
          </h2>
          <h2 className="text-xxs text-slate-400">
            ${budget?.amount - budget?.totalSpend} Remaining
          </h2>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-300">
          <div className="w-[40%] h-2 rounded-full bg-primary"></div>
        </div>
      </div>
    </div>
  );
}

export default BudgetItem;
