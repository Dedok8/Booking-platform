import { useCallback, useEffect, useState } from "react";

export const useResendCooldown = (init = 0) => {
  const [seconds, setSeconds] = useState(init);

  useEffect(() => {
    if (seconds <= 0) return;

    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const start = useCallback((value: number) => setSeconds(value), []);

  return { seconds, start };
};
