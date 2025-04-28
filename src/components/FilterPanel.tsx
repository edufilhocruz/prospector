
import { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  title: string;
  icon: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export const FilterPanel = ({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: FilterPanelProps) => {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between bg-[#1a2631] p-3 text-white hover:bg-[#1f2d39] transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      <div
        className={cn(
          "px-3 py-3 bg-[#14252e] transition-all duration-200",
          isOpen ? "block" : "hidden"
        )}
      >
        {children}
      </div>
    </div>
  );
};

