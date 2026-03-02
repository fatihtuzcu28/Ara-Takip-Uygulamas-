import { Vehicle, Expense, MaintenanceTask } from './types';

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    make: 'Volkswagen',
    model: 'Golf R',
    year: 2022,
    licensePlate: '34 ABC 123',
    odometer: 15230,
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=800',
    isPrimary: true,
  },
  {
    id: '2',
    make: 'Toyota',
    model: 'RAV4',
    year: 2019,
    licensePlate: '34 XYZ 789',
    odometer: 42100,
    image: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&q=80&w=800',
    isPrimary: false,
  }
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'e1',
    vehicleId: '1',
    category: 'fuel',
    amount: 1250.50,
    date: '2024-03-01',
    odometer: 15100,
    location: 'Shell - Beşiktaş',
  },
  {
    id: 'e2',
    vehicleId: '1',
    category: 'service',
    amount: 4500.00,
    date: '2024-02-15',
    odometer: 14800,
    notes: 'Periyodik bakım',
  },
  {
    id: 'e3',
    vehicleId: '1',
    category: 'insurance',
    amount: 8500.00,
    date: '2024-01-10',
    odometer: 14200,
  }
];

export const MOCK_TASKS: MaintenanceTask[] = [
  {
    id: 't1',
    vehicleId: '1',
    title: 'Yağ Değişimi',
    dueOdometer: 25000,
    status: 'upcoming',
    category: 'service',
  },
  {
    id: 't2',
    vehicleId: '1',
    title: 'Kasko Yenileme',
    dueDate: '2024-03-15',
    status: 'upcoming',
    category: 'insurance',
  },
  {
    id: 't3',
    vehicleId: '1',
    title: 'Muayene',
    dueDate: '2024-02-28',
    status: 'overdue',
    category: 'other',
  }
];
