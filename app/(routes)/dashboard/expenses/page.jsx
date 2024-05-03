"use client";
import React, { useEffect, useState } from "react";
import ExpenseListTable from "./_components/ExpenseListTable";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { desc, eq, ilike } from "drizzle-orm";
import AddExpense from "./_components/AddExpense";
import moment from "moment";

function ExpensesScreen() {
  const { user } = useUser();
  const [expensesList, setExpensesList] = useState([]);
  const [editExpenseData, setEditExpenseData] = useState({});
  const [filterDate, setFilterDate] = useState(
    `${moment().format("YYYY")}-${moment().format("MM")}`
  );

  useEffect(() => {
    user && getAllExpenses();
  }, [user, filterDate]);

  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Expenses)
      .where(eq(Expenses.createdBy, user?.primaryEmailAddress.emailAddress))
      .where(
        ilike(
          Expenses.createdAt,
          `%${moment(filterDate).format("MM")}/${moment().format("YYYY")}%`
        )
      )
      .orderBy(desc(Expenses.id));

    setExpensesList(result);
  };

  return (
    <div className="p-10">
      <h2 className="flex items-center justify-between text-2xl font-bold">
        My Expenses
        <div className="flex items-center gap-2"></div>
      </h2>

      <div className="grid gap-2 mt-4 md:grid-cols-3">
        <div className="col-span-1">
          <AddExpense
            user={user}
            refreshData={() => getAllExpenses()}
            budgetId={null}
            editExpenseData={editExpenseData}
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <ExpenseListTable
            expensesList={expensesList}
            showActionList={true}
            setEditExpenseData={setEditExpenseData}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
          />
        </div>
      </div>
    </div>
  );
}

export default ExpensesScreen;
