import styles from './Input.module.css';

export function Input({ placeholder, value, onChange, type = 'text', ...props }) {
  return (
    <input 
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={styles.input}
      {...props}
    />
  );
}
