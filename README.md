# BytePlay - Tienda de Videojuegos (Evaluación 3, Programación Front End)

## Cómo correr el proyecto en VS Code

1. Abre esta carpeta en Visual Studio Code.
2. Abre una terminal (Ctrl+`) y ejecuta:
   ```bash
   npm install
   npm run dev
   ```
3. Abre la URL que aparece en la terminal (normalmente http://localhost:5173).

## Cuando cambies los datos de productos (data/productos.ts) y no se vean los cambios

Los productos se guardan en `localStorage` la primera vez que abres la página, para que el
stock y el carrito no se pierdan al recargar. Esto significa que si editas
`src/data/productos.ts` (por ejemplo, cambias una imagen o agregas un producto) y ya habías
abierto la página antes, vas a seguir viendo los datos VIEJOS, porque la app los lee desde
`localStorage` y no vuelve a leer el archivo.

Dos formas de arreglarlo:
- **Rápida**: F12 -> pestaña "Application" -> "Local Storage" -> borra las keys que empiezan
  con `gz_productos` y `gz_carrito` -> recarga la página.
- **Para el proyecto en general**: sube el número de versión en `src/services/storage.ts`
  (`gz_productos_v3` -> `gz_productos_v4`, por ejemplo). Así, para cualquiera que abra el
  proyecto, la app ignora el caché viejo y carga los datos nuevos automáticamente.

## Si la página se ve en blanco

Revisé todo el código línea por línea y no encontré errores de sintaxis, así que si ves
la página en blanco casi siempre es uno de estos motivos (en orden de probabilidad):

1. **No corriste `npm install` antes de `npm run dev`.** Sin esto, ningún import va a
   funcionar. Bórralo y ejecuta ambos comandos de nuevo.
2. **Node.js desactualizado.** Este proyecto usa Vite 6, que requiere Node 18.14+ o 20+.
   Revisa tu versión con `node -v`. Si es menor, actualiza Node.
3. **Revisa la consola del navegador** (tecla F12 -> pestaña "Console"). Si hay un error
   en rojo, cópialo y pégamelo tal cual; con eso puedo decirte exactamente qué pasa.
4. **Revisa la terminal de VS Code** mientras corre `npm run dev`. Si hay un error ahí
   (por ejemplo "Failed to resolve import"), también pégamelo.
5. Prueba en una ventana de incógnito, por si el navegador tiene cacheado algo viejo.

## Estructura del proyecto

```
src/
  components/   -> componentes reutilizables (Navbar, ProductoCard, CarruselImagenes, RutaProtegida)
  context/      -> AuthContext (usuarios/sesión) y CartContext (carrito/productos)
  data/         -> productos iniciales de la tienda (temática videojuegos)
  pages/        -> una página por ruta (Inicio, Catalogo, DetalleProducto, Contacto, Registro, Login, Carrito)
  services/     -> storage.ts (localStorage), api.ts (JSONPlaceholder), validaciones.ts
  types/        -> interfaces de TypeScript (Producto, Usuario, ItemCarrito, etc.)
  App.tsx       -> define las rutas de la SPA
  main.tsx      -> punto de entrada, monta los providers (Auth, Cart) y el Router
```

## Estado del proyecto vs. la pauta

Ya implementado:
- Todas las páginas mínimas exigidas (Inicio, Catálogo, Detalle, Contacto, Registro, Login, Carrito).
- Navbar con logo de BytePlay y estados autenticado/no autenticado.
- Validaciones de registro (dominio de correo, mayoría de edad, formato de contraseña, correo único).
- Bloqueo de cuenta al 3er intento fallido de login.
- Carrito: no duplica productos (suma cantidad), reserva/restaura stock, calcula total automáticamente,
  aplica 10% de descuento si es el cumpleaños del usuario logueado.
- Carga automática (una sola vez) de los 3 primeros usuarios desde JSONPlaceholder, con manejo de errores.
- Persistencia completa en localStorage (usuarios, productos, carrito, sesión).
- Carrusel de 2 imágenes por producto, con auto-rotación, flechas manuales y puntos indicadores.
- Paleta de colores tomada del logo: fondo blanco, textos gris oscuro, acentos en rojo.

Pendiente / a revisar por ti:
- Reemplazar las imágenes de placeholder (`https://placehold.co/...`) por imágenes reales de productos
  (cada producto tiene un arreglo `imagenes: string[]` con 2 URLs — puedes agregar más si quieres).
- Revisar/ajustar los datos de la sección "Información de la empresa" en Contacto (dirección, teléfono).
- Completar tu nombre y correo institucional real en el Footer (`src/App.tsx`).
- Probar bien los flujos: registro -> bloqueo tras 3 intentos -> compra -> descuento de cumpleaños.

## Importante

Antes de entregar, asegúrate de entender cada archivo: el profesor espera que puedas explicar
cualquier parte del código. Revisa especialmente `CartContext.tsx` (lógica de reserva de stock)
y `AuthContext.tsx` (lógica de bloqueo de cuenta y carga desde la API).
