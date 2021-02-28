import { useEffect, useState } from 'react';

export function useLocalStorageState<T = unknown>(
  localStorageKey: string,
  initialValue: T
): [value: T, setValue: (newValue: T) => void] {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    if (value === undefined) {
      setValue(JSON.parse(localStorage.getItem(localStorageKey)));
    } else {
      localStorage.setItem(localStorageKey, JSON.stringify(value));
    }
  }, [value]);

  return [value, setValue];
}
