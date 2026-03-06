import Link from "next/link"; // Herramienta de Next.js para cambiar de página sin recargar

export default function MenuPrincipal() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        
        {/* Encabezado del Menú */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-blue-900 mb-4">Simulador Aduanero</h1>
          <p className="text-xl text-gray-600">
            Aprende haciendo. Selecciona el tipo de operación que deseas simular hoy.
          </p>
        </div>

        {/* Contenedor de las dos opciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Botón / Tarjeta de Importación */}
          {/* Nota: Por ahora ambos botones llevan a "/factura", luego los separaremos en la etapa final */}
          <Link 
            href="/orden-compra" 
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-10 border-t-8 border-blue-500 flex flex-col items-center text-center cursor-pointer hover:-translate-y-2"
          >
            <div className="text-7xl mb-6">🛬</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Proceso de Importación</h2>
            <p className="text-gray-500 mb-8">
              Simula el ingreso de mercancías al Territorio Aduanero Nacional. Liquida tributos y llena la Declaración de Importación.
            </p>
            <div className="mt-auto bg-blue-100 text-blue-700 px-8 py-3 rounded-full font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
              Iniciar Importación
            </div>
          </Link>

          {/* Botón / Tarjeta de Exportación */}
          <Link 
            href="/factura" 
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-10 border-t-8 border-green-500 flex flex-col items-center text-center cursor-pointer hover:-translate-y-2"
          >
            <div className="text-7xl mb-6">🛫</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Proceso de Exportación</h2>
            <p className="text-gray-500 mb-8">
              Simula la salida de mercancías. Gestiona vistos buenos, certificados de origen y llena la Declaración de Exportación.
            </p>
            <div className="mt-auto bg-green-100 text-green-700 px-8 py-3 rounded-full font-bold group-hover:bg-green-600 group-hover:text-white transition-colors">
              Iniciar Exportación
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}