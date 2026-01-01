import React from 'react';

const GlobalStyles: React.FC = () => {
  return (
    <style jsx global>{`
      /* Background gradient */
      body {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1));
        border: 1px solid rgba(59, 130, 246, 0.2);
      }

      /* Glassmorphism effect */
      .backdrop-blur-sm {
        backdrop-filter: blur(10px);
      }

      /* General styles */
      * {
        box-sizing: border-box;
      }
      html,
      body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        text-size-adjust: 100%;
      }

      /* Glassmorphism buttons */
      .glass-button {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(59, 130, 246, 0.3);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
      }
      .glass-button:hover {
        background: rgba(59, 130, 246, 0.1);
        border-color: rgba(59, 130, 246, 0.5);
        box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }
    `}</style>
  );
};

export default GlobalStyles;