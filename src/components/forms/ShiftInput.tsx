import React from "react";
import { ShiftInputForm } from "./ShiftInputForm";
import { MonthlySummary } from "../summary/MonthlySummary";

export function ShiftInput() {
  return (
    <div className="space-y-6">
      <ShiftInputForm />
      <MonthlySummary />
    </div>
  );
}
