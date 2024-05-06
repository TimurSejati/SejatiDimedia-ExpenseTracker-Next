import React, { useEffect, useState } from "react";
import {
  PiggyBank,
  ReceiptText,
  Wallet,
  CircleDollarSign,
  HandCoins,
  Eye,
  EyeOff,
} from "lucide-react";

function CardInfo({ budgetList, incomesData, expensesData }) {
  console.log(expensesData, "expense data");
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);

  const [showTotalMoney, setShowTotalMoney] = useState(false);

  useEffect(() => {
    budgetList && calculateCardInfo();
  }, [budgetList]);

  const calculateCardInfo = () => {
    let totalBudget_ = 0;
    let totalSpend_ = 0;

    budgetList?.forEach((e) => {
      totalBudget_ = totalBudget_ + Number(e.amount);
      totalSpend_ = totalSpend_ + e.totalSpend;
    });
    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
  };

  return (
    <div>
      {budgetList?.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 mt-7 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex justify-between border rounded-lg p-7">
            <div>
              <h2 className="text-sm">Total Money</h2>
              {showTotalMoney ? (
                <div className="flex items-center gap-2">
                  <EyeOff
                    className="cursor-pointer"
                    onClick={() => setShowTotalMoney(!showTotalMoney)}
                  />
                  <h2 className="text-2xl font-bold">
                    {(
                      incomesData?.totalIncomes - expensesData.totalExpenses
                    ).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </h2>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Eye
                    onClick={() => setShowTotalMoney(!showTotalMoney)}
                    className="cursor-pointer"
                  />
                  <h2>*******</h2>
                </div>
              )}
            </div>
            <CircleDollarSign className="w-12 h-12 p-3 text-white rounded-full bg-primary" />
          </div>
          <div className="flex justify-between border rounded-lg p-7">
            <div>
              <h2 className="text-sm">Total Incomes / Month</h2>
              <h2 className="text-2xl font-bold">
                {(incomesData?.totalMonthly || 0).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </h2>
            </div>
            <HandCoins className="w-12 h-12 p-3 text-white rounded-full bg-primary" />
          </div>
          <div className="flex justify-between border rounded-lg p-7">
            <div>
              <h2 className="text-sm">Total Budget / Month</h2>
              <h2 className="text-2xl font-bold">
                {totalBudget.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </h2>
            </div>
            <PiggyBank className="w-12 h-12 p-3 text-white rounded-full bg-primary" />
          </div>
          <div className="flex justify-between border rounded-lg p-7">
            <div>
              <h2 className="text-sm">Total Expenses / Month</h2>
              <h2 className="text-2xl font-bold">
                {expensesData?.totalMonthly?.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </h2>
            </div>
            <ReceiptText className="w-12 h-12 p-3 text-white rounded-full bg-primary" />
          </div>
          <div className="flex justify-between border rounded-lg p-7">
            <div>
              <h2 className="text-sm">No. Of Budget</h2>
              <h2 className="text-2xl font-bold">{budgetList?.length}</h2>
            </div>
            <Wallet className="w-12 h-12 p-3 text-white rounded-full bg-primary" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 mt-7 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item, index) => (
            <div className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardInfo;
