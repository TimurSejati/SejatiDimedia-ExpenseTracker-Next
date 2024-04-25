import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);

  const addNexExpense = async () => {
    setLoading(true);
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: amount,
        budgetId: budgetId,
        createdAt: moment().format("DD/MM/yyy"),
      })
      .returning({ insertedId: Budgets.id });

    setName("");
    setAmount("");
    if (result) {
      setLoading(false);
      refreshData();
      toast("New expense added");
    }
    setLoading(false);
  };

  return (
    <div className="p-5 border rounded-lg">
      <h2 className="text-lg font-bold">Add Expense</h2>
      <div className="mt-2">
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
      <Button
        onClick={() => addNexExpense()}
        disabled={!(name && amount) || loading}
        className="w-full mt-3"
      >
        {loading ? <Loader className="animate-spin" /> : " Add Nex Expense"}
      </Button>
    </div>
  );
}

export default AddExpense;
