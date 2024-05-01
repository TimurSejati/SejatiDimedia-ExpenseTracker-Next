import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets, Incomes } from "@/utils/schema";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { HandCoins } from "lucide-react";
import { eq } from "drizzle-orm";

function AddIncome({ budgetId, user, refreshData, editIncomeData }) {
  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const [date, setDate] = useState();
  const [loading, setLoading] = useState(false);

  const [stateButton, setStateButton] = useState("Create");

  useEffect(() => {
    if (editIncomeData && Object.keys(editIncomeData).length > 0) {
      setName(editIncomeData.name || ""); // Default to empty string if editIncomeData.name is undefined
      setAmount(editIncomeData.amount || ""); // Similarly for amount

      const [day, month, year] = editIncomeData.createdAt.split("/");
      const formattedDate = `${year}-${month}-${day}`;
      setDate(formattedDate);

      if (editIncomeData.type === "update") {
        setStateButton("Update");
      } else {
        setStateButton("Copy");
      }
    }
  }, [editIncomeData]); //

  const addNewIncome = async () => {
    setLoading(true);
    const result = await db
      .insert(Incomes)
      .values({
        name: name,
        amount: amount,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment(date).format("DD/MM/yyy"),
      })
      .returning();

    setName("");
    setAmount("");
    setDate("");
    if (result) {
      setLoading(false);
      refreshData();
      toast("New Income added");
    }
    setLoading(false);
  };

  const updateIncome = async () => {
    const result = await db
      .update(Incomes)
      .set({
        name: name,
        amount: amount,
        createdAt: moment(date).format("DD/MM/yyy"),
      })
      .where(eq(Incomes.id, editIncomeData?.id))
      .returning();

    if (result) {
      refreshData();
      toast("Income updated!");
      setName("");
      setAmount("");
      setDate("");
      setStateButton("Create");
    }
  };

  return (
    <div className="p-5 border rounded-lg">
      <div className="flex items-center gap-2">
        <HandCoins className="w-12 h-12 p-3 text-white rounded-full bg-primary" />
        <h2 className="text-lg font-bold">Add Income</h2>
      </div>

      <div className="mt-7">
        <h2 className="my-1 font-medium text-black">Income Name</h2>
        <Input
          placeholder="e.g. Sallary of work"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="my-1 font-medium text-black">Income Amount</h2>
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
            addNewIncome();
          } else {
            updateIncome();
          }
        }}
        disabled={!(name && amount && date) || loading}
        className="w-full mt-3 mb-7"
      >
        {loading ? (
          <Loader className="animate-spin" />
        ) : stateButton == "Create" ? (
          "Add New Income"
        ) : stateButton == "Copy" ? (
          "Copy Income"
        ) : (
          "Update Income"
        )}
      </Button>
    </div>
  );
}

export default AddIncome;
