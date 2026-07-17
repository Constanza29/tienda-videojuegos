import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Usuario } from '../types';
import { storage } from '../services/storage';
import { obtenerUsuariosIniciales } from '../services/api';
import { hashTexto } from '../services/crypto';

interface ResultadoLogin {
  ok: boolean;
  mensaje: string;
}

interface ResultadoRegistro {
  ok: boolean;
  mensaje: string;
}

interface AuthContextValue {
  usuarios: Usuario[];
  usuarioActual: Usuario | null;
  cargandoUsuariosIniciales: boolean;
  iniciarSesion: (correo: string, contrasena: string) => Promise<ResultadoLogin>;
  cerrarSesion: () => void;
  registrarUsuario: (
    datos: Omit<Usuario, 'id' | 'bloqueado' | 'intentosFallidos'>
  ) => Promise<ResultadoRegistro>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>(() =>
    storage.leer<Usuario[]>(storage.KEYS.USUARIOS, [])
  );
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(() => {
    const sesion = storage.leer<{ usuarioId: string | null }>(storage.KEYS.SESION, {
      usuarioId: null,
    });
    if (!sesion.usuarioId) return null;
    const usuariosGuardados = storage.leer<Usuario[]>(storage.KEYS.USUARIOS, []);
    return usuariosGuardados.find((u) => u.id === sesion.usuarioId) ?? null;
  });
  const [cargandoUsuariosIniciales, setCargandoUsuariosIniciales] = useState(false);

  // Carga única de los 3 usuarios de JSONPlaceholder al iniciar la app.
  useEffect(() => {
    const yaCargados = storage.leer<boolean>(storage.KEYS.API_CARGADA, false);
    if (yaCargados) return;

    let cancelado = false;
    setCargandoUsuariosIniciales(true);

    obtenerUsuariosIniciales()
      .then((nuevos) => {
        if (cancelado) return;
        setUsuarios((actuales) => {
          // por si acaso, evita duplicar si ya existieran
          const correosExistentes = new Set(actuales.map((u) => u.correo));
          const aAgregar = nuevos.filter((u) => !correosExistentes.has(u.correo));
          const combinados = [...actuales, ...aAgregar];
          storage.escribir(storage.KEYS.USUARIOS, combinados);
          return combinados;
        });
        storage.escribir(storage.KEYS.API_CARGADA, true);
      })
      .catch((error) => {
        // La app debe seguir funcionando aunque falle la API (sin internet, error de servidor, etc.)
        console.error('No se pudieron cargar los usuarios iniciales desde la API:', error);
      })
      .finally(() => {
        if (!cancelado) setCargandoUsuariosIniciales(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  function guardarUsuarios(lista: Usuario[]) {
    setUsuarios(lista);
    storage.escribir(storage.KEYS.USUARIOS, lista);
  }

  async function iniciarSesion(correo: string, contrasena: string): Promise<ResultadoLogin> {
    const usuario = usuarios.find((u) => u.correo.toLowerCase() === correo.toLowerCase());

    if (!usuario) {
      return { ok: false, mensaje: 'No existe una cuenta registrada con ese correo.' };
    }
    if (usuario.bloqueado) {
      return { ok: false, mensaje: 'Esta cuenta está bloqueada por intentos fallidos.' };
    }

    // no comparamos texto plano: hasheamos lo que escribió y comparamos los hashes
    const hashIngresado = await hashTexto(contrasena);

    if (usuario.contrasena !== hashIngresado) {
      const intentos = usuario.intentosFallidos + 1;
      const seBloquea = intentos >= 3;
      const actualizado: Usuario = {
        ...usuario,
        intentosFallidos: intentos,
        bloqueado: seBloquea,
      };
      guardarUsuarios(usuarios.map((u) => (u.id === usuario.id ? actualizado : u)));
      return {
        ok: false,
        mensaje: seBloquea
          ? 'Contraseña incorrecta. La cuenta ha sido bloqueada tras 3 intentos fallidos.'
          : `Contraseña incorrecta. Intento ${intentos} de 3.`,
      };
    }

    // login correcto: reseteamos intentos fallidos
    const actualizado: Usuario = { ...usuario, intentosFallidos: 0 };
    guardarUsuarios(usuarios.map((u) => (u.id === usuario.id ? actualizado : u)));
    setUsuarioActual(actualizado);
    storage.escribir(storage.KEYS.SESION, { usuarioId: actualizado.id });
    return { ok: true, mensaje: 'Sesión iniciada correctamente.' };
  }

  function cerrarSesion() {
    setUsuarioActual(null);
    storage.escribir(storage.KEYS.SESION, { usuarioId: null });
  }

  async function registrarUsuario(
    datos: Omit<Usuario, 'id' | 'bloqueado' | 'intentosFallidos'>
  ): Promise<ResultadoRegistro> {
    const yaExiste = usuarios.some((u) => u.correo.toLowerCase() === datos.correo.toLowerCase());
    if (yaExiste) {
      return { ok: false, mensaje: 'Ya existe una cuenta registrada con ese correo.' };
    }

    const contrasenaHasheada = await hashTexto(datos.contrasena);
    const nuevo: Usuario = {
      ...datos,
      contrasena: contrasenaHasheada, // se guarda el hash, nunca el texto original
      id: `local-${Date.now()}`,
      bloqueado: false,
      intentosFallidos: 0,
    };
    guardarUsuarios([...usuarios, nuevo]);
    return { ok: true, mensaje: 'Cuenta creada correctamente. Ya puedes iniciar sesión.' };
  }

  return (
    <AuthContext.Provider
      value={{
        usuarios,
        usuarioActual,
        cargandoUsuariosIniciales,
        iniciarSesion,
        cerrarSesion,
        registrarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return contexto;
}
