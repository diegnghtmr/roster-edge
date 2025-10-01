import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white bg-fixed bg-cover bg-bottom error-bg">
      <div className="container">
        <div className="row">
          <div className="col-sm-8 offset-sm-2 text-gray-50 text-center -mt-52">
            <img
              src="https://ordenes.issa.com.co/public/assets/images/logo-default.png"
              alt="logo"
              className="mx-auto mb-20"
              style={{ height: 30 }}
            />
            <div className="relative ">
              <h1 className="relative text-9xl tracking-tighter-less text-blue-500 text-shadow font-sans font-bold">
                <span>4</span>
                <span>0</span>
                <span>4</span>
              </h1>
              <span className="absolute top-0   -ml-12 text-gray-500 font-semibold">
                Oops!
              </span>
            </div>
            <h5 className="text-gray-500 font-semibold -mr-10 -mt-3">
              Página no encontrada
            </h5>
            <p className="text-gray-500 mt-2 mb-6">
              Lo sentimos, la pagina a la que intentas acceder no existe
            </p>
            <Link
              to={"/"}
              className="bg-orange-400 cursor-pointer px-5 py-3 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg"
            >
              Ir a inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
