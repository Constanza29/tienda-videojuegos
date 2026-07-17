import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ItemCarrito, Producto } from '../types';
import { storage } from '../services/storage';
import { productosIniciales } from '../data/productos';
import { useAuth } from './AuthContext';
import { esCumpleanosHoy } from '../services/validaciones';

// NOTA DE DISEÑO:
// El stock que se ve en el catálogo es el stock "disponible real".
// Al AGREGAR un producto al carrito, se reserva (se descuenta 1 del stock).
// Al VACIAR el carrito, esa reserva se devuelve (se restaura el stock).
// Al CONFIRMAR la compra, la reserva se vuelve definitiva (no se restaura).

interface CartContextValue {
  productos: Producto[];
  items: ItemCarrito[];
  agregarAlCarrito: (producto: Producto) => void;
  disminuirCantidad: (productoId: string) => void;
  eliminarDelCarrito: (productoId: string) => void;
  vaciarCarrito: () => void;
  confirmarCompra: () => { ok: boolean; mensaje: string };
  totalCantidad: number;
  totalSinDescuento: number;
  descuentoAplicado: boolean;
  totalConDescuento: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { usuarioActual } = useAuth();

  const [productos, setProductos] = useState<Producto[]>(() =>
    storage.leer<Producto[]>(storage.KEYS.PRODUCTOS, productosIniciales)
  );
  const [items, setItems] = useState<ItemCarrito[]>(() =>
    storage.leer<ItemCarrito[]>(storage.KEYS.CARRITO, [])
  );

  function guardarProductos(lista: Producto[]) {
    setProductos(lista);
    storage.escribir(storage.KEYS.PRODUCTOS, lista);
  }

  function guardarCarrito(lista: ItemCarrito[]) {
    setItems(lista);
    storage.escribir(storage.KEYS.CARRITO, lista);
  }

  function agregarAlCarrito(producto: Producto) {
    const productoActual = productos.find((p) => p.id === producto.id);
    if (!productoActual || productoActual.stock <= 0) return;

    // reservar: descontar 1 del stock disponible
    const productosActualizados = productos.map((p) =>
      p.id === producto.id ? { ...p, stock: p.stock - 1 } : p
    );
    guardarProductos(productosActualizados);

    const productoActualizado = productosActualizados.find((p) => p.id === producto.id)!;
    const existente = items.find((i) => i.producto.id === producto.id);

    if (existente) {
      guardarCarrito(
        items.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: i.cantidad + 1, producto: productoActualizado }
            : i
        )
      );
    } else {
      guardarCarrito([...items, { producto: productoActualizado, cantidad: 1 }]);
    }
  }

  function disminuirCantidad(productoId: string) {
    const item = items.find((i) => i.producto.id === productoId);
    if (!item) return;

    // devolver 1 unidad de stock (la reserva de esa unidad ya no aplica)
    const productosActualizados = productos.map((p) =>
      p.id === productoId ? { ...p, stock: p.stock + 1 } : p
    );
    guardarProductos(productosActualizados);

    if (item.cantidad <= 1) {
      // si queda en 0, se elimina la fila directamente
      guardarCarrito(items.filter((i) => i.producto.id !== productoId));
    } else {
      const productoActualizado = productosActualizados.find((p) => p.id === productoId)!;
      guardarCarrito(
        items.map((i) =>
          i.producto.id === productoId
            ? { ...i, cantidad: i.cantidad - 1, producto: productoActualizado }
            : i
        )
      );
    }
  }

  function eliminarDelCarrito(productoId: string) {
    const item = items.find((i) => i.producto.id === productoId);
    if (!item) return;

    // devolver TODO el stock reservado por este producto (sin importar la cantidad)
    const productosActualizados = productos.map((p) =>
      p.id === productoId ? { ...p, stock: p.stock + item.cantidad } : p
    );
    guardarProductos(productosActualizados);
    guardarCarrito(items.filter((i) => i.producto.id !== productoId));
  }

  function vaciarCarrito() {
    // devolver el stock reservado por cada producto en el carrito
    const productosRestaurados = productos.map((p) => {
      const item = items.find((i) => i.producto.id === p.id);
      return item ? { ...p, stock: p.stock + item.cantidad } : p;
    });
    guardarProductos(productosRestaurados);
    guardarCarrito([]);
  }

  function confirmarCompra(): { ok: boolean; mensaje: string } {
    if (!usuarioActual) {
      return { ok: false, mensaje: 'Debes iniciar sesión para completar la compra.' };
    }
    if (items.length === 0) {
      return { ok: false, mensaje: 'Tu carrito está vacío.' };
    }

    // El stock ya fue reservado al agregar los productos; solo vaciamos el carrito.
    guardarCarrito([]);
    return { ok: true, mensaje: '¡Compra confirmada con éxito!' };
  }

  const totalCantidad = items.reduce((acc, i) => acc + i.cantidad, 0);

  const totalSinDescuento = items.reduce((acc, i) => {
    const precioUnitario = i.producto.precioOferta ?? i.producto.precio;
    return acc + precioUnitario * i.cantidad;
  }, 0);

  const descuentoAplicado = usuarioActual ? esCumpleanosHoy(usuarioActual.fechaNacimiento) : false;
  const totalConDescuento = descuentoAplicado ? totalSinDescuento * 0.9 : totalSinDescuento;

  return (
    <CartContext.Provider
      value={{
        productos,
        items,
        agregarAlCarrito,
        disminuirCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        confirmarCompra,
        totalCantidad,
        totalSinDescuento,
        descuentoAplicado,
        totalConDescuento,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const contexto = useContext(CartContext);
  if (!contexto) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return contexto;
}
