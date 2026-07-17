import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!correo || !contrasena) {
      setError('Debes ingresar correo y contraseña.');
      return;
    }

    const resultado = await iniciarSesion(correo, contrasena);
    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    navigate('/');
  }

  return (
    <div className="pagina-formulario">
      <h1>Iniciar Sesión</h1>

      <form onSubmit={manejarEnvio} className="formulario">
        <label>
          Correo electrónico
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </label>

        {error && <p className="mensaje-error">{error}</p>}

        <button type="submit" className="btn-primario">
          Ingresar
        </button>
      </form>

      <p>
        ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
      </p>
    </div>
  );
}
