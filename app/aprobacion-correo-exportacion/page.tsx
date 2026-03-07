"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AprobacionCorreoExportacion() {
  const router = useRouter();

  // --- ESTADOS DEL CORREO ---
  const [fechaCorreo, setFechaCorreo] = useState("");
  const [para, setPara] = useState("ventas@proveedor-internacional.com");
  const [asunto, setAsunto] = useState("Aprobación Factura Proforma y Confirmación de Pedido");
  const [mensaje, setMensaje] = useState(
    "Estimado proveedor,\n\n" +
    "Por medio de la presente, confirmamos la recepción y aprobación de la Factura Proforma enviada.\n\n" +
    "Autorizamos formalmente el inicio de la producción y/o alistamiento de la carga según los términos, cantidades y valores acordados en la proforma.\n\n" +
    "Quedamos atentos a la confirmación de disponibilidad (Readiness Date) para coordinar la reserva de espacio (Booking) con nuestro agente de carga.\n\n" +
    "Cordialmente,\n\n" +
    "Departamento de Compras\n" +
    "Estudiante de Comercio Exterior S.A."
  );

  // 1. CARGAR DATOS (Memoria Temporal)
  useEffect(() => {
    // Usamos una variable exclusiva para exportación
    const borradorGuardado = sessionStorage.getItem("borrador_aprobacion_correo_expo");
    
    if (borradorGuardado) {
      const datos = JSON.parse(borradorGuardado);
      setFechaCorreo(datos.fechaCorreo || "");
      setPara(datos.para || "ventas@proveedor-internacional.com");
      setAsunto(datos.asunto || "Aprobación Factura Proforma y Confirmación de Pedido");
      setMensaje(datos.mensaje || "");
    } else {
      // Si es la primera vez, ponemos la fecha de hoy por defecto
      const hoy = new Date().toISOString().split('T')[0];
      setFechaCorreo(hoy);

      // Intentamos jalar el email del exportador desde la Proforma si existe
      const proformaGuardada = sessionStorage.getItem("borrador_factura_proforma_expo_v1");
      if (proformaGuardada) {
        const datosProforma = JSON.parse(proformaGuardada);
        if (datosProforma.expEmail) {
          setPara(datosProforma.expEmail);
        }
      }
    }
  }, []);

  // 2. GUARDAR DATOS
  useEffect(() => {
    if (fechaCorreo) {
      const borradorActual = { fechaCorreo, para, asunto, mensaje };
      sessionStorage.setItem("borrador_aprobacion_correo_expo", JSON.stringify(borradorActual));
    }
  });

  // 3. GENERAR PDF (Constancia Formal)
  const generarPDF = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = new jsPDF();

    // Diseño de "Constancia Oficial"
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277); // Borde exterior

    // Encabezado del documento
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(55, 48, 163); // Indigo oscuro
    
    // --- CAMBIO APLICADO AQUÍ ---
    doc.text("APROBACIÓN DE PROFORMA", 105, 25, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Constancia de Aprobación Electrónica", 105, 32, { align: "center" });

    doc.setDrawColor(55, 48, 163);
    doc.setLineWidth(1);
    doc.line(20, 38, 190, 38);

    // Caja de Metadatos del Correo
    doc.setFillColor(243, 244, 246); // Gris muy claro
    doc.rect(20, 45, 170, 40, "F");

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    doc.setFont("helvetica", "bold");
    doc.text("Fecha de envío:", 25, 55);
    doc.setFont("helvetica", "normal");
    doc.text(fechaCorreo, 65, 55);

    doc.setFont("helvetica", "bold");
    doc.text("Para (To):", 25, 65);
    doc.setFont("helvetica", "normal");
    doc.text(para, 65, 65);

    doc.setFont("helvetica", "bold");
    doc.text("Asunto (Subject):", 25, 75);
    doc.setFont("helvetica", "normal");
    const lineasAsunto = doc.splitTextToSize(asunto, 120);
    doc.text(lineasAsunto, 65, 75);

    // Cuerpo del Mensaje
    doc.setFont("helvetica", "bold");
    doc.text("Contenido del Mensaje:", 20, 100);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lineasMensaje = doc.splitTextToSize(mensaje, 170);
    doc.text(lineasMensaje, 20, 110);

    // Pie de página de validez
    const finalY = 110 + (lineasMensaje.length * 5) + 30;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, finalY, 190, finalY);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Este documento es una representación impresa de un correo electrónico emitido desde el", 105, finalY + 10, { align: "center" });
    doc.text("Simulador de Comercio Exterior. Válido como soporte de auditoría documental.", 105, finalY + 14, { align: "center" });
    doc.text(`Generado el: ${new Date().toLocaleString()}`, 105, finalY + 18, { align: "center" });

    doc.save(`Aprobacion_Correo_${fechaCorreo}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      
      {/* NAVEGACIÓN SUPERIOR */}
      <div className="w-full max-w-6xl mb-4 flex justify-between items-center">
        <button 
          onClick={() => router.back()} 
          type="button"
          className="bg-white text-indigo-700 border border-indigo-700 px-4 py-2 rounded font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-sm">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      {/* CONTENEDOR PRINCIPAL TIPO CLIENTE DE CORREO */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200">
        
        {/* BARRA LATERAL (SIDEBAR) */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-4 flex flex-col">
          <button className="bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition mb-6">
            + Redactar Nuevo
          </button>

          <nav className="space-y-2 flex-1">
            <a href="#" className="flex items-center justify-between bg-indigo-100 text-indigo-800 font-bold py-2 px-4 rounded-lg">
              <span>Bandeja de Salida</span>
              <span className="bg-indigo-600 text-white text-xs py-1 px-2 rounded-full">1</span>
            </a>
            <a href="#" className="flex items-center justify-between text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition">
              <span>Recibidos</span>
            </a>
            <a href="#" className="flex items-center justify-between text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition">
              <span>Enviados</span>
            </a>
            <a href="#" className="flex items-center justify-between text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition">
              <span>Borradores</span>
            </a>
          </nav>
        </div>

        {/* ÁREA PRINCIPAL DEL CORREO */}
        <div className="flex-1 flex flex-col">
          
          <div className="bg-indigo-50 p-6 border-b border-indigo-100">
            <h2 className="font-black text-2xl text-indigo-900 tracking-tight mb-2">Paso 3: Aprobación por Correo</h2>
            <p className="text-sm text-indigo-700">
              <strong>Tu Rol:</strong> Importador (Comprador).<br/>
              <strong>Objetivo:</strong> Revisa, edita y envía la confirmación formal al proveedor para autorizar el despacho.
            </p>
          </div>

          <form onSubmit={generarPDF} className="flex-1 flex flex-col p-6 space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4 items-center border-b border-gray-100 pb-4">
              <label className="text-sm font-bold text-gray-500">Fecha:</label>
              <input 
                type="date" 
                className="w-full md:w-48 text-gray-800 bg-white border border-gray-300 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" 
                value={fechaCorreo} 
                onChange={(e) => setFechaCorreo(e.target.value)} 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4 items-center border-b border-gray-100 pb-4">
              <label className="text-sm font-bold text-gray-500">Para:</label>
              <input 
                type="email" 
                className="w-full text-gray-800 bg-white border border-gray-300 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" 
                placeholder="correo@proveedor.com" 
                value={para} 
                onChange={(e) => setPara(e.target.value)} 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4 items-center border-b border-gray-100 pb-4">
              <label className="text-sm font-bold text-gray-500">Asunto:</label>
              <input 
                type="text" 
                className="w-full text-gray-800 font-bold bg-white border border-gray-300 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" 
                placeholder="Ej. Aprobación Factura Proforma" 
                value={asunto} 
                onChange={(e) => setAsunto(e.target.value)} 
                required 
              />
            </div>

            <div className="flex-1 flex flex-col mt-2">
              <textarea 
                className="w-full flex-1 min-h-[250px] p-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg resize-none outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm leading-relaxed"
                placeholder="Escribe tu mensaje de aprobación aquí..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                required
              ></textarea>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
              <button type="button" className="text-gray-500 font-medium hover:text-red-500 transition px-4 py-2">
                Descartar
              </button>
              
              <div className="flex gap-3">
                <button type="submit" className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  📥 Enviar y Descargar PDF
                </button>
                <Link href="/formato-reserva-exportacion" className="bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg shadow hover:bg-emerald-600 transition-colors flex items-center">
                  Siguiente Paso →
                </Link>
              </div>
            </div>

          </form>

        </div>
      </div>
    </main>
  );
}