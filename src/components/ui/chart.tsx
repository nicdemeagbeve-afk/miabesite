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

interface ChartContainerComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: React.ReactElement; // Changed to React.ReactElement
  // Props for RechartsPrimitive.ResponsiveContainer
  aspect?: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['aspect'];
  width?: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['width'];
  height?: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['height'];
  minWidth?: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['minWidth'];
  minHeight?: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['minHeight'];
  maxHeight?: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['maxHeight'];
  debounce?: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['debounce'];
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerComponentProps>(
  ({ config, className, children, aspect, width, height, minWidth, minHeight, maxHeight, debounce, ...props }, ref) => (
    <ChartContext.Provider value={{ config, children }}>
      <div
        ref={ref}
        data-chart={true}
        className={cn("flex aspect-video items-center justify-center text-foreground", className)}
        {...props} // These are now only HTMLDivElement props
      >
        <RechartsPrimitive.ResponsiveContainer
          aspect={aspect}
          width={width}
          height={height}
          minWidth={minWidth}
          minHeight={minHeight}
          maxHeight={maxHeight}
          debounce={debounce}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
);
ChartContainer.displayName = "ChartContainer";


type ChartTooltipProps = Omit<React.ComponentProps<typeof RechartsPrimitive.Tooltip>, 'content'> & {
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "dot" | "line";
  labelFormatter?: (value: string | number, name: string | number) => string; // Allow number for label/name
  valueFormatter?: (value: number, name: string | number) => string;
};

function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  hideLabel = false,
  hideIndicator = false,
  indicator = "dot",
  wrapperClassName, // Recharts passes this for the wrapper div
  wrapperStyle,   // Recharts passes this for the wrapper div
  ...props // Capture any other Recharts-specific props (e.g., formatter, separator)
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
        wrapperClassName // Use wrapperClassName
      )}
      style={wrapperStyle} // Apply wrapperStyle
      // Do NOT spread ...props here, as they are Recharts-specific and not for a div
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

type ChartLegendProps = React.ComponentPropsWithoutRef<typeof RechartsPrimitive.Legend> & {
  content?: (props: any) => React.ReactNode;
  className?: string;
};

const ChartLegend = React.forwardRef<HTMLLIElement, ChartLegendProps>(
  ({ className, content, ...props }, ref) => {
    const { config } = React.useContext(ChartContext)!;

    if (!content) {
      return (
        <RechartsPrimitive.Legend
          ref={ref as React.Ref<any>} // Pass ref directly to RechartsPrimitive.Legend
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
);
ChartLegend.displayName = "ChartLegend";


const ChartPrimitive = {
  Container: ChartContainer,
  Tooltip: ChartTooltip,
  Legend: ChartLegend,
};

export { ChartPrimitive as Chart };