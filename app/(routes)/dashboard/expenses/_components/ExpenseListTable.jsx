import React from "react";
import { Trash } from "lucide-react";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function ExpenseListTable({ expensesList, refreshData }) {
  const deleteExpense = async (expenses) => {
    const result = await db
      .delete(Expenses)
      .where(eq(Expenses.id, expenses.id))
      .returning();

    if (result) {
      toast("Expenses deleted!");
      refreshData();
    }
  };

  return (
    <div className="mt-3">
      <h2 className="text-lg font-bold">Latest Expenses</h2>
      <div className="grid grid-cols-4 p-2 mt-3 text-center bg-slate-200">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>
      {expensesList.map((expenses, index) => (
        <div className="grid grid-cols-4 p-2 text-xs text-center lg:text-sm bg-slate-50" key={index}>
          <h2>{expenses.name}</h2>
          <h2>
            {parseFloat(expenses.amount).toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </h2>
          <h2>{expenses.createdAt}</h2>
          <center>
          <h2>
            <Trash
              className="w-4 h-4 text-red-600 cursor-pointer"
              onClick={() => deleteExpense(expenses)}
            />
          </h2>
          </center>
        </div>
      ))}
    </div>
  );
}

export default ExpenseListTable;
