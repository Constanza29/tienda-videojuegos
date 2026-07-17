// Genera un hash SHA-256 de un texto (por ejemplo, una contraseña) usando la
// Web Crypto API, que ya viene integrada en todos los navegadores modernos.
//
// IMPORTANTE para entender esto: un hash es de UNA SOLA VÍA. No existe una
// función para "deshacer" un hash y recuperar el texto original. Por eso el
// login no compara "la contraseña guardada" con "la que escribiste", sino que
// hashea lo que escribiste y compara ESE hash con el que ya teníamos guardado.
//
// Nota: esto es suficiente para que la contraseña no quede en texto plano en
// localStorage (buena práctica para un proyecto de curso), pero no reemplaza
// un sistema de autenticación real con backend (que usaría algo como bcrypt,
// con "salt" incluido, y nunca guardaría nada sensible en el navegador).
export async function hashTexto(texto: string): Promise<string> {
  const datosCodificados = new TextEncoder().encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', datosCodificados);
  const bytesHash = Array.from(new Uint8Array(hashBuffer));
  return bytesHash.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
