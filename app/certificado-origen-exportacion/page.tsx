"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CertificadoOrigenExportacion() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center justify-center">
      
      {/* NAVEGACIÓN SUPERIOR */}
      <div className="w-full max-w-4xl mb-4 flex justify-between items-center">
        <button 
          onClick={() => router.back()} 
          type="button"
          className="bg-white text-lime-700 border border-lime-700 px-4 py-2 rounded font-bold hover:bg-lime-50 transition-colors flex items-center gap-2 shadow-sm">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      {/* CONTENEDOR PRINCIPAL INFORMATIVO */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border-t-8 border-lime-500 overflow-hidden p-8 md:p-12">
        
        <div className="flex flex-col items-center text-center space-y-6">
          
          {/* ICONO Y TÍTULO */}
          <div className="w-24 h-24 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center text-5xl shadow-inner mb-2">
            🌍
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-lime-800 uppercase tracking-tight">
            Certificado de Origen <br/> <span className="text-2xl text-lime-600">(Exportación)</span>
          </h2>
          
          {/* EXPLICACIÓN PEDAGÓGICA */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 text-left rounded-r-lg w-full shadow-sm">
            <h3 className="font-bold text-amber-800 text-lg mb-2 flex items-center gap-2">
              ⚠️ ¡Atención Estudiante!
            </h3>
            <p className="text-amber-900 leading-relaxed text-sm md:text-base">
              A diferencia de la Factura Comercial o el Packing List, <strong>el Certificado de Origen NO tiene un formato estándar o universal.</strong> 
              <br/><br/>
              El documento exacto que necesitas, las reglas para llenarlo y la entidad que lo emite dependen enteramente del <strong>Tratado de Libre Comercio (TLC)</strong> o Acuerdo de Complementación Económica que exista entre el país exportador (tu país) y el país importador (tu cliente). Ej: TLC Colombia-EE.UU., Alianza del Pacífico, Unión Europea, ALADI, etc.
            </p>
          </div>

          {/* MISIÓN / TAREA PARA EL ESTUDIANTE */}
          <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-6 text-left shadow-inner">
            <h3 className="font-black text-gray-700 uppercase mb-3 border-b border-gray-300 pb-2">
              📌 Tu Misión en este Paso:
            </h3>
            <ul className="list-disc pl-5 space-y-3 text-gray-600 text-sm md:text-base">
              <li>Identifica cuál es el país de origen y el país de destino en tu simulación de exportación.</li>
              <li>Investiga qué Tratado Comercial aplica entre ambos países.</li>
              <li>Busca en las páginas oficiales (DIAN, MinComercio, o la aduana extranjera) el formato en PDF o Word del Certificado de Origen específico para ese tratado.</li>
              <li>¡Descárgalo y anéxalo manualmente a tu carpeta de simulación!</li>
            </ul>
          </div>

          {/* BOTÓN DE SIGUIENTE PASO */}
          <div className="w-full pt-6">
            <Link href="/certificado-lote-exportacion" className="w-full bg-lime-600 text-white font-black py-5 px-4 rounded-xl shadow-lg hover:bg-lime-700 transition-all text-lg md:text-xl uppercase tracking-widest border-b-4 border-lime-800 flex items-center justify-center gap-3">
              Misión Comprendida: Ir a Certificado de Lote →
            </Link>
          </div>

        </div>

      </div>
    </main>
  );
}