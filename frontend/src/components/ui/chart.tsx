import * as React from "react";
import { cn } from "../../lib/utils";

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<{ label: string; value: number; color?: string }>;
  type?: "bar" | "doughnut" | "line";
  height?: number;
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ className, data, type = "bar", height = 200, ...props }, ref) => {
    const maxValue = Math.max(...data.map((item) => item.value));
    const colors = [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#f97316",
      "#06b6d4",
      "#84cc16",
      "#ec4899",
      "#6366f1",
    ];

    if (type === "bar") {
      return (
        <div
          ref={ref}
          className={cn("w-full", className)}
          style={{ height }}
          {...props}
        >
          <div className="flex h-full items-end justify-between gap-1 pb-12">
            {data.map((item, index) => (
              <div
                key={item.label}
                className="flex flex-col items-center flex-1 h-full max-w-20"
              >
                <div className="flex flex-col items-center justify-end h-full w-full">
                  <div className="text-xs font-medium text-gray-900 mb-1">
                    {item.value}
                  </div>
                  <div
                    className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                    style={{
                      height: `${Math.max((item.value / maxValue) * 70, 4)}%`,
                      backgroundColor:
                        item.color || colors[index % colors.length],
                      minHeight: "4px",
                      minWidth: "24px",
                    }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-600 text-center break-words w-full">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (type === "doughnut") {
      const total = data.reduce((sum, item) => sum + item.value, 0);
      let currentAngle = 0;
      const radius = 60;
      const center = 80;

      return (
        <div
          ref={ref}
          className={cn("flex items-center justify-center", className)}
          {...props}
        >
          <div className="flex flex-col items-center">
            <svg width={center * 2} height={center * 2} className="mb-4">
              {data.map((item, index) => {
                const angle = (item.value / total) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                currentAngle += angle;

                const x1 =
                  center + radius * Math.cos((startAngle * Math.PI) / 180);
                const y1 =
                  center + radius * Math.sin((startAngle * Math.PI) / 180);
                const x2 =
                  center + radius * Math.cos((endAngle * Math.PI) / 180);
                const y2 =
                  center + radius * Math.sin((endAngle * Math.PI) / 180);

                const largeArcFlag = angle > 180 ? 1 : 0;

                return (
                  <path
                    key={item.label}
                    d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={item.color || colors[index % colors.length]}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                );
              })}
              <circle
                cx={center}
                cy={center}
                r={30}
                fill="white"
                className="drop-shadow-sm"
              />
              <text
                x={center}
                y={center}
                textAnchor="middle"
                dy="0.3em"
                className="text-lg font-semibold fill-gray-900"
              >
                {total}
              </text>
            </svg>
            <div className="grid grid-cols-1 gap-2">
              {data.map((item, index) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        item.color || colors[index % colors.length],
                    }}
                  />
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
);

Chart.displayName = "Chart";

export { Chart };
