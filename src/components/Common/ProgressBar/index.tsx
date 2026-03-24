import { memo } from "react";

const ProgressBar = ({ percent }: { percent: number | undefined | null }) => {
  if (percent === undefined || percent === null) {
    return <div>-</div>;
  }
  const color = percent < 50 ? "orange" : "red";
  const bgColor = color === "orange" ? "bg-orange-500" : "bg-[#8B0000]";
  const textColor = color === "orange" ? "text-orange-500" : "text-[#8B0000]";
  return (
    <div className="flex w-full max-w-[150px] items-center gap-1 ">
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`${bgColor} h-full transition-all duration-700 ease-out rounded-full`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <span className={`text-xs font-bold min-w-[30px] ${textColor}`}>
        {percent}%
      </span>
    </div>
  );
};

export default memo(ProgressBar);
