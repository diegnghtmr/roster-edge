import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { ArrowRight, Rocket, Shield, Zap } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Rocket className="h-8 w-8 text-blue-600" />,
      title: 'Rápido y Moderno',
      description: 'Construido con las últimas tecnologías para un rendimiento óptimo.',
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: 'Seguro',
      description: 'Implementación de mejores prácticas de seguridad para proteger tus datos.',
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: 'Eficiente',
      description: 'Optimizado para ofrecer la mejor experiencia de usuario posible.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900">
              Bienvenido a <span className="text-blue-600">Mi App</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Una aplicación moderna construida con React, TypeScript, Tailwind CSS y Spring Boot.
              Diseñada para ser rápida, segura y escalable.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Button
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="w-full flex items-center justify-center px-8 py-3"
                >
                  Comenzar ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/about')}
                  className="w-full flex items-center justify-center px-8 py-3"
                >
                  Saber más
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Características principales
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Todo lo que necesitas para tu aplicación
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-center">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              ¿Listo para comenzar?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Únete a nosotros y descubre todo lo que podemos ofrecerte.
            </p>
            <div className="mt-8">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/register')}
                className="inline-flex items-center px-6 py-3"
              >
                Crear cuenta gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
