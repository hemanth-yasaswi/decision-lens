import { cn } from "../../utils/cn";

export function Input({ className, label, error, ...props }) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-[#475569] ml-1 transition-colors duration-300">
          {label}
        </label>
      )}
      <input
        className={cn(
          "flex h-11 w-full rounded-xl border border-[#D6E4FF] bg-[#F0F5FF] px-4 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 text-[#1E293B]",
          error && "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 ml-1">{error}</p>
      )}
    </div>
  );
}
