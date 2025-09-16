import React from 'react';
import { useGlobalState } from '../store/globalState';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useGlobalState();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded shadow-lg max-w-sm ${
            notification.type === 'error' 
              ? 'bg-red-500 text-white' 
              : notification.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white'
          }`}
        >
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-white hover:text-gray-200"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;