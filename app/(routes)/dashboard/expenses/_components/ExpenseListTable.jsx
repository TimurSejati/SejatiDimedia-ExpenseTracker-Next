import React from "react";
import { Pencil, Copy, Trash } from "lucide-react";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function ExpenseListTable({
  expensesList,
  refreshData,
  showActionList,
  setEditExpenseData,
}) {
  const copyExpenseValues = async (expense, type) => {
    setEditExpenseData({ ...expense, type });
  };

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
      <div
        className={`grid grid-cols-${
          showActionList ? "4" : "3"
        } p-2 mt-3 text-center bg-slate-200`}
      >
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        {showActionList && <h2 className="font-bold">Action</h2>}
      </div>
      {expensesList.map((expenses, index) => (
        <div
          className={`grid grid-cols-${
            showActionList ? "4" : "3"
          } p-2 text-xs text-center lg:text-sm bg-slate-50`}
          key={index}
        >
          <h2>{expenses.name}</h2>
          <h2>
            {parseFloat(expenses.amount).toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </h2>
          <h2>{expenses.createdAt}</h2>
          {showActionList && (
            <center>
              <div className="flex items-center justify-center gap-1">
                <Pencil
                  className="w-4 h-4 cursor-pointer text-primary"
                  onClick={() => copyExpenseValues(expenses, "update")}
                />
                <Copy
                  className="w-4 h-4 text-orange-400 cursor-pointer"
                  onClick={() => copyExpenseValues(expenses, "copy")}
                />

                <AlertDialog>
                  <AlertDialogTrigger>
                    <Trash className="w-4 h-4 text-red-600 cursor-pointer" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your current budget along with expenses
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteExpense(expenses)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </center>
          )}
        </div>
      ))}
    </div>
  );
}

export default ExpenseListTable;
