import { useState, type FormEvent } from 'react';

export function Contacto() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensajeTexto, setMensajeTexto] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  function manejarEnvio(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!nombre.trim() || !correo.trim() || !mensajeTexto.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    // No hay backend real: simulamos el envío exitoso del formulario.
    setEnviado(true);
    setNombre('');
    setCorreo('');
    setMensajeTexto('');
  }

  return (
    <div className="pagina-contacto">
      <h1>Contacto</h1>

      <div className="contacto-grid">
        <form onSubmit={manejarEnvio} className="formulario">
          <label>
            Nombre
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </label>
          <label>
            Correo electrónico
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
          </label>
          <label>
            Mensaje
            <textarea
              value={mensajeTexto}
              onChange={(e) => setMensajeTexto(e.target.value)}
              rows={5}
            />
          </label>

          {error && <p className="mensaje-error">{error}</p>}
          {enviado && <p className="mensaje-exito">¡Mensaje enviado con éxito!</p>}

          <button type="submit" className="btn-primario">
            Enviar
          </button>
        </form>

        <div className="info-empresa">
          <h2>Información de la Empresa</h2>
          <p>
            <strong>Dirección:</strong> Av. Gamer 1234, Santiago, Chile
          </p>
          <p>
            <strong>Teléfono:</strong> +56 9 1234 5678
          </p>
          <p>
            <strong>Correo:</strong> contacto@byteplay.cl
          </p>

          <h2>Ubicación</h2>
          <iframe
            title="Ubicación INACAP Sede La Granja"
            src="https://www.google.com/maps?q=INACAP+Sede+La+Granja&output=embed"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
