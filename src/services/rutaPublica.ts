// Arma la ruta correcta a un archivo de la carpeta "public", tomando en cuenta
// el "base" configurado en vite.config.ts (necesario porque en GitHub Pages
// el sitio no vive en la raíz del dominio, sino en /nombre-del-repo/).
//
// Uso: rutaPublica('logo.png') -> '/logo.png' en local, '/tienda-videojuegos/logo.png' en GitHub Pages.
export function rutaPublica(archivo: string): string {
  const base = import.meta.env.BASE_URL; // termina siempre en "/"
  const archivoSinSlashInicial = archivo.replace(/^\//, '');
  return `${base}${archivoSinSlashInicial}`;
}
