import { useCallback, useEffect, useRef } from "react";

const SyncScroll = () => {
  const elementRefs = useRef<Element[]>([]);

  const handleScroll = useCallback((e: Event) => {
    if (!e.target) {
      return;
    }
    const scrollLeft = (e.target as Element).scrollLeft;
    elementRefs.current.forEach((element) => {
      if (element !== e.target && element.scrollLeft !== scrollLeft) {
        element.scrollLeft = scrollLeft;
      }
    });
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll("[data-sync-scroll]");
    elementRefs.current = Array.from(els);
    els.forEach((target) => {
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
