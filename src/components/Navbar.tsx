import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { rutaPublica } from '../services/rutaPublica';

export function Navbar() {
  const { usuarioActual, cerrarSesion } = useAuth();
  const { totalCantidad } = useCart();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();

  // cierra el menú móvil automáticamente cada vez que se navega a otra página
  useEffect(() => {
    setMenuAbierto(false);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={rutaPublica('logo.png')} alt="BytePlay" className="navbar-logo-img" />
      </Link>

      <button
        className="navbar-toggle"
        aria-label="Abrir menú de navegación"
        aria-expanded={menuAbierto}
        onClick={() => setMenuAbierto((abierto) => !abierto)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={menuAbierto ? 'navbar-links navbar-links-abierto' : 'navbar-links'}>
        <Link to="/">Inicio</Link>
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/contacto">Contacto</Link>
        <Link to="/carrito">Carrito ({totalCantidad})</Link>

        {usuarioActual ? (
          <>
            <span className="navbar-saludo">Hola, {usuarioActual.nombre}</span>
            <button onClick={cerrarSesion} className="btn-secundario">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/registro">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}
