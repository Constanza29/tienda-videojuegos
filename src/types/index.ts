// Categorías posibles para la temática Videojuegos
export type Categoria =
  | 'Consolas'
  | 'Juegos'
  | 'Accesorios'
  | 'Pases de Batalla'
  | 'Gift Cards';

export interface Producto {
  id: string;
  nombre: string;
  categoria: Categoria;
  descripcion: string;
  imagenes: string[]; // mínimo 2 imágenes por producto, para el carrusel
  precio: number;
  precioOferta?: number; // opcional: solo si el producto tiene descuento
  stock: number;
  destacado?: boolean; // usado en la página de Inicio
}

export interface Usuario {
  id: string;
  nombre: string;
  fechaNacimiento: string; // formato dd-mm-yyyy
  correo: string;
  contrasena: string;
  bloqueado: boolean;
  intentosFallidos: number;
}

// Producto dentro del carrito: producto + cantidad elegida
export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

// Lo que se guarda en localStorage bajo la key "sesion"
export interface Sesion {
  usuarioId: string | null;
}
