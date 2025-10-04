import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Users, DollarSign, TrendingUp, Eye, MessageSquare, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ManagerDashboard: React.FC = () => {
  const { state, approveExpense, logout } = useApp();
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter expenses for employees assigned to this manager
  const managedEmployees = state.users.filter(u => u.managerId === state.currentUser?.id);
  const teamExpenses = state.expenses.filter(expense => 
    managedEmployees.some(emp => emp.id === expense.userId)
  );
  
  const pendingExpenses = teamExpenses.filter(expense => expense.status === 'pending');
  
  // Apply filters and sorting
  let filteredExpenses = teamExpenses;
  if (filterStatus !== 'all') {
    filteredExpenses = teamExpenses.filter(e => e.status === filterStatus);
  }
  
  filteredExpenses.sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'amount':
        return b.amount - a.amount;
      case 'employee':
        return a.userName.localeCompare(b.userName);
      default:
        return 0;
    }
  });

  const handleApproval = async (expenseId: string, action: 'approved' | 'rejected') => {
    await approveExpense(expenseId, action, approvalComment);
    setShowApprovalModal(false);
    setSelectedExpense(null);
    setApprovalComment('');
  };

  const openApprovalModal = (expense: any) => {
    setSelectedExpense(expense);
    setShowApprovalModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-800">ExpenMan</h1>
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Manager Portal
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                Welcome, <span className="font-semibold">{state.currentUser?.name}</span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-slate-900">{pendingExpenses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Approval Rate</p>
                <p className="text-2xl font-bold text-slate-900">
                  {state.stats?.approvalRate || 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Team Members</p>
                <p className="text-2xl font-bold text-slate-900">{managedEmployees.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Avg. Approval Time</p>
                <p className="text-2xl font-bold text-slate-900">
                  {state.stats?.averageApprovalTime || 0}h
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex justify-between items-center px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-900">Team Expenses</h3>
              <div className="flex items-center space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
                  <option value="employee">Sort by Employee</option>
                </select>
              </div>
            </nav>
          </div>

          <div className="p-6">
            {/* Pending Approvals Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Employee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Receipt</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-900">{expense.userName}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">{expense.description}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                        {expense.category.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        ${expense.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {expense.receiptUrl ? (
                          <a
                            href={expense.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </a>
                        ) : (
                          <span className="text-slate-400 text-sm">No receipt</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                          expense.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                          expense.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>
                          {getStatusIcon(expense.status)}
                          {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {expense.status === 'pending' ? (
                          <button
                            onClick={() => openApprovalModal(expense)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Review
                          </button>
                        ) : (
                          <button
                            onClick={() => openApprovalModal(expense)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredExpenses.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No expenses found!</h3>
                <p className="text-slate-600">No expenses match the current filter criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Approval Modal */}
        {showApprovalModal && selectedExpense && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Review Expense</h3>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Expense Details */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Expense Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Employee</p>
                      <p className="font-medium text-slate-900">{selectedExpense.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Date</p>
                      <p className="font-medium text-slate-900">
                        {new Date(selectedExpense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Category</p>
                      <p className="font-medium text-slate-900 capitalize">
                        {selectedExpense.category.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Amount</p>
                      <p className="font-medium text-slate-900">
                        ${selectedExpense.amount.toFixed(2)} {selectedExpense.currency}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-slate-600">Description</p>
                    <p className="font-medium text-slate-900">{selectedExpense.description}</p>
                  </div>
                </div>

                {/* Receipt */}
                {selectedExpense.receiptUrl && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Receipt</h4>
                    <div className="border border-slate-200 rounded-xl p-4">
                      <img
                        src={selectedExpense.receiptUrl}
                        alt="Receipt"
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Approval History */}
                {selectedExpense.approvalHistory.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Approval History</h4>
                    <div className="space-y-3">
                      {selectedExpense.approvalHistory.map((history: any) => (
                        <div key={history.id} className="bg-slate-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(history.action)}
                              <span className="font-medium text-slate-900">{history.approverName}</span>
                            </div>
                            <span className="text-sm text-slate-600">
                              {new Date(history.timestamp).toLocaleString()}
                            </span>
                          </div>
                          {history.comment && (
                            <p className="text-sm text-slate-600 mt-2">{history.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Add Comment (Optional)
                  </label>
                  <textarea
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    rows={3}
                    placeholder="Add your comments here..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleApproval(selectedExpense.id, 'rejected')}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApproval(selectedExpense.id, 'approved')}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 hover:scale-105"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
