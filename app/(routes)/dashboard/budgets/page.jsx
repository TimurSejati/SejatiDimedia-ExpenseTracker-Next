"use client";

import React, { useState } from "react";
import BudgetList from "./_components/BudgetList";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import moment from "moment";

function Budget() {
  const [filterDate, setFilterDate] = useState(
    `${moment().format("YYYY")}-${moment().format("MM")}`
  );

  return (
    <div className="p-10">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-bold">My Budgets</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Calendar className="w-8 h-8 cursor-pointer" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Budget Date</DialogTitle>
              <DialogDescription>
                <div className="mt-5">
                  <div className="mt-2">
                    <h2 className="my-1 font-medium text-black">Date</h2>
                    <Input
                      type="month"
                      defaultValue={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                    />
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <BudgetList filterDate={filterDate} />
    </div>
  );
}

export default Budget;
