export type ExpenseCategory = 'fuel' | 'service' | 'insurance' | 'tax' | 'other';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  odometer: number;
  image?: string;
  isPrimary: boolean;
}

export interface Expense {
  id: string;
  vehicleId: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  odometer: number;
  notes?: string;
  location?: string;
}

export interface MaintenanceTask {
  id: string;
  vehicleId: string;
  title: string;
  dueDate?: string;
  dueOdometer?: number;
  status: 'upcoming' | 'completed' | 'overdue';
  category: ExpenseCategory;
}
