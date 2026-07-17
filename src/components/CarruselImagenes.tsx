import { useEffect, useState, type MouseEvent } from 'react';

interface CarruselImagenesProps {
  imagenes: string[];
  alt: string;
  /** cada cuántos ms cambia de imagen automáticamente (0 = desactivado) */
  intervaloMs?: number;
}

export function CarruselImagenes({ imagenes, alt, intervaloMs = 3000 }: CarruselImagenesProps) {
  const [indice, setIndice] = useState(0);

  // Defensa ante datos viejos/corruptos en localStorage (por ejemplo, productos
  // guardados con un esquema anterior que no tenían "imagenes").
  const listaImagenes = Array.isArray(imagenes) ? imagenes.filter(Boolean) : [];

  // auto-rotación: solo tiene sentido si hay más de una imagen
  useEffect(() => {
    if (listaImagenes.length <= 1 || intervaloMs <= 0) return;

    const temporizador = setInterval(() => {
      setIndice((actual) => (actual + 1) % listaImagenes.length);
    }, intervaloMs);

    return () => clearInterval(temporizador);
  }, [listaImagenes.length, intervaloMs]);

  if (listaImagenes.length === 0) {
    return <div className="carrusel carrusel-vacio">Sin imagen</div>;
  }

  function irAnterior(e: MouseEvent) {
    e.preventDefault(); // evita disparar el Link que envuelve la tarjeta
    setIndice((actual) => (actual - 1 + listaImagenes.length) % listaImagenes.length);
  }

  function irSiguiente(e: MouseEvent) {
    e.preventDefault();
    setIndice((actual) => (actual + 1) % listaImagenes.length);
  }

  return (
    <div className="carrusel">
      <div
        className="carrusel-pista"
        style={{
          transform: `translateX(-${(indice * 100) / listaImagenes.length}%)`,
          width: `${listaImagenes.length * 100}%`,
        }}
      >
        {listaImagenes.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${alt} - imagen ${i + 1}`}
            className="carrusel-imagen"
            style={{ width: `${100 / listaImagenes.length}%` }}
          />
        ))}
      </div>

      {listaImagenes.length > 1 && (
        <>
          <button
            className="carrusel-flecha carrusel-flecha-izq"
            aria-label="Imagen anterior"
            onClick={irAnterior}
          >
            ‹
          </button>
          <button
            className="carrusel-flecha carrusel-flecha-der"
            aria-label="Imagen siguiente"
            onClick={irSiguiente}
          >
            ›
          </button>

          <div className="carrusel-puntos">
            {listaImagenes.map((_, i) => (
              <button
                key={i}
                className={i === indice ? 'punto punto-activo' : 'punto'}
                aria-label={`Ver imagen ${i + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIndice(i);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
