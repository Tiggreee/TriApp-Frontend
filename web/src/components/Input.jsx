import styles from './Input.module.css';

export function Input({ placeholder, value, onChange, type = 'text', ...props }) {
  const autoComplete = type === 'password' 
    ? (props.name === 'password' ? 'current-password' : 'new-password')
    : type === 'email' 
    ? 'email' 
    : 'off';

  return (
    <input 
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={styles.input}
      autoComplete={autoComplete}
      {...props}
    />
  );
}
