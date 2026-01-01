import React from "react";

interface TrackedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  trackingId: string;
  children: React.ReactNode;
}

export const TrackedButton: React.FC<TrackedButtonProps> = ({
  trackingId,
  children,
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Call the original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button onClick={handleClick} data-track={trackingId} {...props}>
      {children}
    </button>
  );
};
