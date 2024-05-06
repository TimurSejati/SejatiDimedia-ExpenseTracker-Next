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
    <div className="p-5">
      <h2 className="flex items-center justify-between text-xl font-bold md:text-3xl">
        My Expenses
      </h2>

      <div className="flex flex-col gap-5 mt-4 md:flex-row">
        <div className="w-full md:w-[30%]">
          <AddExpense
            user={user}
            refreshData={() => getAllExpenses()}
            budgetId={null}
            editExpenseData={editExpenseData}
          />
        </div>
        <div className="w-full md:w-[70%]">
          <ExpenseListTable
            expensesList={expensesList}
            showActionList={true}
            showFilterDate={true}
            setEditExpenseData={setEditExpenseData}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            titleListTable={"Monthly Expenses"}
          />
        </div>
      </div>
    </div>
  );
}

export default ExpensesScreen;
