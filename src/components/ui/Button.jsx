import { cn } from "../../utils/cn";

export function Button({ className, variant = "primary", size = "md", ...props }) {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
    secondary: "bg-[#D6E4FF] text-primary border border-[#D6E4FF] hover:bg-[#C4D8FF] shadow-sm",
    outline: "border border-[#D6E4FF] bg-[#F0F5FF] hover:bg-[#E6EEFF] text-text-main shadow-sm",
    ghost: "hover:bg-[#D6E4FF]/50 text-text-muted",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5",
    lg: "px-8 py-3.5 text-lg",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none duration-200",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
