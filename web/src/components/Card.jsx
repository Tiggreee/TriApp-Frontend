import styles from './Card.module.css';

export function Card({ children, className = '', onClick }) {
  return (
    <div className={`${styles.card} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
