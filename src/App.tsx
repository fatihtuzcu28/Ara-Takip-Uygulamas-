import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Wrench, 
  Receipt, 
  Settings, 
  Plus,
  Bell,
  Fuel,
  Calendar,
  TrendingUp,
  MapPin,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, isAfter, parseISO, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from './lib/utils';
import { Vehicle, Expense, MaintenanceTask, ExpenseCategory } from './types';
import { MOCK_VEHICLES, MOCK_EXPENSES, MOCK_TASKS } from './constants';

// --- Components ---

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Panel' },
    { id: 'garage', icon: Car, label: 'Garaj' },
    { id: 'maintenance', icon: Wrench, label: 'Bakım' },
    { id: 'expenses', icon: Receipt, label: 'Giderler' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-dark/95 backdrop-blur-md border-t border-border-dark pb-safe">
      <div className="flex justify-around items-center px-2 py-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 min-w-[64px] transition-colors",
              activeTab === tab.id ? "text-primary" : "text-text-secondary hover:text-slate-200"
            )}
          >
            <tab.icon size={24} className={cn(activeTab === tab.id && "fill-current/20")} />
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const Header = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <header className="sticky top-0 z-40 bg-background-dark/90 backdrop-blur-md border-b border-border-dark px-4 py-4 flex items-center justify-between">
    <div>
      <h1 className="text-xl font-extrabold tracking-tight">{title}</h1>
      {subtitle && <p className="text-xs text-text-secondary font-medium">{subtitle}</p>}
    </div>
    <button className="relative p-2 rounded-full hover:bg-surface-dark transition-colors">
      <Bell size={22} />
      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-background-dark"></span>
    </button>
  </header>
);

