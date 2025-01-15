import { useState, useEffect } from "react";

export function useCalculateWindowSize() {
  const [isSmallerThanBreakPoint, setIsSmallerThanBreakPoint] = useState(false);

  const checkWindowSize = () => {
    if (window.innerWidth < 768) {
      // Tailwind's "md" breakpoint
      setIsSmallerThanBreakPoint(true);
    } else {
      setIsSmallerThanBreakPoint(false);
    }
  };

  useEffect(() => {
    checkWindowSize(); // Check on mount
    window.addEventListener("resize", checkWindowSize); // Add resize listener

    return () => {
      window.removeEventListener("resize", checkWindowSize); // Clean up
    };
  }, []);

  return { isSmallerThanBreakPoint };
}
