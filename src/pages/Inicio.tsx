import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ProductoCard } from '../components/ProductoCard';
import { rutaPublica } from '../services/rutaPublica';

export function Inicio() {
  const { productos } = useCart();
  const destacados = productos.filter((p) => p.destacado).slice(0, 3);

  return (
    <div className="pagina-inicio">
      <section className="hero">
        <img src={rutaPublica('logo.png')} alt="BytePlay - Juega. Elige. Vive." className="hero-logo" />
        <p>Todo para gamers: consolas, juegos, accesorios y mucho más.</p>
        <Link to="/catalogo" className="btn-primario btn-flotante">
          Ver catálogo
        </Link>
      </section>

      <section className="quienes-somos">
        <div className="quienes-somos-texto">
          <h2>¿Quiénes Somos?</h2>
          <p>
            BytePlay es una tienda especializada en videojuegos, fundada por un estudiante de
            INACAP apasionado por el mundo gamer. Ofrecemos consolas, títulos de última
            generación, accesorios y gift cards para que vivas la mejor experiencia de juego.
          </p>
        </div>
        <img
          src={rutaPublica('Nosotros/Nosotros.png')}
          alt="Equipo BytePlay"
          className="quienes-somos-imagen"
        />
      </section>

      <section className="info-cards">
        <div className="info-card">
          <span className="info-card-icono">🕒</span>
          <h3>Horario de Atención</h3>
          <p>Lunes a viernes: 09:00 - 19:00 hrs.<br />Sábado: 10:00 - 14:00 hrs.</p>
        </div>
        <div className="info-card">
          <span className="info-card-icono">🚚</span>
          <h3>Despacho a Domicilio</h3>
          <p>Envíos a todo Chile en 24-72 hrs. hábiles. Retiro en tienda disponible.</p>
        </div>
        <div className="info-card">
          <span className="info-card-icono">🔒</span>
          <h3>Pago Seguro</h3>
          <p>Tus datos y compras siempre protegidos, con múltiples medios de pago.</p>
        </div>
        <div className="info-card">
          <span className="info-card-icono">🎧</span>
          <h3>Soporte Gamer</h3>
          <p>Atención personalizada para resolver tus dudas antes y después de tu compra.</p>
        </div>
      </section>

      <section className="destacados">
        <h2>Productos Destacados</h2>
        <div className="grilla-productos">
          {destacados.map((p) => (
            <ProductoCard key={p.id} producto={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
