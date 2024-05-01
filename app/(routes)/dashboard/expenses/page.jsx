"use client";
import React, { useEffect, useState } from "react";
import ExpenseListTable from "./_components/ExpenseListTable";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import AddExpense from "./_components/AddExpense";

function ExpensesScreen() {
  const { user } = useUser();
  const [expensesList, setExpensesList] = useState([]);
  const [editExpenseData, setEditExpenseData] = useState({});

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
      .from(Expenses)
      // .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Expenses.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));

    setExpensesList(result);
  };

  return (
    <div className="p-10">
      <h2 className="flex items-center justify-between text-2xl font-bold">
        My Expenses
        <div className="flex items-center gap-2"></div>
      </h2>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="col-span-1">
          <AddExpense
            user={user}
            refreshData={() => getAllExpenses()}
            budgetId={null}
            editExpenseData={editExpenseData}
          />
        </div>
        <div className="col-span-2">
          <ExpenseListTable
            expensesList={expensesList}
            showActionList={true}
            setEditExpenseData={setEditExpenseData}
          />
        </div>
      </div>
    </div>
  );
}

export default ExpensesScreen;
