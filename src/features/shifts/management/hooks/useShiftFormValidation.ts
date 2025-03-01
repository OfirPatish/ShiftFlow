import { useState } from "react";
import { TimeEntry } from "../../../../core/types/shift";
import { validateShift, ValidationResult } from "../utils/shiftValidation";
import { useShiftsStore } from "../../../../core/context/shiftsSlice";

interface FormData {
  date: string;
  startTime: TimeEntry;
  endTime: TimeEntry;
}

interface FormErrors {
  date?: string;
  startTime?: string;
  endTime?: string;
  general?: string;
}

export function useShiftFormValidation() {
  const [errors, setErrors] = useState<FormErrors>({});
  const { shifts } = useShiftsStore();

  const validate = (data: FormData, shiftId?: string): boolean => {
    const newErrors: FormErrors = {};

    // Use the utility function to validate shift data
    const validationResult = validateShift(data.date, data.startTime, data.endTime, shifts, shiftId);

    // Map validation errors to form fields
    validationResult.errors.forEach((error) => {
      if (error.includes("Date")) {
        newErrors.date = error;
      } else if (error.includes("start time")) {
        newErrors.startTime = error;
      } else if (error.includes("end time")) {
        newErrors.endTime = error;
      } else if (error.includes("duration")) {
        newErrors.general = error;
      } else if (error.includes("overlap")) {
        newErrors.general = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validate,
    resetErrors,
  };
}
