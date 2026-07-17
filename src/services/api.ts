import axios from 'axios';
import type { Usuario } from '../types';
import { hashTexto } from './crypto';

interface UsuarioAPI {
  id: number;
  name: string;
  email: string;
}

// Trae los 3 primeros usuarios de JSONPlaceholder y los transforma
// al formato Usuario que usa nuestra app.
export async function obtenerUsuariosIniciales(): Promise<Usuario[]> {
  const respuesta = await axios.get<UsuarioAPI[]>(
    'https://jsonplaceholder.typicode.com/users',
    { timeout: 8000 }
  );

  if (!Array.isArray(respuesta.data)) {
    throw new Error('Respuesta inválida de la API');
  }

  const primerosTres = respuesta.data.slice(0, 3);
  // se hashea una sola vez porque los 3 usuarios comparten la misma contraseña fija
  const contrasenaHasheada = await hashTexto('Inacap123');

  return primerosTres.map((u) => ({
    id: `api-${u.id}`,
    nombre: u.name,
    correo: u.email,
    contrasena: contrasenaHasheada, // guardada como hash, no en texto plano
    fechaNacimiento: '01-01-2000', // dato fijo pedido por el enunciado
    bloqueado: false,
    intentosFallidos: 0,
  }));
}
