"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { Incomes } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import AddIncome from "./_components/AddIncome";
import IncomeListTable from "./_components/IncomeListTable";

function IncomesScreen() {
  const { user } = useUser();
  const [incomesList, setIncomesList] = useState([]);
  const [editIncomeData, setEditIncomeData] = useState({});

  useEffect(() => {
    user && getAllIncomes();
  }, [user]);

  const getAllIncomes = async () => {
    const result = await db
      .select({
        id: Incomes.id,
        name: Incomes.name,
        amount: Incomes.amount,
        createdAt: Incomes.createdAt,
      })
      .from(Incomes)
      .where(eq(Incomes.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Incomes.id));

    setIncomesList(result);
  };

  return (
    <div className="p-5">
      <h2 className="flex items-center justify-between text-xl font-bold md:text-3xl">
        My Incomes
      </h2>

      <div className="flex flex-col gap-5 mt-4 md:flex-row">
        <div className="w-full md:w-[30%]">
          <AddIncome
            user={user}
            refreshData={() => getAllIncomes()}
            editIncomeData={editIncomeData}
          />
        </div>
        <div className="w-full md:w-[70%]">
          <IncomeListTable
            incomesList={incomesList}
            refreshData={() => getAllIncomes()}
            showActionList={true}
            setEditIncomeData={setEditIncomeData}
          />
        </div>
      </div>
    </div>
  );
}

export default IncomesScreen;
