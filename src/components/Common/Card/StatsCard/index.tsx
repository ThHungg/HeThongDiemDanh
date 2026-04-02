"use client";
import { memo, ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: string; 
}

const StatsCard = ({
  label,
  value,
  icon,
  color = "#2563EB",
}: StatsCardProps) => {
  return (
    <div className="flex items-center gap-4 bg-white px-4 py-5 rounded-2xl w-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div
        className="p-3 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        {icon}
      </div>

      <div className="flex flex-col">
        <h6 className="text-[13px] font-semibold text-gray-500 whitespace-nowrap uppercase tracking-wide">
          {label}
        </h6>
        <h5 className="text-2xl font-bold text-gray-900 mt-0.5">{value}</h5>
      </div>
    </div>
  );
};

export default memo(StatsCard);
