import React, { useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useGlobalState } from '../store/globalState';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useGlobalState();

  useEffect(() => {
    const autoRemoveNotifications = () => {
      notifications.forEach(notification => {
        if (notification.autoHide) {
          setTimeout(() => {
            removeNotification(notification.id);
          }, notification.duration || 5000);
        }
      });
    };

    autoRemoveNotifications();
  }, [notifications, removeNotification]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg border ${getBackgroundColor(notification.type)} animate-slide-in-right`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' :
                notification.type === 'error' ? 'text-red-800' :
                notification.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
              }`}>
                {notification.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => removeNotification(notification.id)}
                className={`inline-flex rounded-md focus:outline-none ${
                  notification.type === 'success' ? 'hover:bg-green-100 text-green-500' :
                  notification.type === 'error' ? 'hover:bg-red-100 text-red-500' :
                  notification.type === 'warning' ? 'hover:bg-yellow-100 text-yellow-500' : 'hover:bg-blue-100 text-blue-500'
                }`}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;