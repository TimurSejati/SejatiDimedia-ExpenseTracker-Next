"use client";
import React, { useEffect, useState } from "react";
import ExpenseListTable from "./_components/ExpenseListTable";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";

function ExpensesScreen() {
  const { user } = useUser();
  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    user && getAllExpenses();
  }, [user]);

  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));

    setExpensesList(result);
  };

  return (
    <div className="p-10">
      <h2 className="flex items-center justify-between text-2xl font-bold">
        My Expenses
        <div className="flex items-center gap-2"></div>
      </h2>

      <div className="mt-4">
        <ExpenseListTable expensesList={expensesList} />
      </div>
    </div>
  );
}

export default ExpensesScreen;
