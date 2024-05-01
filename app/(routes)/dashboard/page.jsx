"use client";

import React, { useEffect, useState } from "react";
import CardInfo from "./_components/CardInfo";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql, ilike } from "drizzle-orm";
import { Budgets, Expenses, Incomes } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import moment from "moment";

function Dashboard() {
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [incomeData, setIncomeData] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    user && getBudgetList();
    getAllIncomes();
  }, [user]);

  // Get budget list
  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(
        ilike(
          Budgets.createdAt,
          `%${moment().format("MM")}/${moment().format("YYYY")}%`
        )
      )
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result);
    getAllExpenses();
  };

  const getAllIncomes = async () => {
    const result = await db
      .select({
        totalIncomes: sql`sum(${Incomes.amount})`.mapWith(Number),
      })
      .from(Incomes)
      .where(eq(Incomes.createdBy, user?.primaryEmailAddress.emailAddress))
      .groupBy(Incomes.createdBy);

    const resultCurrentMonth = await db
      .select({
        total: sql`sum(${Incomes.amount})`.mapWith(Number),
      })
      .from(Incomes)
      .where(eq(Incomes.createdBy, user?.primaryEmailAddress.emailAddress))
      .where(
        ilike(
          Incomes.createdAt,
          `%${moment().format("MM")}/${moment().format("YYYY")}%`
        )
      )
      .groupBy(Incomes.createdBy);

    setIncomeData({
      total: result[0]?.totalIncomes,
      currentMonth: resultCurrentMonth[0]?.total,
    });
  };

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
    const totalAmount = result.reduce(
      (total, expense) => total + parseFloat(expense.amount),
      0
    );
    setExpenseTotal(totalAmount);
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold">Hi, {user?.fullName} ✌️</h2>
      <p className="text-gray-500">
        Here's what happening with your money, Lets manage your expense
      </p>
      <CardInfo
        budgetList={budgetList}
        incomeData={incomeData}
        expenseTotal={expenseTotal}
      />
      <div className="grid grid-cols-1 gap-5 mt-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <BarChartDashboard budgetList={budgetList} />

          <ExpenseListTable
            expensesList={expensesList}
            refreshData={() => getBudgetList()}
          />
        </div>
        <div className="grid gap-5">
          <h2 className="text-lg font-bold">Latest Budgets</h2>
          {budgetList.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
