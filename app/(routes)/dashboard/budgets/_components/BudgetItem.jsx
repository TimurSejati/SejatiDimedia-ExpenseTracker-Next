import React from "react";
import Link from "next/link";

function BudgetItem({ budget }) {
  const calculateProgressPercent = () => {
    const percent = (budget.totalSpend / budget.amount) * 100;
    return percent.toFixed(2);
  };

  return (
    <Link href={`/dashboard/expenses/${budget?.id}`}>
      <div className="p-5 border rounded-lg cursor-pointer hover:shadow-md h-[170px]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="p-3 px-4 text-2xl rounded-full bg-slate-100">
              {budget?.icon}
            </h2>
            <div>
              <h2 className="font-bold">{budget?.name}</h2>
              <h2 className="text-sm text-gray-500">
                {budget?.totalItem} Item
              </h2>
            </div>
          </div>
          <h2 className="text-lg font-bold text-primary">{parseFloat(budget?.amount).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}</h2>
        </div>
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs text-slate-400">
            Spend <br />
              {budget?.totalSpend
                ? budget?.totalSpend.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })
                : 0}
            </h2>
            <h2 className="text-xs text-slate-400">
            Remaining <br />
              {(budget?.amount - budget?.totalSpend).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}{" "}
            </h2>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-300">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${calculateProgressPercent(budget)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BudgetItem;
