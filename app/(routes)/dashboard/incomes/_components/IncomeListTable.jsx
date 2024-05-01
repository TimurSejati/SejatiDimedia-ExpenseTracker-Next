import React from "react";
import { Pencil, Copy, Trash } from "lucide-react";
import { db } from "@/utils/dbConfig";
import { Incomes } from "@/utils/schema";
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

function IncomeListTable({
  incomesList,
  refreshData,
  showActionList,
  setEditIncomeData,
}) {
  const copyIncomeValues = async (income, type) => {
    setEditIncomeData({ ...income, type });
  };

  const deleteIncome = async (incomes) => {
    const result = await db
      .delete(Incomes)
      .where(eq(Incomes.id, incomes.id))
      .returning();

    if (result) {
      toast("Incomes deleted!");
      refreshData();
    }
  };

  return (
    <div className="mt-3">
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
      {incomesList.map((incomes, index) => (
        <div
          className={`grid grid-cols-${
            showActionList ? "4" : "3"
          } p-2 text-xs text-center lg:text-sm bg-slate-50`}
          key={index}
        >
          <h2>{incomes.name}</h2>
          <h2>
            {parseFloat(incomes.amount).toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </h2>
          <h2>{incomes.createdAt}</h2>
          {showActionList && (
            <center>
              <div className="flex items-center justify-center gap-1">
                <Pencil
                  className="w-4 h-4 cursor-pointer text-primary"
                  onClick={() => copyIncomeValues(incomes, "update")}
                />
                <Copy
                  className="w-4 h-4 text-orange-400 cursor-pointer"
                  onClick={() => copyIncomeValues(incomes, "copy")}
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
                        delete your current budget along with incomes
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteIncome(incomes)}>
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

export default IncomeListTable;
