import React from 'react';
import { Bell } from 'lucide-react'; // Assuming you're using Lucide React icons

const NotificationButton = ({ count }: { count: number }) => {
  return (
    <button className="relative p-2 rounded-full hover:bg-gray-100">
      {/* Bell Icon */}
      <Bell className="h-6 w-6" />

      {/* Notification Badge */}
      {count > 0 && (
        <div className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs rounded-full">
          {count}
        </div>
      )}
    </button>
  );
};

export default NotificationButton;