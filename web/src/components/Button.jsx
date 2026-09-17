import styles from './Button.module.css';

export function Button({ children, variant = 'primary', type = 'button', onClick, ...props }) {
  return (
    <button 
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
