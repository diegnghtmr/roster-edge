import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';

function App() {
  // Aquí puedes manejar el estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [username, setUsername] = React.useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} username={username} />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold">Acerca de</h1>
              <p className="mt-4">Esta es la página de Acerca de.</p>
            </div>
          } />
          <Route path="/login" element={
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
              <p className="mt-4">Aquí irá el formulario de login.</p>
            </div>
          } />
          <Route path="/register" element={
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold">Registrarse</h1>
              <p className="mt-4">Aquí irá el formulario de registro.</p>
            </div>
          } />
          <Route path="/dashboard" element={
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="mt-4">Bienvenido al dashboard.</p>
            </div>
          } />
          <Route path="*" element={
            <div className="max-w-7xl mx-auto px-4 py-8 text-center">
              <h1 className="text-6xl font-bold text-gray-300">404</h1>
              <p className="mt-4 text-xl">Página no encontrada</p>
            </div>
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
