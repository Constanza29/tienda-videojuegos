import { Link } from 'react-router-dom';
import type { Producto } from '../types';
import { useCart } from '../context/CartContext';
import { CarruselImagenes } from './CarruselImagenes';
import { PrecioProducto } from './PrecioProducto';

export function ProductoCard({ producto }: { producto: Producto }) {
  const { agregarAlCarrito } = useCart();
  const sinStock = producto.stock <= 0;

  return (
    <div className="producto-card">
      <Link to={`/producto/${producto.id}`}>
        <CarruselImagenes imagenes={producto.imagenes} alt={producto.nombre} />
      </Link>
      <span className="producto-categoria">{producto.categoria}</span>
      <h3 className="producto-nombre">{producto.nombre}</h3>

      <div className="producto-precios">
        <PrecioProducto precio={producto.precio} precioOferta={producto.precioOferta} />
      </div>

      <p className="producto-stock">{sinStock ? 'Sin stock' : `Stock: ${producto.stock}`}</p>

      <button disabled={sinStock} onClick={() => agregarAlCarrito(producto)} className="btn-primario">
        {sinStock ? 'Sin stock' : 'Agregar al carrito'}
      </button>
    </div>
  );
}
