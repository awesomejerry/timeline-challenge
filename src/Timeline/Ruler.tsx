import { useCallback, useEffect, useRef } from "react";
import { tenMultipliers } from "../utils";

type RulerProps = {
  time: number;
  setTime: (time: number) => void;
  duration: number;
  setDuration: (time: number) => void;
};
export const Ruler = ({ setTime, duration }: RulerProps) => {
  const draggingRef = useRef(false);

  useEffect(() => {
    document.body.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.body.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!e.target) {
        return;
      }
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      setTime(tenMultipliers(x));
    },
    [setTime]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    draggingRef.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggingRef.current) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      setTime(tenMultipliers(x));
    }
  }, []);

  return (
    <div
      className="px-4 py-2 min-w-0 
      border-b border-solid border-gray-700 
      overflow-x-auto overflow-y-hidden"
      data-testid="ruler"
      data-sync-scroll="horizontal"
    >
      <div
        className="h-6 rounded-md bg-white/25 select-none"
        style={{ width: `${duration}px` }}
        data-testid="ruler-bar"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      ></div>
    </div>
  );
};
