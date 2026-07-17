const DOMINIOS_PERMITIDOS = ['gmail.com', 'inacap.cl'];

export function correoValido(correo: string): boolean {
  const partes = correo.split('@');
  if (partes.length !== 2) return false;
  const dominio = partes[1].toLowerCase();
  return DOMINIOS_PERMITIDOS.includes(dominio);
}

// Espera fecha en formato yyyy-mm-dd (el que entrega <input type="date">)
export function esMayorDeEdad(fechaNacimientoISO: string): boolean {
  const nacimiento = new Date(fechaNacimientoISO);
  if (isNaN(nacimiento.getTime())) return false;

  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aunNoCumpleEsteAno =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());

  if (aunNoCumpleEsteAno) edad--;
  return edad >= 18;
}

export function contrasenaValida(contrasena: string): boolean {
  const tieneMinimo8 = contrasena.length >= 8;
  const tieneNumero = /\d/.test(contrasena);
  const tieneMayuscula = /[A-Z]/.test(contrasena);
  const tieneMinuscula = /[a-z]/.test(contrasena);
  const tieneEspecial = /[^A-Za-z0-9]/.test(contrasena);
  return tieneMinimo8 && tieneNumero && tieneMayuscula && tieneMinuscula && tieneEspecial;
}

// Convierte yyyy-mm-dd (input date) a dd-mm-yyyy (formato pedido para guardar)
export function formatearFechaAlmacenamiento(fechaISO: string): string {
  const [anio, mes, dia] = fechaISO.split('-');
  return `${dia}-${mes}-${anio}`;
}

// true si hoy es el cumpleaños del usuario (para el descuento del 10%)
export function esCumpleanosHoy(fechaNacimientoDDMMYYYY: string): boolean {
  const [dia, mes] = fechaNacimientoDDMMYYYY.split('-');
  const hoy = new Date();
  return Number(dia) === hoy.getDate() && Number(mes) === hoy.getMonth() + 1;
}
