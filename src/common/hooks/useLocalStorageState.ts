import { useEffect, useState } from 'react';

export function useLocalStorageState<T = unknown>(
  localStorageKey: string,
  initialValue: T
): [value: T, setValue: (newValue: T) => void] {
  const [value, setValue] = useState<T>(undefined);

  useEffect(() => {
    if (value === undefined) {
      const localStorageValue = localStorage.getItem(localStorageKey);

      if (localStorageValue) {
        setValue(JSON.parse(localStorageValue));
      } else {
        setValue(initialValue);
      }
    } else {
      localStorage.setItem(localStorageKey, JSON.stringify(value));
    }
  }, [value]);

  return [value, setValue];
}
