type PlayheadProps = {
  time: number;
  scrollLeft?: number;
};

export const Playhead = ({ time, scrollLeft = 0 }: PlayheadProps) => {
  const outOfView = time < scrollLeft;
  return (
    <div
      className="absolute left-[316px] h-full border-l-2 border-solid border-yellow-600 z-10"
      data-testid="playhead"
      style={{
        transform: `translateX(calc(${time - scrollLeft}px - 50%))`,
        display: outOfView ? "none" : "block",
      }}
    >
      <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
    </div>
  );
};
