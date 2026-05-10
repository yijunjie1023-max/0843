import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "green" | "blue" | "ghost";

const variantClasses: Record<Variant, string> = {
  green:
    "bg-duo-green text-white border-2 border-duo-green-dark shadow-[0_4px_0_0_#358000] active:shadow-[0_2px_0_0_#358000]",
  blue:
    "bg-duo-blue text-white border-2 border-duo-blue-dark shadow-[0_4px_0_0_#137fb3] active:shadow-[0_2px_0_0_#137fb3]",
  ghost:
    "bg-duo-surface text-duo-ink border-2 border-duo-surface2 shadow-[0_4px_0_0_#12121f] active:shadow-[0_2px_0_0_#12121f] hover:bg-duo-surface2",
};

/** 4px 底部实心投影 + 按下 2px 下沉（含阴影同步收缩），贴合多邻国肉感按钮 */
const baseClasses =
  "relative inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-bold transition-[transform,box-shadow] duration-100 ease-out select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duo-blue focus-visible:ring-offset-2 focus-visible:ring-offset-duo-bg active:translate-y-[2px]";

export type DuoButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
};

export function DuoButton({
  variant = "green",
  href,
  children,
  className = "",
  disabled,
  ...rest
}: DuoButtonProps) {
  const cls = [baseClasses, variantClasses[variant], className]
    .filter(Boolean)
    .join(" ");

  if (href && !disabled) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  const disabledCls =
    "opacity-50 cursor-not-allowed !shadow-none translate-y-0 pointer-events-none";

  return (
    <button
      type="button"
      disabled={disabled}
      className={[cls, disabled ? disabledCls : ""].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
