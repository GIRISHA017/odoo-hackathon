import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Expense, DashboardStats, Notification, Company } from '../types';
import { COUNTRIES, getCurrencyByCountry } from '../data/countries';

interface AppState {
  currentUser: User | null;
  company: Company | null;
  users: User[];
  expenses: Expense[];
  notifications: Notification[];
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  currentView: 'home' | 'login' | 'register' | 'admin' | 'manager' | 'employee';
}

type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'SET_COMPANY'; payload: Company }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_STATS'; payload: DashboardStats }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_VIEW'; payload: AppState['currentView'] }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  currentUser: null,
  company: null,
  users: [],
  expenses: [],
  notifications: [],
  stats: null,
  isLoading: false,
  error: null,
  currentView: 'home',
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_COMPANY':
      return { ...state, company: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
      };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
      };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'LOGOUT':
      return { ...initialState, currentView: 'home' };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  registerAdmin: (data: { name: string; email: string; password: string; companyName: string; country: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addUser: (data: { name: string; email: string; role: 'manager' | 'employee'; managerId?: string }) => Promise<void>;
  submitExpense: (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'approvalHistory'>) => Promise<void>;
  approveExpense: (expenseId: string, action: 'approved' | 'rejected', comment?: string) => Promise<void>;
  generatePassword: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const generatePassword = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const registerAdmin = async (data: { name: string; email: string; password: string; companyName: string; country: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const currency = getCurrencyByCountry(data.country);
      
      const admin: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: 'admin',
        password: data.password,
        companyName: data.companyName,
        country: data.country,
        currency: currency,
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      const company: Company = {
        id: Date.now().toString(),
        name: data.companyName,
        country: data.country,
        currency: currency,
        adminId: admin.id,
        createdAt: new Date().toISOString(),
      };

      dispatch({ type: 'SET_CURRENT_USER', payload: admin });
      dispatch({ type: 'SET_COMPANY', payload: company });
      dispatch({ type: 'ADD_USER', payload: admin });
      dispatch({ type: 'SET_VIEW', payload: 'admin' });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Registration failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = state.users.find(u => u.email === email && u.password === password && u.isActive);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      
      // Set view based on role
      const view = user.role === 'admin' ? 'admin' : user.role === 'manager' ? 'manager' : 'employee';
      dispatch({ type: 'SET_VIEW', payload: view });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Login failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const addUser = async (data: { name: string; email: string; role: 'manager' | 'employee'; managerId?: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const password = generatePassword();
      
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: data.role,
        password: password,
        companyName: state.company?.name,
        country: state.company?.country,
        currency: state.company?.currency,
        managerId: data.managerId,
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      dispatch({ type: 'ADD_USER', payload: newUser });
      
      // Add notification
      const notification: Notification = {
        id: Date.now().toString(),
        userId: state.currentUser?.id || '',
        type: 'approval_required',
        title: 'New User Added',
        message: `${data.name} has been added as ${data.role}. Password: ${password}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add user' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const submitExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'approvalHistory'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Find manager for the current user
      const managers = state.users.filter(u => u.role === 'manager');
      const manager = managers[0]; // For simplicity, assign to first manager
      
      const newExpense: Expense = {
        ...expenseData,
        id: Date.now().toString(),
        managerId: manager?.id || state.company?.adminId || '',
        managerName: manager?.name || 'Admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        approvalHistory: [],
      };
      
      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
      updateStats();
      
      // Add notification for manager
      const notification: Notification = {
        id: Date.now().toString(),
        userId: newExpense.managerId,
        type: 'approval_required',
        title: 'New Expense Submitted',
        message: `${expenseData.userName} submitted an expense of ${expenseData.currency} ${expenseData.amount}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to submit expense' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const approveExpense = async (expenseId: string, action: 'approved' | 'rejected', comment?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const expense = state.expenses.find(e => e.id === expenseId);
      if (!expense || !state.currentUser) return;

      // CFO can approve directly
      const isCFO = state.currentUser.role === 'admin' && state.currentUser.email.toLowerCase().includes('cfo');
      const isAdmin = state.currentUser.role === 'admin';
      
      // Check approval rate for managers (60% threshold)
      let finalAction = action;
      if (!isCFO && !isAdmin && action === 'approved') {
        const managerExpenses = state.expenses.filter(e => e.managerId === state.currentUser.id);
        const approvedCount = managerExpenses.filter(e => e.status === 'approved').length;
        const totalCount = managerExpenses.length;
        const approvalRate = totalCount > 0 ? (approvedCount / totalCount) * 100 : 0;
        
        if (approvalRate > 60) {
          finalAction = 'rejected';
          comment = (comment || '') + ' [Auto-rejected: Approval rate exceeds 60% threshold]';
        }
      }

      const updatedExpense: Expense = {
        ...expense,
        status: finalAction,
        updatedAt: new Date().toISOString(),
        approvalHistory: [
          ...expense.approvalHistory,
          {
            id: Date.now().toString(),
            expenseId,
            approverId: state.currentUser.id,
            approverName: state.currentUser.name,
            approverRole: isCFO ? 'admin' : state.currentUser.role === 'admin' ? 'admin' : 'manager',
            action: finalAction,
            comment,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense });
      updateStats();
      
      // Add notification for employee
      const notification: Notification = {
        id: Date.now().toString(),
        userId: expense.userId,
        type: finalAction === 'approved' ? 'expense_approved' : 'expense_rejected',
        title: `Expense ${finalAction === 'approved' ? 'Approved' : 'Rejected'}`,
        message: `Your expense of ${expense.currency} ${expense.amount} has been ${finalAction}${comment ? `. Comment: ${comment}` : ''}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to process approval' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateStats = () => {
    const expenses = state.expenses;
    const totalExpenses = expenses.length;
    const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
    const approvedExpenses = expenses.filter(e => e.status === 'approved').length;
    const rejectedExpenses = expenses.filter(e => e.status === 'rejected').length;
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const approvalRate = totalExpenses > 0 ? Math.round((approvedExpenses / totalExpenses) * 100) : 0;
    
    const stats: DashboardStats = {
      totalExpenses,
      pendingExpenses,
      approvedExpenses,
      rejectedExpenses,
      totalAmount,
      averageApprovalTime: 24, // Mock value
      approvalRate,
    };
    
    dispatch({ type: 'SET_STATS', payload: stats });
  };

  // Update stats whenever expenses change
  React.useEffect(() => {
    updateStats();
  }, [state.expenses]);

  const value: AppContextType = {
    state,
    dispatch,
    registerAdmin,
    login,
    logout,
    addUser,
    submitExpense,
    approveExpense,
    generatePassword,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
