import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CarruselImagenes } from '../components/CarruselImagenes';
import { PrecioProducto } from '../components/PrecioProducto';

export function DetalleProducto() {
  const { id } = useParams<{ id: string }>();
  const { productos, agregarAlCarrito } = useCart();

  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return (
      <div className="pagina-detalle">
        <h2>Producto no encontrado</h2>
        <Link to="/catalogo">Volver al catálogo</Link>
      </div>
    );
  }

  const sinStock = producto.stock <= 0;

  return (
    <div className="pagina-detalle">
      <div className="detalle-carrusel">
        <CarruselImagenes imagenes={producto.imagenes} alt={producto.nombre} />
      </div>
      <div className="detalle-info">
        <span className="producto-categoria">{producto.categoria}</span>
        <h1>{producto.nombre}</h1>
        <p className="detalle-descripcion">{producto.descripcion}</p>

        <div className="producto-precios">
          <PrecioProducto precio={producto.precio} precioOferta={producto.precioOferta} />
        </div>

        <p className="producto-stock">{sinStock ? 'Sin stock' : `Stock disponible: ${producto.stock}`}</p>

        <button disabled={sinStock} onClick={() => agregarAlCarrito(producto)} className="btn-primario">
          {sinStock ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
