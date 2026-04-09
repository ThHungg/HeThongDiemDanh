import { memo } from "react";

const ProgressBar = ({
  percent,
  attended,
  total,
}: {
  percent: number | undefined | null;
  attended: number;
  total: number;
}) => {
  if (percent === undefined || percent === null) {
    return <div>-</div>;
  }

  return (
    <div>
      <div className="mb-1">
        <p className="flex items-center justify-between text-gray-500 text-[13px] font-semibold">
          Tiến độ điểm danh{" "}
          <span className="text-green-500 text-[14px] font-bold">
            {percent}%{" "}
            <span>
              ({attended}/{total})
            </span>
          </span>
        </p>
      </div>

      <div className="flex w-full items-center gap-1 ">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`bg-green-500 h-full transition-all duration-700 ease-out rounded-full`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProgressBar);
