import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  correoValido,
  esMayorDeEdad,
  contrasenaValida,
  formatearFechaAlmacenamiento,
} from '../services/validaciones';

export function Registro() {
  const { registrarUsuario } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault();
    setError('');
    setExito('');

    if (!nombre.trim() || !fechaNacimiento || !correo || !contrasena || !repetirContrasena) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (!correoValido(correo)) {
      setError('El correo debe ser de dominio @gmail.com o @inacap.cl.');
      return;
    }
    if (!esMayorDeEdad(fechaNacimiento)) {
      setError('Debes ser mayor de 18 años para registrarte.');
      return;
    }
    if (contrasena !== repetirContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!contrasenaValida(contrasena)) {
      setError(
        'La contraseña debe tener mínimo 8 caracteres, un número, una mayúscula, una minúscula y un carácter especial.'
      );
      return;
    }

    const resultado = await registrarUsuario({
      nombre: nombre.trim(),
      correo: correo.trim(),
      contrasena,
      fechaNacimiento: formatearFechaAlmacenamiento(fechaNacimiento),
    });

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    setExito(resultado.mensaje);
    setTimeout(() => navigate('/login'), 1200);
  }

  return (
    <div className="pagina-formulario">
      <h1>Registrarse</h1>

      <form onSubmit={manejarEnvio} className="formulario">
        <label>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>

        <label>
          Fecha de nacimiento
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
          />
        </label>

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

        <label>
          Repetir contraseña
          <input
            type="password"
            value={repetirContrasena}
            onChange={(e) => setRepetirContrasena(e.target.value)}
          />
        </label>

        {error && <p className="mensaje-error">{error}</p>}
        {exito && <p className="mensaje-exito">{exito}</p>}

        <button type="submit" className="btn-primario">
          Crear cuenta
        </button>
      </form>

      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
}
