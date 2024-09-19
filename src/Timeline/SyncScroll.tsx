import { useCallback, useEffect, useRef } from "react";

type SyncScrollProps = {
  setScrollLeft?: (value: number) => void;
};

const checkSyncDirection = ({
  target,
  direction,
}: {
  target: Element;
  direction: "horizontal" | "vertical";
}) => target.getAttribute("data-sync-scroll")?.indexOf(direction) !== -1;

const SyncScroll = ({ setScrollLeft }: SyncScrollProps) => {
  const elementRefs = useRef<Element[]>([]);

  const handleScroll = useCallback((e: Event) => {
    if (!e.target) {
      return;
    }
    const scrollElement = e.target as Element;
    const syncScrollLeft = checkSyncDirection({
      target: scrollElement,
      direction: "horizontal",
    });
    const syncScrollTop = checkSyncDirection({
      target: scrollElement,
      direction: "vertical",
    });

    const scrollLeft = scrollElement.scrollLeft;
    const scrollTop = scrollElement.scrollTop;
    if (syncScrollLeft) {
      setScrollLeft?.(scrollLeft);
    }
    elementRefs.current.forEach((element) => {
      if (element === scrollElement) {
        return;
      }

      if (
        syncScrollLeft &&
        checkSyncDirection({ target: element, direction: "horizontal" })
      ) {
        if (element.scrollLeft !== scrollLeft) {
          element.scrollLeft = scrollLeft;
        }
      }
      if (
        syncScrollTop &&
        checkSyncDirection({ target: element, direction: "vertical" })
      ) {
        if (element.scrollTop !== scrollTop) {
          element.scrollTop = scrollTop;
        }
      }
    });
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll("[data-sync-scroll]");
    elementRefs.current = Array.from(elements);
    elements.forEach((target) => {
      target.addEventListener("scroll", handleScroll);
    });
    return () => {
      elementRefs.current.forEach((target) => {
        target.removeEventListener("scroll", handleScroll);
      });
    };
  }, []);

  return <></>;
};

export { SyncScroll };
