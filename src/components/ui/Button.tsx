"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Button({ children, className = "", style, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        px-5 py-3 rounded-full border-none font-medium text-sm
        bg-amber-500 text-white cursor-pointer
        transition-all duration-200
        hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/50
        focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-500 disabled:hover:shadow-none
        ${className}
      `}
      style={style}>
      {children}
    </button>
  );
}
