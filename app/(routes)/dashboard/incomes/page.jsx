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
      <h2 className="flex items-center justify-between text-2xl font-bold">
        My Incomes
        <div className="flex items-center gap-2"></div>
      </h2>

      <div className="grid gap-2 mt-4 md:grid-cols-3">
        {/* I want to resizing grid */}
        <div className="col-span-1">
          <AddIncome
            user={user}
            refreshData={() => getAllIncomes()}
            editIncomeData={editIncomeData}
          />
        </div>
        <div className="col-span-1 md:col-span-2">
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
