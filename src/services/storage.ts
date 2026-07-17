// Capa única de acceso a localStorage.
// Toda la app pasa por aquí para leer/escribir, así evitamos repetir
// JSON.parse/JSON.stringify por todos lados y centralizamos las "keys".

const KEYS = {
  USUARIOS: 'gz_usuarios_v2', // v2: la contraseña ahora se guarda hasheada, no en texto plano
  PRODUCTOS: 'gz_productos_v3', // v3: imágenes reales del estudiante en vez de placeholders
  CARRITO: 'gz_carrito_v3',
  SESION: 'gz_sesion',
  API_CARGADA: 'gz_api_cargada_v2',
} as const;

function leer<T>(key: string, valorPorDefecto: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return valorPorDefecto;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error leyendo "${key}" de localStorage:`, error);
    return valorPorDefecto;
  }
}

function escribir<T>(key: string, valor: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(valor));
  } catch (error) {
    console.error(`Error escribiendo "${key}" en localStorage:`, error);
  }
}

export const storage = { KEYS, leer, escribir };
