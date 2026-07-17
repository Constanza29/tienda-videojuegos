import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Inicio } from './pages/Inicio';
import { Catalogo } from './pages/Catalogo';
import { DetalleProducto } from './pages/DetalleProducto';
import { Contacto } from './pages/Contacto';
import { Registro } from './pages/Registro';
import { Login } from './pages/Login';
import { Carrito } from './pages/Carrito';

function Footer() {
  return (
    <footer className="footer">
      <p>Nombre del Estudiante</p>
      <p>correo.estudiante@inacapmail.cl</p>
    </footer>
  );
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="contenido-principal">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