const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-surface-dark border border-border-dark shadow-sm transition-all hover:shadow-md">
    <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
      <span className="text-[10px] font-bold text-white tracking-widest uppercase">
        {vehicle.isPrimary ? 'BİRİNCİL' : 'ARAÇ'}
      </span>
    </div>
    <div className="aspect-[16/9] w-full relative overflow-hidden">
      <img 
        src={vehicle.image || 'https://picsum.photos/seed/car/800/450'} 
        alt={`${vehicle.make} ${vehicle.model}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      <div className="absolute bottom-4 left-4 right-4">
        <h2 className="text-lg font-bold text-white">{vehicle.year} {vehicle.make} {vehicle.model}</h2>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-xs text-gray-300 flex items-center gap-1">
            <TrendingUp size={14} />
            {vehicle.odometer.toLocaleString()} km
          </p>
          <p className="text-xs text-gray-300 flex items-center gap-1">
            <MapPin size={14} />
            {vehicle.licensePlate}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value, icon: Icon, colorClass, trend }: any) => (
  <div className="p-4 rounded-xl bg-surface-dark border border-border-dark shadow-sm">
    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", colorClass)}>
      <Icon size={18} />
    </div>
    <p className="text-xs text-text-secondary font-medium mb-1">{label}</p>
    <div className="flex items-baseline justify-between">
      <p className="text-lg font-bold">{value}</p>
      {trend && <span className="text-[10px] text-emerald-400 font-bold">{trend}</span>}
    </div>
  </div>
);

const TaskItem = ({ task }: { task: MaintenanceTask }) => {
  const isOverdue = task.status === 'overdue';
  const Icon = task.category === 'fuel' ? Fuel : task.category === 'service' ? Wrench : Calendar;
  
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-dark border border-border-dark shadow-sm hover:border-primary/50 transition-colors cursor-pointer group">
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
        isOverdue ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
      )}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold truncate">{task.title}</h4>
        <p className="text-xs text-text-secondary mt-0.5">
          {task.dueDate ? `Tarih: ${format(parseISO(task.dueDate), 'd MMMM', { locale: tr })}` : `${task.dueOdometer?.toLocaleString()} km`}
        </p>
      </div>
      {isOverdue && (
        <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded uppercase">Gecikti</span>
      )}
    </div>
  );
};

// --- Main Pages ---

const Dashboard = ({ vehicles, expenses, tasks }: any) => {
  const primaryVehicle = vehicles.find((v: any) => v.isPrimary) || vehicles[0];
  const monthlyExpense = expenses.reduce((acc: number, curr: any) => acc + curr.amount, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 space-y-6"
    >
      <VehicleCard vehicle={primaryVehicle} />

      <div className="space-y-3">
        <h3 className="text-base font-bold px-1">Genel Bakış</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 p-5 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Receipt size={22} />
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded text-white/90">+8%</span>
            </div>
            <p className="text-sm text-blue-100 font-medium mb-1">Aylık Toplam Gider</p>
            <p className="text-3xl font-extrabold">₺{monthlyExpense.toLocaleString('tr-TR')}</p>
          </div>
          
          <StatCard 
            label="Son Yakıt" 
            value="3 gün önce" 
            icon={Fuel} 
            colorClass="bg-amber-500/10 text-amber-500" 
          />
          <StatCard 
            label="Sıradaki Bakım" 
            value="2 hafta" 
            icon={Wrench} 
            colorClass="bg-emerald-500/10 text-emerald-500" 
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold">Yaklaşan Görevler</h3>
          <button className="text-xs font-bold text-primary">Tümünü Gör</button>
        </div>
        <div className="flex flex-col gap-3">
          {tasks.slice(0, 3).map((task: any) => (
            <div key={task.id}>
              <TaskItem task={task} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Garage = ({ vehicles }: { vehicles: Vehicle[] }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="p-4 space-y-4"
  >
    <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all font-bold">
      <Plus size={20} />
      Yeni Araç Ekle
    </button>
    
    <div className="space-y-4">
      {vehicles.map(vehicle => (
        <div key={vehicle.id}>
          <VehicleCard vehicle={vehicle} />
        </div>
      ))}
    </div>
  </motion.div>
);

const Maintenance = ({ tasks }: { tasks: MaintenanceTask[] }) => {
  const [filter, setFilter] = useState<'upcoming' | 'history'>('upcoming');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full"
    >
      <div className="p-4 sticky top-0 bg-background-dark/90 backdrop-blur-md z-10">
        <div className="flex p-1 bg-surface-dark rounded-xl border border-border-dark">
          <button 
            onClick={() => setFilter('upcoming')}
            className={cn(
              "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
              filter === 'upcoming' ? "bg-primary text-white shadow-sm" : "text-text-secondary"
            )}
          >
            Yaklaşan
          </button>
          <button 
            onClick={() => setFilter('history')}
            className={cn(
              "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
              filter === 'history' ? "bg-primary text-white shadow-sm" : "text-text-secondary"
            )}
          >
            Geçmiş
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-gradient-to-br from-primary/10 to-surface-dark rounded-2xl p-5 border border-primary/20 relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">Araç Durumu</p>
              <h2 className="text-2xl font-extrabold mb-4">İyi Durumda</h2>
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg w-fit">
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold">Kritik sorun yok</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-surface-dark rounded-full flex items-center justify-center border border-border-dark text-primary shadow-inner">
              <Car size={24} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest px-1">Zaman Çizelgesi</h3>
          <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border-dark">
            {tasks.map((task) => (
              <div key={task.id} className="relative">
                <div className={cn(
                  "absolute -left-[21px] top-1 w-5 h-5 rounded-full border-4 border-background-dark z-10",
                  task.status === 'overdue' ? "bg-red-500" : "bg-primary"
                )} />
                <div className="bg-surface-dark p-4 rounded-xl border border-border-dark shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm">{task.title}</h4>
                    {task.status === 'overdue' && <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded">Gecikti</span>}
                  </div>
                  <p className="text-xs text-text-secondary mb-3">
                    {task.dueDate ? format(parseISO(task.dueDate), 'd MMMM yyyy', { locale: tr }) : `${task.dueOdometer?.toLocaleString()} km`}
                  </p>
                  <button className="w-full py-2 bg-surface-dark hover:bg-border-dark border border-border-dark rounded-lg text-xs font-bold transition-colors">
                    Detaylar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Expenses = ({ expenses }: { expenses: Expense[] }) => {
  const data = [
    { name: 'Yakıt', value: 55, color: '#197fe6' },
    { name: 'Bakım', value: 25, color: '#f59e0b' },
    { name: 'Sigorta', value: 20, color: '#10b981' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-6"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-bold px-1">Gider Dağılımı</h3>
        <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark shadow-sm flex flex-col items-center gap-6">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a2632', border: '1px solid #243647', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full">
            {data.map((item) => (
              <div key={item.name} className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-text-secondary uppercase">{item.name}</span>
                </div>
                <span className="text-sm font-bold">%{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold">Son İşlemler</h3>
          <button className="text-xs font-bold text-primary">Tümünü Gör</button>
        </div>
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-dark border border-border-dark shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {expense.category === 'fuel' ? <Fuel size={20} /> : <Receipt size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold">{expense.category === 'fuel' ? 'Yakıt Alımı' : 'Servis Gideri'}</p>
                  <p className="text-[10px] text-text-secondary font-medium">
                    {format(parseISO(expense.date), 'd MMMM yyyy', { locale: tr })}
                  </p>
                </div>
              </div>
              <p className="text-sm font-extrabold">-₺{expense.amount.toLocaleString('tr-TR')}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

const AddExpenseModal = ({ isOpen, onClose, onSave, vehicles }: any) => {
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [category, setCategory] = useState<ExpenseCategory>('fuel');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [odometer, setOdometer] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background-dark/80 backdrop-blur-sm flex items-end justify-center sm:items-center p-4"
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="w-full max-w-md bg-surface-dark rounded-t-3xl sm:rounded-3xl border border-border-dark shadow-2xl overflow-hidden"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Gider Ekle</h2>
            <button onClick={onClose} className="text-text-secondary hover:text-white">
              <Plus size={24} className="rotate-45" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-text-secondary font-bold uppercase pl-1">Araç Seçin</p>
              <select 
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full bg-background-dark border-border-dark rounded-xl text-sm font-bold focus:ring-primary focus:border-primary px-4 py-3"
              >
                {vehicles.map((v: any) => (
                  <option key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {(['fuel', 'service', 'insurance', 'other'] as ExpenseCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 min-w-[84px] p-3 rounded-2xl border-2 transition-all",
                    category === cat ? "bg-primary border-primary text-white" : "bg-background-dark border-transparent text-text-secondary"
                  )}
                >
                  {cat === 'fuel' && <Fuel size={24} />}
                  {cat === 'service' && <Wrench size={24} />}
                  {cat === 'insurance' && <Calendar size={24} />}
                  {cat === 'other' && <Receipt size={24} />}
                  <span className="text-[10px] font-bold uppercase">{cat === 'fuel' ? 'Yakıt' : cat === 'service' ? 'Servis' : cat === 'insurance' ? 'Sigorta' : 'Diğer'}</span>
                </button>
              ))}
            </div>

            <div className="bg-background-dark rounded-2xl p-4 border border-border-dark">
              <p className="text-xs text-text-secondary font-bold uppercase mb-1">Tutar</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">₺</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent border-none p-0 text-3xl font-bold focus:ring-0 w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-text-secondary font-bold uppercase pl-1">Tarih</p>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-background-dark border-border-dark rounded-xl text-sm font-bold focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-text-secondary font-bold uppercase pl-1">Kilometre</p>
                <input 
                  type="number" 
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  placeholder="15,230"
                  className="w-full bg-background-dark border-border-dark rounded-xl text-sm font-bold focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-text-secondary font-bold uppercase pl-1">Notlar</p>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Bakım detayları, yakıt markası vb."
                className="w-full bg-background-dark border-border-dark rounded-xl text-sm font-medium focus:ring-primary focus:border-primary min-h-[80px] resize-none"
              />
            </div>
          </div>

          <button 
            onClick={() => onSave({ vehicleId, category, amount, date, odometer, notes })}
            className="w-full bg-primary hover:bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all"
          >
            Kaydet
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [tasks] = useState<MaintenanceTask[]>(MOCK_TASKS);

  const handleAddExpense = (newExpense: any) => {
    const expense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      vehicleId: vehicles[0].id,
      ...newExpense,
      amount: parseFloat(newExpense.amount) || 0,
      odometer: parseInt(newExpense.odometer) || 0,
    };
    setExpenses([expense, ...expenses]);
    setIsModalOpen(false);
  };

  const getTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Garajım';
      case 'garage': return 'Garaj';
      case 'maintenance': return 'Bakım & Hatırlatıcılar';
      case 'expenses': return 'Giderler & Raporlar';
      default: return 'AutoTrack';
    }
  };

  const getSubtitle = () => {
    if (activeTab === 'dashboard') return 'Hoş geldin, Alex';
    return undefined;
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 max-w-md mx-auto border-x border-border-dark shadow-2xl bg-background-dark relative">
      <Header title={getTitle()} subtitle={getSubtitle()} />
      
      <main className="flex-1 overflow-y-auto hide-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <div key="dash">
              <Dashboard vehicles={vehicles} expenses={expenses} tasks={tasks} />
            </div>
          )}
          {activeTab === 'garage' && (
            <div key="garage">
              <Garage vehicles={vehicles} />
            </div>
          )}
          {activeTab === 'maintenance' && (
            <div key="maint">
              <Maintenance tasks={tasks} />
            </div>
          )}
          {activeTab === 'expenses' && (
            <div key="exp">
              <Expenses expenses={expenses} />
            </div>
          )}
        </AnimatePresence>
      </main>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        <Plus size={28} />
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <AddExpenseModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleAddExpense} 
            vehicles={vehicles}
          />
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
