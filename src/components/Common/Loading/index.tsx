import { memo } from "react";

const Loading = ({ text }: { text: string }) => {
  return (
    // Thêm flex, items-center và gap để icon và text nằm đẹp trên một hàng
    <div className="flex items-center justify-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.2em" // Tăng nhẹ kích thước cho cân với text
        height="1.2em"
        viewBox="0 0 24 24"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path strokeDasharray="18" d="M12 3c4.97 0 9 4.03 9 9">
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              dur="0.3s"
              values="18;0"
            />
            <animateTransform
              attributeName="transform"
              dur="1.5s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;360 12 12"
            />
          </path>
          <path
            strokeDasharray="60"
            d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
            opacity=".3"
          >
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              dur="1.2s"
              values="60;0"
            />
          </path>
        </g>
      </svg>
      {/* Đảm bảo text không bị xuống dòng */}
      <span className="whitespace-nowrap">{text}</span>
    </div>
  );
};

export default memo(Loading);
