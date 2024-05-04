"use client";

import React, { useState } from "react";
import BudgetList from "./_components/BudgetList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import moment from "moment";

function Budget() {
  const [filterDate, setFilterDate] = useState(
    `${moment().format("YYYY")}-${moment().format("MM")}`
  );
  // const [submitFilter, setSubmitFilter] = useState(false);

  return (
    <div className="p-5">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold md:text-3xl">My Budgets</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Calendar className="w-5 h-5 cursor-pointer md:w-8 md:h-8" />
          </DialogTrigger>
          <DialogContent className="w-[350px]">
            <DialogHeader>
              <DialogTitle>Filter Budget Date</DialogTitle>
              <DialogDescription>
                <div className="mt-5">
                  <div className="mt-2">
                    <h2 className="my-2 font-medium text-black">Date</h2>
                    <div className="flex justify-between gap-2">
                      <input
                        className="w-full p-2 mb-5 border rounded-lg"
                        type="month"
                        defaultValue={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                      />
                    </div>
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
