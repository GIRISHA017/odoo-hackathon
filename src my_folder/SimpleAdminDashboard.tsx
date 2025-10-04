import React, { useState } from 'react';
import { Users, Plus, Eye, DollarSign, TrendingUp, UserPlus, Building, Mail, Key, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SimpleAdminDashboard: React.FC = () => {
  const { state, logout, addUser, generatePassword } = useApp();
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'employee' as 'manager' | 'employee',
    managerId: ''
  });
  const [newUserCredentials, setNewUserCredentials] = useState<any>(null);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      ...userForm,
      managerId: userForm.role === 'employee' ? userForm.managerId : undefined
    };
    await addUser(userData);
    const password = generatePassword();
    setNewUserCredentials({ ...userData, password });
    setUserForm({ name: '', email: '', role: 'employee', managerId: '' });
    setShowAddUserForm(false);
  };

  const managers = state.users.filter(u => u.role === 'manager');
  const employees = state.users.filter(u => u.role === 'employee');
  const totalExpenseAmount = state.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-800">ExpenMan</h1>
              <span className="ml-4 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                Admin Portal
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
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">{state.users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Expenses</p>
                <p className="text-2xl font-bold text-slate-900">
                  {state.company?.currency} {totalExpenseAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-slate-900">
                  {state.expenses.filter(e => e.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Company</p>
                <p className="text-lg font-bold text-slate-900">{state.company?.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Users
              </button>
              <button 
                onClick={() => setActiveTab('expenses')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'expenses' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                All Expenses
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Company Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {state.company?.name}</p>
                      <p><span className="font-medium">Country:</span> {state.company?.country}</p>
                      <p><span className="font-medium">Currency:</span> {state.company?.currency}</p>
                      <p><span className="font-medium">Admin:</span> {state.currentUser?.name}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Managers:</span> {managers.length}</p>
                      <p><span className="font-medium">Employees:</span> {employees.length}</p>
                      <p><span className="font-medium">Approved Expenses:</span> {state.expenses.filter(e => e.status === 'approved').length}</p>
                      <p><span className="font-medium">Rejected Expenses:</span> {state.expenses.filter(e => e.status === 'rejected').length}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-slate-900">User Management</h3>
                  <button
                    onClick={() => setShowAddUserForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add User
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Manager</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {state.users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm text-slate-900">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-900">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {user.managerId ? state.users.find(u => u.id === user.managerId)?.name || 'N/A' : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'expenses' && (
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-6">All Expenses</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Employee</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Description</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Manager</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {state.expenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm text-slate-900">{expense.userName}</td>
                          <td className="px-6 py-4 text-sm text-slate-900">
                            {new Date(expense.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900">{expense.description}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                            {expense.currency} {expense.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                              expense.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {expense.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{expense.managerName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add User Modal */}
        {showAddUserForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Add New User</h3>
                <button
                  onClick={() => setShowAddUserForm(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as 'manager' | 'employee' })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                {userForm.role === 'employee' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Manager</label>
                    <select
                      value={userForm.managerId}
                      onChange={(e) => setUserForm({ ...userForm, managerId: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select Manager</option>
                      {managers.map((manager) => (
                        <option key={manager.id} value={manager.id}>
                          {manager.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddUserForm(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* New User Credentials Modal */}
        {newUserCredentials && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-xl font-bold text-slate-900 mb-4">User Created Successfully</h3>
              <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                <p><span className="font-medium">Name:</span> {newUserCredentials.name}</p>
                <p><span className="font-medium">Email:</span> {newUserCredentials.email}</p>
                <p><span className="font-medium">Role:</span> {newUserCredentials.role}</p>
                <p><span className="font-medium">Password:</span> <code className="bg-white px-2 py-1 rounded">{newUserCredentials.password}</code></p>
              </div>
              <p className="text-sm text-slate-600 mt-4">Please share these credentials with the user securely.</p>
              <button
                onClick={() => setNewUserCredentials(null)}
                className="w-full mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleAdminDashboard;
