import React from 'react';
import { Bell, CheckCircle, XCircle, Clock, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NotificationPanel: React.FC = () => {
  const { state, dispatch } = useApp();
  
  const userNotifications = state.notifications.filter(n => n.userId === state.currentUser?.id);
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'expense_approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expense_rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'approval_required':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  if (userNotifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {userNotifications.slice(0, 5).map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-slate-100 hover:bg-slate-50 ${
              !notification.isRead ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 text-sm">
                  {notification.title}
                </h4>
                <p className="text-slate-600 text-sm mt-1">
                  {notification.message}
                </p>
                <p className="text-slate-400 text-xs mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;