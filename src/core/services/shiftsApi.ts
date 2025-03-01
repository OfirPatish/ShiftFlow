import { Shift } from "../types/shift";
import { StorageService } from "./storage";

/**
 * API for managing shifts in localStorage
 */
export class ShiftsApi {
  private storageService: StorageService<Shift[]>;

  constructor() {
    this.storageService = new StorageService<Shift[]>("shifts-storage", []);
  }

  /**
   * Gets all shifts
   * @returns Array of all shifts
   */
  getAllShifts(): Shift[] {
    return this.storageService.getData();
  }

  /**
   * Adds a new shift
   * @param shift The shift to add
   * @returns true if successful, false otherwise
   */
  addShift(shift: Shift): boolean {
    const shifts = this.getAllShifts();
    shifts.push(shift);
    return this.storageService.saveData(shifts);
  }

  /**
   * Updates an existing shift
   * @param shiftId The ID of the shift to update
   * @param updatedShift The updated shift data
   * @returns true if successful, false otherwise
   */
  updateShift(shiftId: string, updatedShift: Shift): boolean {
    const shifts = this.getAllShifts();
    const updatedShifts = shifts.map((shift) => (shift.id === shiftId ? updatedShift : shift));
    return this.storageService.saveData(updatedShifts);
  }

  /**
   * Deletes a shift
   * @param shiftId The ID of the shift to delete
   * @returns true if successful, false otherwise
   */
  deleteShift(shiftId: string): boolean {
    const shifts = this.getAllShifts();
    const filteredShifts = shifts.filter((shift) => shift.id !== shiftId);
    return this.storageService.saveData(filteredShifts);
  }

  /**
   * Gets shifts for a specific month
   * @param year The year
   * @param month The month (0-11)
   * @returns Array of shifts for the specified month
   */
  getMonthlyShifts(year: number, month: number): Shift[] {
    const shifts = this.getAllShifts();
    return shifts.filter((shift) => {
      const shiftDate = new Date(shift.date);
      return shiftDate.getFullYear() === year && shiftDate.getMonth() === month;
    });
  }

  /**
   * Saves all shifts (replacing existing data)
   * @param shifts The shifts to save
   * @returns true if successful, false otherwise
   */
  saveAllShifts(shifts: Shift[]): boolean {
    return this.storageService.saveData(shifts);
  }

  /**
   * Clears all shifts
   * @returns true if successful, false otherwise
   */
  clearAllShifts(): boolean {
    return this.storageService.clearData();
  }
}
