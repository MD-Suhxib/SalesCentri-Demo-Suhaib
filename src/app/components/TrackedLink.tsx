import React from "react";
import Link from "next/link";

interface TrackedLinkProps {
  href: string;
  trackingText: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export const TrackedLink: React.FC<TrackedLinkProps> = ({
  href,
  trackingText,
  children,
  className,
  target,
  rel,
  ...props
}) => {
  return (
    <Link
      href={href}
      data-track={trackingText}
      className={className}
      target={target}
      rel={rel}
      {...props}
    >
      {children}
    </Link>
  );
};
