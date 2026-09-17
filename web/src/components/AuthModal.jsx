import { useState, useEffect } from 'react';
import styles from './AuthModal.module.css';
import { signup, signin } from '../services/authService';
import { useFormValidation } from '../hooks/useFormValidation';

export function AuthModal({ onClose, onSuccess }) {
  const [isSignup, setIsSignup] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { values, errors, isValid, handleChange, resetForm } = useFormValidation();

  useEffect(() => {
    resetForm();
  }, [isSignup, resetForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await signup(values.email, values.password, values.name);
        setTimeout(() => {
          alert('🎉 ¡Premium Desbloqueado! Ahora tienes acceso a todas las features mágicas.');
        }, 300);
      } else {
        await signin(values.email, values.password);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          X
        </button>
        
        <h2 className={styles.title}>
          {isSignup ? '🦄 Únete a la Magia' : '✨ Bienvenida de Vuelta'}
        </h2>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${isSignup ? styles.active : ''}`}
            onClick={() => setIsSignup(true)}
          >
            Registro
          </button>
          <button
            className={`${styles.tab} ${!isSignup ? styles.active : ''}`}
            onClick={() => setIsSignup(false)}
          >
            Iniciar Sesión
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {isSignup && (
            <div className={styles.field}>
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                value={values.name || ''}
                onChange={handleChange}
                placeholder="Renata"
                minLength={2}
                maxLength={30}
                required
              />
              {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email || ''}
              onChange={handleChange}
              placeholder="renata@unicornio.com"
              required
            />
            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={values.password || ''}
              onChange={handleChange}
              placeholder="••••••••"
              minLength={6}
              required
            />
            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submit} disabled={loading || !isValid}>
            {loading ? '⏳ Procesando...' : isSignup ? '🌟 Registrarse' : '🚀 Entrar'}
          </button>
        </form>

        <div className={styles.benefits}>
          <p className={styles.benefitsTitle}>Al registrarte desbloqueas:</p>
          <div className={styles.benefitsList}>
            <span>🎧 Música</span>
            <span>🎨 Colores</span>
            <span>🦄 Avatares</span>
            <span>💡 Consejos</span>
            <span>💄 Maquillaje</span>
          </div>
        </div>
      </div>
    </div>
  );
}
