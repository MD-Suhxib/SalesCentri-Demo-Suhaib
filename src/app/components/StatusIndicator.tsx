'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import styles from './StatusIndicator.module.css';

type StatusType = 'success' | 'warning' | 'error' | 'info';

interface StatusIndicatorProps {
  type: StatusType;
  title: string;
  message: string;
  isVisible: boolean;
  onClose?: () => void;
  autoHideDelay?: number;
}

const statusIcons = {
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  info: Info,
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  type,
  title,
  message,
  isVisible,
  onClose,
  autoHideDelay = 5000,
}) => {
  const IconComponent = statusIcons[type];

  React.useEffect(() => {
    if (isVisible && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDelay, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.statusContainer} ${styles[type]}`}>
      <div className={styles.statusContent}>
        <div className={styles.statusIcon}>
          <IconComponent size={24} />
        </div>
        <div className={styles.statusText}>
          <h4 className={styles.statusTitle}>{title}</h4>
          <p className={styles.statusMessage}>{message}</p>
        </div>
        {onClose && (
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close notification"
          >
            <XCircle size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default StatusIndicator;
