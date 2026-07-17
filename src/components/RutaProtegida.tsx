import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Ejemplo de uso si más adelante quieres restringir páginas completas
// a usuarios con sesión iniciada (no obligatorio para el carrito, ya que
// este enunciado solo exige bloquear el botón "Confirmar compra").
export function RutaProtegida({ children }: { children: ReactNode }) {
  const { usuarioActual } = useAuth();

  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
