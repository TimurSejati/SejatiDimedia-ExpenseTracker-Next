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
  const [incomesData, setIncomesData] = useState(0);
  const [expensesData, setExpensesData] = useState({});
  const { user } = useUser();

  let daily = `${moment().format("DD")}/${moment().format(
    "MM"
  )}/${moment().format("YYYY")}`;
  let monthly = `${moment().format("MM")}/${moment().format("YYYY")}`;

  useEffect(() => {
    user && getBudgetList();
    getIncomes("monthly", `%${monthly}%`);
    getIncomes("all");
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
      .where(ilike(Budgets.createdAt, `%${monthly}%`))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result);

    // Monthly
    getExpenses("monthly", `%${monthly}%`);

    // Daily
    getExpenses("daily", `%${daily}%`);

    // All
    getExpenses("all");
  };

  const getIncomes = async (type, time) => {
    if (type === "monthly") {
      const result = await db
        .select({
          total: sql`sum(${Incomes.amount})`.mapWith(Number),
        })
        .from(Incomes)
        .where(eq(Incomes.createdBy, user?.primaryEmailAddress.emailAddress))
        .where(ilike(Incomes.createdAt, time))
        .groupBy(Incomes.createdBy);

      setIncomesData((prevData) => ({
        ...prevData,
        totalMonthly: result[0]?.total,
      }));
    } else if (type === "all") {
      const result = await db
        .select({
          totalIncomes: sql`sum(${Incomes.amount})`.mapWith(Number),
        })
        .from(Incomes)
        .where(eq(Incomes.createdBy, user?.primaryEmailAddress.emailAddress))
        .groupBy(Incomes.createdBy);

      setIncomesData((prevData) => ({
        ...prevData,
        totalIncomes: result[0]?.totalIncomes,
      }));
    }
  };

  const getExpenses = async (type, time) => {
    if (type === "daily" || type === "monthly") {
      const result = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
        })
        .from(Expenses)
        .where(eq(Expenses.createdBy, user?.primaryEmailAddress.emailAddress))
        .where(ilike(Expenses.createdAt, time))
        .orderBy(desc(Expenses.id));

      if (type === "daily") {
        setExpensesData((prevData) => ({
          ...prevData,
          list: result,
        }));
      } else if (type === "monthly") {
        const totalMonthly = result.reduce(
          (total, expense) => total + parseFloat(expense.amount),
          0
        );
        setExpensesData((prevData) => ({
          ...prevData,
          totalMonthly: totalMonthly,
        }));
      }
    } else if (type === "all") {
      const result = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
        })
        .from(Expenses)
        .where(eq(Expenses.createdBy, user?.primaryEmailAddress.emailAddress))
        .orderBy(desc(Expenses.id));

      const totalAmount = result.reduce(
        (total, expense) => total + parseFloat(expense.amount),
        0
      );

      setExpensesData((prevData) => ({
        ...prevData,
        totalExpenses: totalAmount,
      }));
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold md:text-3xl">
        Hi, {user?.fullName} ✌️
      </h2>
      <p className="text-gray-500">
        Here's what happening with your money, Lets manage your expense
      </p>
      <CardInfo
        budgetList={budgetList}
        incomesData={incomesData}
        expensesData={expensesData}
      />
      <div className="grid grid-cols-1 gap-5 mt-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <BarChartDashboard budgetList={budgetList} />

          <ExpenseListTable
            expensesList={expensesData.list}
            refreshData={() => getBudgetList()}
            titleListTable={"Daily Expenses"}
            // showActionList={true}
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
