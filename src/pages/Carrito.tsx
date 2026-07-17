import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatoCLP } from '../services/formato';

export function Carrito() {
  const { usuarioActual } = useAuth();
  const {
    items,
    agregarAlCarrito,
    disminuirCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    confirmarCompra,
    totalSinDescuento,
    descuentoAplicado,
    totalConDescuento,
  } = useCart();
  const [mensaje, setMensaje] = useState<{ ok: boolean; texto: string } | null>(null);

  function manejarConfirmar() {
    const resultado = confirmarCompra();
    setMensaje({ ok: resultado.ok, texto: resultado.mensaje });
  }

  if (items.length === 0) {
    return (
      <div className="pagina-carrito">
        <h1>Carrito de Compras</h1>
        {mensaje && (
          <p className={mensaje.ok ? 'mensaje-exito' : 'mensaje-error'}>{mensaje.texto}</p>
        )}
        <p>Tu carrito está vacío.</p>
        <Link to="/catalogo" className="btn-primario">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="pagina-carrito">
      <h1>Carrito de Compras</h1>

      {!usuarioActual && (
        <p className="mensaje-error">
          Debes <Link to="/login">iniciar sesión</Link> para poder confirmar la compra.
        </p>
      )}

      <table className="tabla-carrito">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const precioUnitario = item.producto.precioOferta ?? item.producto.precio;
            const sinStockParaSumar = item.producto.stock <= 0;
            return (
              <tr key={item.producto.id}>
                <td>{item.producto.nombre}</td>
                <td>
                  <div className="control-cantidad">
                    <button
                      onClick={() => disminuirCantidad(item.producto.id)}
                      aria-label={`Quitar una unidad de ${item.producto.nombre}`}
                      className="btn-cantidad"
                    >
                      −
                    </button>
                    <span>{item.cantidad}</span>
                    <button
                      onClick={() => agregarAlCarrito(item.producto)}
                      disabled={sinStockParaSumar}
                      aria-label={`Agregar una unidad más de ${item.producto.nombre}`}
                      className="btn-cantidad"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{formatoCLP.format(precioUnitario)}</td>
                <td>{formatoCLP.format(precioUnitario * item.cantidad)}</td>
                <td>
                  <button
                    onClick={() => eliminarDelCarrito(item.producto.id)}
                    className="btn-eliminar-item"
                    aria-label={`Eliminar ${item.producto.nombre} del carrito`}
                    title="Eliminar del carrito"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="resumen-carrito">
        {descuentoAplicado && (
          <p className="descuento-cumpleanos">🎂 ¡Feliz cumpleaños! 10% de descuento aplicado.</p>
        )}
        <p>Subtotal: {formatoCLP.format(totalSinDescuento)}</p>
        <p className="total-final">Total a pagar: {formatoCLP.format(totalConDescuento)}</p>
      </div>

      {mensaje && <p className={mensaje.ok ? 'mensaje-exito' : 'mensaje-error'}>{mensaje.texto}</p>}

      <div className="acciones-carrito">
        <button onClick={vaciarCarrito} className="btn-secundario">
          Vaciar carrito
        </button>
        <button onClick={manejarConfirmar} disabled={!usuarioActual} className="btn-primario">
          Confirmar compra
        </button>
      </div>
    </div>
  );
}
