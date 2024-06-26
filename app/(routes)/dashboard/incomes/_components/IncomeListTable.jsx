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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

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

  const countTotalAmount = (data) => {
    return data.reduce((acc, item) => acc + parseFloat(item.amount), 0);
  };

  return (
    <div className="mt-3">
      <Table>
        <TableCaption>A list of your incomes.</TableCaption>
        <TableHeader className="bg-primary">
          <TableRow>
            <TableHead className="text-center text-white w-[100px]">
              Action
            </TableHead>
            <TableHead className="text-center text-white">Name</TableHead>
            <TableHead className="text-center text-white">Date</TableHead>
            <TableHead className="text-center text-white">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-gray-50">
          {incomesList.map((income, index) => (
            <TableRow key={index}>
              <TableCell className="text-right">
                <center>
                  <div className="flex items-center justify-center gap-1">
                    <Pencil
                      className="w-4 h-4 cursor-pointer text-primary"
                      onClick={() => copyIncomeValues(income, "update")}
                    />
                    <Copy
                      className="w-4 h-4 text-orange-400 cursor-pointer"
                      onClick={() => copyIncomeValues(income, "copy")}
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
                          <AlertDialogAction
                            onClick={() => deleteIncome(income)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </center>
              </TableCell>
              <TableCell className="font-medium text-center">
                {income.name}
              </TableCell>
              <TableCell className="text-center">{income.createdAt}</TableCell>
              <TableCell className="text-center">
                {parseFloat(income.amount).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-gray-200">
          <TableRow>
            <TableCell className="text-center">Total</TableCell>
            <TableCell className="text-center" colSpan="2"></TableCell>
            <TableCell className="text-center">
              {countTotalAmount(incomesList).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export default IncomeListTable;
