import { cn } from "../../utils/cn";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#D6E4FF] bg-[#F0F5FF] p-6 shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
