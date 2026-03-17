import { ReactNode, ElementType } from "react";
import Tooltip from "../Tooltip/Tooltip";

const variantClasses = {
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-transparent dark:border dark:border-emerald-600 dark:text-emerald-500 dark:hover:bg-emerald-600/10",
  danger:
    "bg-red-500 text-white hover:bg-red-600 dark:bg-transparent dark:border dark:border-red-500 dark:text-red-400 dark:hover:bg-red-500/10",
  warning:
    "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-transparent dark:border dark:border-yellow-400 dark:text-yellow-300 dark:hover:bg-yellow-400/10",
  info: "bg-cyan-500 text-white hover:bg-cyan-600 dark:bg-transparent dark:border dark:border-cyan-500 dark:text-cyan-400 dark:hover:bg-cyan-500/10",
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 dark:bg-transparent dark:border dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10",
};

type ButtonVariant = keyof typeof variantClasses;

type TooltipPosition = "top" | "right" | "bottom" | "left";

interface ButtonProps {
  children?: ReactNode;
  size?: "sm" | "md";
  variant?: ButtonVariant;
  startIcon?: ElementType;
  endIcon?: ElementType;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  toolTip?: {
    text?: string;
    position?: TooltipPosition;
  };
  disabled?: boolean;
  className?: string;
}

const Button = ({
  children,
  size = "md",
  variant = "info",
  startIcon: StartIcon,
  endIcon: EndIcon,
  onClick,
  toolTip,
  className = "",
  disabled = false,
}: ButtonProps) => {
  const sizeClasses = {
    sm: "px-3 py-2.5 text-[24px]",
    md: "px-5 py-3.5 text-md",
  };

  const btn = (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {StartIcon && <StartIcon size={16} />}
      {children}
      {EndIcon && <EndIcon size={16} />}
    </button>
  );

  const hasTooltip = !!toolTip?.text && toolTip.text.trim().length > 0;

  return hasTooltip ? (
    <Tooltip text={toolTip.text!} placement={toolTip?.position ?? "top"}>
      {btn}
    </Tooltip>
  ) : (
    btn
  );
};

export default Button;
