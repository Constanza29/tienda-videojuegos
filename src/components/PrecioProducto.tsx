import { formatoCLP } from '../services/formato';

interface PrecioProductoProps {
  precio: number;
  precioOferta?: number;
}

// Muestra el precio normal, o si hay oferta, el precio tachado + el precio
// de oferta destacado. Se usa tanto en la tarjeta del catálogo como en el
// detalle de producto, para no repetir este bloque en los dos lugares.
export function PrecioProducto({ precio, precioOferta }: PrecioProductoProps) {
  const tieneOferta = precioOferta !== undefined;

  if (!tieneOferta) {
    return <span className="precio-normal">{formatoCLP.format(precio)}</span>;
  }

  return (
    <>
      <span className="precio-tachado">{formatoCLP.format(precio)}</span>
      <span className="precio-oferta">{formatoCLP.format(precioOferta)}</span>
    </>
  );
}
