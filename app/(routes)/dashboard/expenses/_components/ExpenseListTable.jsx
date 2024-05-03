import React, { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ExpenseListTable({
  expensesList,
  refreshData,
  showActionList,
  setEditExpenseData,
  filterDate,
  setFilterDate,
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
      <div className="flex">
        <div className="w-full">
          <h2 className="mb-5 text-lg font-bold">Latest Expenses</h2>
        </div>
        {showActionList && (
          <input
            className="w-[350px] p-2 mb-5 border rounded-lg"
            type="month"
            defaultValue={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        )}
      </div>

      <Table>
        <TableCaption>A list of your expenses.</TableCaption>
        <TableHeader className="bg-primary">
          <TableRow>
            <TableHead className="text-center text-white">Name</TableHead>
            <TableHead className="text-center text-white">Amount</TableHead>
            <TableHead className="text-center text-white">Date</TableHead>
            {showActionList && (
              <TableHead className="text-center text-white w-[100px]">
                Action
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="bg-gray-50">
          {expensesList.map((expense, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-center">
                {expense.name}
              </TableCell>
              <TableCell className="text-center">
                {parseFloat(expense.amount).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </TableCell>
              <TableCell className="text-center">{expense.createdAt}</TableCell>
              {showActionList && (
                <TableCell className="text-right">
                  <center>
                    <div className="flex items-center justify-center gap-1">
                      <Pencil
                        className="w-4 h-4 cursor-pointer text-primary"
                        onClick={() => copyExpenseValues(expense, "update")}
                      />
                      <Copy
                        className="w-4 h-4 text-orange-400 cursor-pointer"
                        onClick={() => copyExpenseValues(expense, "copy")}
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
                              This action cannot be undone. This will
                              permanently delete your current budget along with
                              expenses
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteExpense(expense)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </center>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <div
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
      ))} */}
    </div>
  );
}

export default ExpenseListTable;
