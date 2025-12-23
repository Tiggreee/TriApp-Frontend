import { useState } from 'react';
import styles from './AuthModal.module.css';
import { signup, signin } from '../services/authService';

export function AuthModal({ onClose, onSuccess }) {
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await signup(email, password, name);
        setTimeout(() => {
          alert('🎉 ¡Premium Desbloqueado! Ahora tienes acceso a todas las features mágicas.');
        }, 300);
      } else {
        await signin(email, password);
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
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Renata"
                minLength={2}
                maxLength={30}
                required
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="renata@unicornio.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submit} disabled={loading}>
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
