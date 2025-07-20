import { useRef } from "react";

export function useScrollToRef<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  const scrollToRef = (): void => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return [ref, scrollToRef] as const;
}
