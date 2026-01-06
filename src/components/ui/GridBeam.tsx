
import React from "react";
import { cn } from "@/lib/utils";

export const GridBeam = ({
  className,
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  maxDelay = 1,
  repeatDelay = 1,
  delay = 2,
  ...props
}: {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: number | string;
  numSquares?: number;
  className?: string;
  maxDelay?: number;
  repeatDelay?: number;
  delay?: number;
} & React.ComponentPropsWithoutRef<"svg">) => {
  const id = React.useId();

  // Array of square positions to animate independently if needed
  // For a "scan" effect, we will animate a gradient beam over the grid

  return (
    <div className={cn("pointer-events-none absolute inset-0 size-full overflow-hidden [mask-image:radial-gradient(ellipse_at_center,white,transparent)]", className)}>
      {/* Grid - Brighter for visibility */}
      <div className="absolute inset-0 bg-transparent bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#00000000,#000000)]"></div>

      {/* The Beam - Brighter and Cyan */}
      <div className="absolute top-0 left-0 right-0 h-[100px] z-10 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent animate-scan" style={{ animationDuration: '3s', animationIterationCount: 'infinite', animationTimingFunction: 'linear' }}></div>

      {/* Style for animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scan {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
          .animate-scan {
            animation-name: scan;
          }
        `}} />
    </div>
  );
};

export default GridBeam;
