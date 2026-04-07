import { cn } from "../../utils/cn";

export function Loader({ className }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D6E4FF] border-t-primary transition-colors duration-300" />
    </div>
  );
}
