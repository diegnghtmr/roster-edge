import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4">
        {/* 404 illustration */}
        <div className="mb-8 relative">
          <h1 className="text-9xl md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-600 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-16 h-16 md:w-20 md:h-20 text-rose-400 opacity-40 animate-bounce" />
          </div>
        </div>

        {/* Error message */}
        <div className="text-center mb-12 max-w-md">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Página no encontrada
          </h2>
          <p className="text-gray-600 text-lg mb-2">
            Oops, parece que esta página se perdió en el espacio.
          </p>
          <p className="text-gray-500 text-sm">
            La página que buscas no existe o ha sido movida.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-base"
          >
            <a href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Volver al inicio
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-2 border-gray-300 hover:border-rose-500 hover:bg-rose-50 transition-all duration-300 px-8 py-6 text-base"
          >
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Página anterior
            </button>
          </Button>
        </div>
      </div>
    </div>
  );
}
