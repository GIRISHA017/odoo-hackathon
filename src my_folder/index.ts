export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  password: string;
  companyName?: string;
  country?: string;
  currency?: string;
  managerId?: string;
  createdAt: string;
  isActive: boolean;
}

export interface Expense {
  id: string;
  userId: string;
  userName: string;
  managerId: string;
  managerName: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
  category: ExpenseCategory;
  status: ExpenseStatus;
  receiptUrl?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
  approvalHistory: ApprovalHistory[];
}

export type ExpenseStatus = 'pending' | 'approved' | 'rejected';
export type ExpenseCategory = 'travel' | 'meals' | 'office_supplies' | 'transportation' | 'accommodation' | 'other';

export interface ApprovalHistory {
  id: string;
  expenseId: string;
  approverId: string;
  approverName: string;
  approverRole: 'manager' | 'admin';
  action: 'approved' | 'rejected';
  comment?: string;
  timestamp: string;
}

export interface Company {
  id: string;
  name: string;
  country: string;
  currency: string;
  adminId: string;
  createdAt: string;
}

export interface DashboardStats {
  totalExpenses: number;
  pendingExpenses: number;
  approvedExpenses: number;
  rejectedExpenses: number;
  totalAmount: number;
  averageApprovalTime: number;
  approvalRate: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'expense_submitted' | 'expense_approved' | 'expense_rejected' | 'approval_required';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Approval workflow constants
export const APPROVAL_RATE_THRESHOLD = 60; // 60% approval rate required
export const CFO_OVERRIDE_ENABLED = true; // CFO can approve directly
