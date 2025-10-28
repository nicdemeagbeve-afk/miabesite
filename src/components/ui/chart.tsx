"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Format: { THEME_NAME: { key: VALUE } }
type ChartConfig = {
  [k: string]: {
    label?: string;
    icon?: React.ComponentType<{ className?: string }>; // Explicitly allow className
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
  children: React.ReactNode;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function ChartContainer({
  config,
  className,
  children,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer> & {
  config: ChartConfig;
}) {
  return (
    <ChartContext.Provider value={{ config, children }}>
      <div
        data-chart={true}
        className={cn("flex aspect-video items-center justify-center text-foreground", className)}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

type ChartTooltipProps = {
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "dot" | "line";
  labelFormatter?: (value: string | number, name: string | number) => string; // Allow number for label/name
  valueFormatter?: (value: number, name: string | number) => string;
} & React.ComponentProps<typeof RechartsPrimitive.Tooltip>;

function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  hideLabel = false,
  hideIndicator = false,
  indicator = "dot",
  className, // className is already part of React.ComponentProps<typeof RechartsPrimitive.Tooltip>
}: ChartTooltipProps) {
  const { config } = React.useContext(ChartContext)!;

  if (!active || !payload?.length) {
    return null;
  }

  const nameKey = payload[0]?.name;

  return (
    <div
      className={cn(
        "grid min-w-[130px] items-center rounded-lg border border-border bg-background px-2.5 py-2 text-xs shadow-md",
        className
      )}
    >
      {!hideLabel && label ? (
        <div className="border-b border-muted pb-2 mb-2">
          <p className="font-bold text-foreground">
            {labelFormatter ? labelFormatter(label, nameKey!) : label}
          </p>
        </div>
      ) : null}
      <div className="grid gap-1.5">
          {payload.map((item: any, index: number) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = config[key]

            return (
              <div
                key={item.dataKey}
                className="flex items-center justify-between space-x-2"
              >
                <div className="flex items-center gap-1.5">
                  {itemConfig?.icon ? (
                    <itemConfig.icon
                      className={cn(
                        "h-3 w-3",
                        itemConfig?.color || item.color
                      )}
                    />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          itemConfig?.color || item.color
                        )}
                      />
                    )
                  )}
                  <p className="text-muted-foreground">
                    {itemConfig?.label || item.name}
                  </p>
                </div>
                <p className="font-medium text-foreground">
                  {valueFormatter
                    ? valueFormatter(item.value, item.name)
                    : item.value}
                </p>
              </div>
            )
          })}
        </div>
    </div>
  );
}

type ChartLegendProps = {
  content?: (props: any) => React.ReactNode;
  className?: string;
} & React.ComponentProps<typeof RechartsPrimitive.Legend>;

function ChartLegend({ content, className, ...props }: ChartLegendProps) {
  const { config } = React.useContext(ChartContext)!;

  if (!content) {
    return (
      <RechartsPrimitive.Legend
        content={({ payload }: { payload?: any[] }) => (
          <ul className={cn("flex flex-wrap justify-center gap-4", className)}>
            {payload?.map((item: any) => {
              const key = `${item.value}`
              const itemConfig = config[key]

              return (
                <li
                  key={key}
                  className={cn(
                    "flex items-center gap-1.5",
                    item.inactive && "opacity-50"
                  )}
                >
                  {itemConfig?.icon ? (
                    <itemConfig.icon
                      className={cn(
                        "h-3 w-3",
                        itemConfig?.color || item.color
                      )}
                    />
                  ) : (
                    <div
                      className={cn(
                        "h-2 w-2 shrink-0 rounded-full",
                        itemConfig?.color || item.color
                      )}
                    />
                  )}
                  {itemConfig?.label || item.value}
                </li>
              )
            })}
          </ul>
        )}
        {...props}
      />
    );
  }

  return (
    <RechartsPrimitive.Legend content={content} className={className} {...props} />
  );
}

const ChartPrimitive = {
  Container: ChartContainer,
  Tooltip: ChartTooltip,
  Legend: ChartLegend,
};

export { ChartPrimitive as Chart };