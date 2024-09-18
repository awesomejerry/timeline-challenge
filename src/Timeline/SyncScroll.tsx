import { useCallback, useEffect, useRef } from "react";

const SyncScroll = () => {
  const elementRefs = useRef<Element[]>([]);

  const handleScroll = useCallback((e: Event) => {
    if (!e.target) {
      return;
    }
    const scrollElement = e.target as Element;
    const scrollLeft = scrollElement.scrollLeft;
    const scrollTop = scrollElement.scrollTop;
    elementRefs.current.forEach((element) => {
      if (element === scrollElement) {
        return;
      }
      if (
        scrollElement
          .getAttribute("data-sync-scroll")
          ?.indexOf("horizontal") !== -1 &&
        element.getAttribute("data-sync-scroll")?.indexOf("horizontal") !== -1
      ) {
        if (element.scrollLeft !== scrollLeft) {
          element.scrollLeft = scrollLeft;
        }
      }
      if (
        scrollElement.getAttribute("data-sync-scroll")?.indexOf("vertical") !==
          -1 &&
        element.getAttribute("data-sync-scroll")?.indexOf("vertical") !== -1
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
