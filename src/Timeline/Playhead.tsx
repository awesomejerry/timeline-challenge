type PlayheadProps = {
  time: number;
  scrollLeft?: number;
};

export const Playhead = ({ time, scrollLeft = 0 }: PlayheadProps) => {
  // NOTE: 15px is the left padding of the ruler (1rem ~= 16px) - 1px
  const outOfView = time < scrollLeft - 15;
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
