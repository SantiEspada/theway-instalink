import { useRef } from 'react';

import styles from './ComboInput.module.scss';

interface ComboInputProps {
  type?: 'text' | 'email';
  label: string;
  id: string;
  icon: JSX.Element;
  onInputChange?: (newValue: string) => void;
  onButtonClick?: () => void;
}

export function ComboInput(props: ComboInputProps) {
  const {
    type = 'text',
    label,
    id,
    icon,
    onInputChange = (newValue: string) => {},
    onButtonClick = () => {},
  } = props;

  const inputRef = useRef<HTMLInputElement>();

  const handleOnChange = () => {
    const newValue = inputRef.current?.value;

    onInputChange(newValue);
  };

  const handleButtonClick = () => {
    onButtonClick();
  };

  return (
    <div className={styles.comboInput}>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        className={styles.comboInput__input}
        type={type}
        onChange={handleOnChange}
        ref={inputRef}
        id={id}
        placeholder={label}
      />
      <button className={styles.comboInput__button} onClick={handleButtonClick}>
        {icon}
      </button>
    </div>
  );
}
