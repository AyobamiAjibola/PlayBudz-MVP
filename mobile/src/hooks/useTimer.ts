import { useCallback, useEffect, useState } from "react";

export function useTimer(duration = 5 * 60) {
  const [expiresAt, setExpiresAt] = useState(
    () => Date.now() + duration * 1000
  );

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const restart = useCallback(() => {
    setExpiresAt(Date.now() + duration * 1000);
    setNow(Date.now());
  }, [duration]);

  const timeLeft = Math.max(
    0,
    Math.ceil((expiresAt - now) / 1000)
  );

  return {
    minutes: Math.floor(timeLeft / 60),
    seconds: timeLeft % 60,
    isExpired: timeLeft === 0,
    restart,
  };
}