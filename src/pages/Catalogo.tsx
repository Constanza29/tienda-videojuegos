import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ProductoCard } from '../components/ProductoCard';
import type { Categoria } from '../types';

const CATEGORIAS: Array<Categoria | 'Todas'> = [
  'Todas',
  'Consolas',
  'Juegos',
  'Accesorios',
  'Pases de Batalla',
  'Gift Cards',
];

type Orden = 'defecto' | 'menor-a-mayor' | 'mayor-a-menor';

export function Catalogo() {
  const { productos } = useCart();
  const [filtro, setFiltro] = useState<Categoria | 'Todas'>('Todas');
  const [orden, setOrden] = useState<Orden>('defecto');

  const productosFiltrados =
    filtro === 'Todas' ? productos : productos.filter((p) => p.categoria === filtro);

  // el precio "real" a comparar es el de oferta si existe, igual que en el carrito
  const precioComparable = (p: (typeof productos)[number]) => p.precioOferta ?? p.precio;

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    if (orden === 'menor-a-mayor') return precioComparable(a) - precioComparable(b);
    if (orden === 'mayor-a-menor') return precioComparable(b) - precioComparable(a);
    return 0; // 'defecto': mantiene el orden original
  });

  return (
    <div className="pagina-catalogo">
      <h1>Catálogo</h1>

      <div className="filtros-categoria">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={filtro === cat ? 'filtro-activo' : ''}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="filtro-orden">
        <label htmlFor="orden-precio">Ordenar por precio:</label>
        <select
          id="orden-precio"
          value={orden}
          onChange={(e) => setOrden(e.target.value as Orden)}
        >
          <option value="defecto">Relevancia</option>
          <option value="menor-a-mayor">Menor a mayor</option>
          <option value="mayor-a-menor">Mayor a menor</option>
        </select>
      </div>

      <div className="grilla-productos">
        {productosOrdenados.map((p) => (
          <ProductoCard key={p.id} producto={p} />
        ))}
      </div>

      {productosOrdenados.length === 0 && <p>No hay productos en esta categoría.</p>}
    </div>
  );
}
