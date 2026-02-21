import clsx from "clsx";
import { useId } from "react";

function BrandLogo({ size = 38, className = "" }) {
  const gradientId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="FocusFlow logo"
      className={clsx("shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#558f4e" />
          <stop offset="100%" stopColor="#f06121" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="16" fill={`url(#${gradientId})`} />
      <circle cx="32" cy="32" r="17" fill="none" stroke="#fff" strokeWidth="4" opacity="0.92" />
      <path d="M32 20V33L41 37" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="33" r="3.2" fill="#fff" />
    </svg>
  );
}

export default BrandLogo;
