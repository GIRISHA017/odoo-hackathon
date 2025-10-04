import React, { useState } from 'react';
import { TrendingUp, DollarSign, AlertTriangle, CheckCircle, BarChart3, PieChart, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CFODashboard: React.FC = () => {
  const { state, logout } = useApp();
  const [timeRange, setTimeRange] = useState('30d');

  const highValueExpenses = state.expenses.filter(expense => expense.amount > 1000);
  const pendingHighValue = highValueExpenses.filter(expense => expense.status === 'pending');

  const mockFinancialData = {
    totalSpend: 125000,
    monthlyBudget: 150000,
    departmentSpend: [
      { department: 'Engineering', amount: 45000, percentage: 36 },
      { department: 'Sales', amount: 35000, percentage: 28 },
      { department: 'Marketing', amount: 25000, percentage: 20 },
      { department: 'Operations', amount: 20000, percentage: 16 },
    ],
    categorySpend: [
      { category: 'Travel', amount: 40000, percentage: 32 },
      { category: 'Meals', amount: 30000, percentage: 24 },
      { category: 'Office Supplies', amount: 25000, percentage: 20 },
      { category: 'Accommodation', amount: 20000, percentage: 16 },
      { category: 'Other', amount: 10000, percentage: 8 },
    ],
    monthlyTrend: [
      { month: 'Jan', amount: 12000 },
      { month: 'Feb', amount: 15000 },
      { month: 'Mar', amount: 18000 },
      { month: 'Apr', amount: 16000 },
      { month: 'May', amount: 20000 },
      { month: 'Jun', amount: 22000 },
    ],
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
              <span className="ml-4 px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                CFO Portal
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                Welcome, <span className="font-semibold">{state.user?.name}</span>
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
        {/* Time Range Selector */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Financial Overview</h2>
          <div className="flex space-x-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Spend</p>
                <p className="text-2xl font-bold text-slate-900">
                  ${mockFinancialData.totalSpend.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">
                  {((mockFinancialData.totalSpend / mockFinancialData.monthlyBudget) * 100).toFixed(1)}% of budget
                </p>
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
                <p className="text-2xl font-bold text-slate-900">{state.stats?.approvalRate || 0}%</p>
                <p className="text-xs text-green-600">+2.5% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">High Value Pending</p>
                <p className="text-2xl font-bold text-slate-900">{pendingHighValue.length}</p>
                <p className="text-xs text-yellow-600">Requires attention</p>
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
                <p className="text-2xl font-bold text-slate-900">{state.stats?.averageApprovalTime || 0}h</p>
                <p className="text-xs text-purple-600">-0.5h from last month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Department Spend */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Spend by Department</h3>
              <PieChart className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {mockFinancialData.departmentSpend.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                    }`} />
                    <span className="ml-3 text-sm font-medium text-slate-900">{dept.department}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">${dept.amount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{dept.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Spend */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Spend by Category</h3>
              <BarChart3 className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {mockFinancialData.categorySpend.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900 capitalize">
                      {category.category.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      ${category.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-yellow-500' :
                        index === 3 ? 'bg-purple-500' : 'bg-pink-500'
                      }`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Monthly Spend Trend</h3>
            <Activity className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-64 flex items-center justify-center text-slate-500">
            <BarChart3 className="w-12 h-12" />
            <span className="ml-2">Chart will be rendered here</span>
          </div>
        </div>

        {/* High Value Expenses */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">High Value Expenses (&gt;$1,000)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Employee</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {highValueExpenses.map((expense) => (
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
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(expense.status)}`}>
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {expense.status === 'pending' && (
                          <>
                            <button className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                              Approve
                            </button>
                            <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
                              Reject
                            </button>
                          </>
                        )}
                        <button className="px-3 py-1 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {highValueExpenses.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No High Value Expenses</h3>
            <p className="text-slate-600">All expenses are within normal limits.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CFODashboard;
