import { useState, useEffect } from "react";

/**
 * useDebounce - Debounces a value by the specified delay.
 * Useful for search inputs and auto-complete fields.
 */
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
