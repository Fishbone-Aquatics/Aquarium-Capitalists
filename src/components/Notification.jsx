import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearNotificationMessage } from '../features/notifications/notificationSlice';
import '../styles/notification.css';

const Notification = () => {
  const notificationMessage = useSelector((state) => state.notifications.message);
  const dispatch = useDispatch();

  useEffect(() => {
    if (notificationMessage) {
      const timer = setTimeout(() => {
        dispatch(clearNotificationMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notificationMessage, dispatch]);

  if (!notificationMessage) return null;

  return (
    <div className="notification">
      {notificationMessage}
    </div>
  );
};

export default Notification;
