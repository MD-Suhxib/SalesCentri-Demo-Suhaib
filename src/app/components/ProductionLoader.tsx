'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './ProductionLoader.module.css';

interface ProductionLoaderProps {
  message?: string;
  progress?: number;
  isVisible: boolean;
  onCancel?: () => void;
}

export const ProductionLoader: React.FC<ProductionLoaderProps> = ({
  message = 'Generating leads...',
  progress,
  isVisible,
  onCancel
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isVisible || !mounted) return null;

  const loaderContent = (
    <div
      className={styles.loaderOverlay}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '1rem',
        boxSizing: 'border-box'
      }}
    >
      {/* Min-height wrapper for proper centering */}
      <div
        style={{
          minHeight: 'calc(100vh - 2rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem 0',
          boxSizing: 'border-box',
          width: '100%',
          flexShrink: 0
        }}
      >
        <div className={styles.loaderContainer}>
          <div className={styles.loaderSpinner}>
            <div className={styles.spinnerRing}></div>
            <div className={styles.spinnerRing}></div>
            <div className={styles.spinnerRing}></div>
          </div>

          <div className={styles.loaderContent}>
            <h3 className={styles.loaderTitle}>{message}</h3>

            {progress !== undefined && (
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.progressFill} ${styles.progressWidth}`}
                    data-progress={Math.min(100, Math.max(0, progress))}
                  />
                </div>
                <span className={styles.progressText}>{Math.round(progress)}%</span>
              </div>
            )}

            <p className={styles.loaderSubtext}>
              Please wait while we analyze your requirements and generate high-quality leads
            </p>

            {onCancel && (
              <button
                onClick={onCancel}
                className={styles.cancelButton}
                style={{
                  marginTop: '1.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                }}
              >
                Stop Research
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render loader at document root, avoiding parent container constraints
  if (typeof window !== 'undefined' && document.body) {
    return createPortal(loaderContent, document.body);
  }

  return null;
};

export default ProductionLoader;
