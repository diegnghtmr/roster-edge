import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';

function App() {
  // Here you can manage authentication state
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
              <h1 className="text-3xl font-bold">About</h1>
              <p className="mt-4">This is the About page.</p>
            </div>
          } />
          <Route path="/login" element={
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold">Sign In</h1>
              <p className="mt-4">Login form will go here.</p>
            </div>
          } />
          <Route path="/register" element={
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold">Sign Up</h1>
              <p className="mt-4">Registration form will go here.</p>
            </div>
          } />
          <Route path="/dashboard" element={
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="mt-4">Welcome to the dashboard.</p>
            </div>
          } />
          <Route path="*" element={
            <div className="max-w-7xl mx-auto px-4 py-8 text-center">
              <h1 className="text-6xl font-bold text-gray-300">404</h1>
              <p className="mt-4 text-xl">Page not found</p>
            </div>
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
