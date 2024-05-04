import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { eq } from "drizzle-orm";
import { ReceiptText } from "lucide-react";

function AddExpense({ budgetId, user, refreshData, editExpenseData }) {
  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const [date, setDate] = useState();
  const [loading, setLoading] = useState(false);

  const [stateButton, setStateButton] = useState("Create");

  useEffect(() => {
    if (editExpenseData && Object.keys(editExpenseData).length > 0) {
      setName(editExpenseData.name || ""); // Default to empty string if editExpenseData.name is undefined
      setAmount(editExpenseData.amount || ""); // Similarly for amount

      const [day, month, year] = editExpenseData.createdAt.split("/");
      const formattedDate = `${year}-${month}-${day}`;
      setDate(formattedDate);

      if (editExpenseData.type === "update") {
        setStateButton("Update");
      } else {
        setStateButton("Copy");
      }
    }
  }, [editExpenseData]); //

  const addNewExpense = async () => {
    setLoading(true);
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: amount,
        budgetId: budgetId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment(date).format("DD/MM/yyy"),
      })
      .returning({ insertedId: Budgets.id });

    setName("");
    setAmount("");
    setDate("");
    if (result) {
      setLoading(false);
      refreshData();
      toast("New expense added");
    }
    setLoading(false);
  };

  const updateExpense = async () => {
    const result = await db
      .update(Expenses)
      .set({
        name: name,
        amount: amount,
        createdAt: moment(date).format("DD/MM/yyy"),
      })
      .where(eq(Expenses.id, editExpenseData?.id))
      .returning();

    if (result) {
      refreshData();
      toast("Expense updated!");
      setName("");
      setAmount("");
      setDate("");
      setStateButton("Create");
    }
  };

  return (
    <div className="p-5 border rounded-lg">
      <div className="flex items-center gap-2">
        <ReceiptText className="w-10 h-10 p-3 text-white rounded-full md:w-12 md:h-12 bg-primary" />
        <h2 className="text-lg font-bold">Add Expense</h2>
      </div>

      <div className="mt-7">
        <h2 className="my-1 font-medium text-black">Expense Name</h2>
        <Input
          placeholder="e.g. Bedroom Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="my-1 font-medium text-black">Expense Amount</h2>
        <Input
          placeholder="e.g. 10000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="my-1 font-medium text-black">Date</h2>
        <Input
          type="date"
          placeholder="e.g. 10000"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            console.log(date, "date val");
          }}
        />
      </div>
      <Button
        onClick={() => {
          if (stateButton == "Create" || stateButton == "Copy") {
            addNewExpense();
          } else {
            updateExpense();
          }
        }}
        disabled={!(name && amount && date) || loading}
        className="w-full mt-3 mb-7"
      >
        {loading ? (
          <Loader className="animate-spin" />
        ) : stateButton == "Create" ? (
          "Add New Expense"
        ) : stateButton == "Copy" ? (
          "Copy Expense"
        ) : (
          "Update Expense"
        )}
      </Button>
    </div>
  );
}

export default AddExpense;
