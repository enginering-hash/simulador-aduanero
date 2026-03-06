"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 1. NUEVO: Importamos el enrutador

export default function CertificadoOrigen() {
  const router = useRouter(); // 2. NUEVO: Inicializamos el enrutador

  // --- CAMPOS PRECARGADOS (Pero ahora son editables) ---
  const [exportadorNombre, setExportadorNombre] = useState("");
  const [paisImportador, setPaisImportador] = useState("");
  const [facturaNo, setFacturaNo] = useState("");
  const [mercanciaDesc, setMercanciaDesc] = useState("");

  // --- OTROS CAMPOS DEL CERTIFICADO ---
  const [aprobacionNo, setAprobacionNo] = useState("AUT-99283-X");
  const [paisExportador, setPaisExportador] = useState("COLOMBIA");
  const [naladisa, setNaladisa] = useState(""); // Código arancelario ALADI
  const [acuerdo, setAcuerdo] = useState("Acuerdo de Complementación Económica No. 24");
  const [normas, setNormas] = useState("Anexo 2 - Régimen de Origen");
  const [observaciones, setObservaciones] = useState("Mercancía 100% producida en territorio nacional.");
  const [ciudadCertifica, setCiudadCertifica] = useState("Bogotá D.C.");

  // 3. NUEVO: CARGAR LOS DATOS AL ABRIR LA PÁGINA (Borrador)
  useEffect(() => {
    const borradorGuardado = sessionStorage.getItem("borrador_certificado_origen");

    if (borradorGuardado) {
      // Restauramos los datos del borrador temporal
      const datos = JSON.parse(borradorGuardado);
      setExportadorNombre(datos.exportadorNombre || "");
      setPaisImportador(datos.paisImportador || "");
      setFacturaNo(datos.facturaNo || "");
      setMercanciaDesc(datos.mercanciaDesc || "");
      setAprobacionNo(datos.aprobacionNo || "AUT-99283-X");
      setPaisExportador(datos.paisExportador || "COLOMBIA");
      setNaladisa(datos.naladisa || "");
      setAcuerdo(datos.acuerdo || "Acuerdo de Complementación Económica No. 24");
      setNormas(datos.normas || "Anexo 2 - Régimen de Origen");
      setObservaciones(datos.observaciones || "Mercancía 100% producida en territorio nacional.");
      setCiudadCertifica(datos.ciudadCertifica || "Bogotá D.C.");
    } else {
      // Si NO hay borrador, recuperamos los datos de la reserva global (primera vez)
      const datosGuardados = localStorage.getItem('datosReserva');
      const facturaGuardada = localStorage.getItem('numeroProforma');

      if (datosGuardados) {
        const parsed = JSON.parse(datosGuardados);
        setPaisImportador(parsed.destino?.split(',').pop()?.trim().toUpperCase() || "");
        setExportadorNombre(parsed.shipperNombre || "");
        setMercanciaDesc(parsed.mercancia || "");
      }
      if (facturaGuardada) {
        setFacturaNo(facturaGuardada);
      }
    }
  }, []);

  // 4. NUEVO: GUARDAR LOS DATOS CADA VEZ QUE ESCRIBES ALGO
  useEffect(() => {
    const borradorActual = {
      exportadorNombre, paisImportador, facturaNo, mercanciaDesc,
      aprobacionNo, paisExportador, naladisa, acuerdo, normas,
      observaciones, ciudadCertifica
    };
    sessionStorage.setItem("borrador_certificado_origen", JSON.stringify(borradorActual));
  });

  const generarPDF = () => {
    const doc = new jsPDF();
    const hoy = new Date();

    // --- DISEÑO DE BORDES Y ESTRUCTURA ---
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277); // Borde exterior
    
    // Encabezado superior
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("REPÚBLICA DE COLOMBIA", 35, 20);
    doc.setFontSize(8);
    doc.text("CERTIFICADO DE ORIGEN", 105, 15, { align: "center" });
    doc.text("ASOCIACION LATINOAMERICANA DE INTEGRACION", 105, 20, { align: "center" });
    doc.text(`Aprobación No: ${aprobacionNo}`, 160, 20);

    doc.line(10, 25, 200, 25); // Línea divisoria encabezado

    // 1 y 2. Paises
    doc.line(105, 25, 105, 45); // Línea vertical central
    doc.setFontSize(7);
    doc.text("1. PAIS EXPORTADOR", 12, 29);
    doc.setFontSize(10);
    doc.text(paisExportador, 55, 37, { align: "center" });
    
    doc.setFontSize(7);
    doc.text("2. PAIS IMPORTADOR", 107, 29);
    doc.setFontSize(10);
    doc.text(paisImportador, 150, 37, { align: "center" });

    doc.line(10, 45, 200, 45); // Línea horizontal

    // 4 y 5. Tabla de Mercaderías
    doc.line(40, 45, 40, 110); // Línea vertical NALADISA
    doc.setFontSize(7);
    doc.text("4. NALADISA / NCM", 12, 49);
    doc.text("5. DENOMINACION DE LAS MERCADERIAS", 42, 49);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(naladisa, 25, 65, { align: "center" });
    
    const descCortada = doc.splitTextToSize(mercanciaDesc, 150);
    doc.text(descCortada, 42, 60);

    doc.line(10, 110, 200, 110); // Línea horizontal

    // 6. Declaración de Origen
    doc.setFont("helvetica", "bold");
    doc.text("6. DECLARACION DE ORIGEN", 12, 115);
    doc.setFont("helvetica", "normal");
    const textoDeclaracion = `DECLARAMOS que las mercancías indicadas en el presente formulario correspondientes a la factura Comercial No. ${facturaNo} cumplen con lo establecido en las normas de origen del Acuerdo (2) ${acuerdo} de conformidad con el siguiente desglose:`;
    const lineasDeclaracion = doc.splitTextToSize(textoDeclaracion, 180);
    doc.text(lineasDeclaracion, 12, 122);

    doc.line(10, 140, 200, 140); // Línea horizontal

    // 7. Normas
    doc.setFont("helvetica", "bold");
    doc.text("7. NORMAS (3)", 12, 145);
    doc.setFont("helvetica", "normal");
    doc.text(normas, 12, 155);

    doc.line(10, 180, 200, 180); // Línea horizontal

    // 8, 9, 10. Fecha y Exportador
    doc.line(55, 180, 55, 210); // Línea vertical fecha
    doc.text("8. FECHA", 12, 184);
    doc.text("AÑO", 15, 192); doc.text("MES", 30, 192); doc.text("DIA", 45, 192);
    doc.text(hoy.getFullYear().toString(), 15, 202);
    doc.text((hoy.getMonth() + 1).toString(), 30, 202);
    doc.text(hoy.getDate().toString(), 45, 202);

    doc.text("9. RAZON SOCIAL DEL EXPORTADOR O PRODUCTOR", 57, 184);
    doc.setFont("helvetica", "bold");
    doc.text(exportadorNombre, 57, 192);
    
    doc.setFont("helvetica", "normal");
    doc.text("10. FIRMA Y SELLO DEL EXPORTADOR O PRODUCTOR", 57, 205);

    doc.line(10, 210, 200, 210); // Línea horizontal

    // 11. Observaciones
    doc.text("11. OBSERVACIONES", 12, 215);
    doc.text(observaciones, 12, 222);

    doc.line(10, 235, 200, 235); // Línea horizontal

    // 12. Certificación de Origen
    doc.setFont("helvetica", "bold");
    doc.text("12. CERTIFICACION DE ORIGEN", 12, 240);
    doc.setFont("helvetica", "normal");
    doc.text(`Certifico la veracidad de la presente declaración, que sello y firmo en la ciudad de ${ciudadCertifica}`, 12, 248);
    doc.text(`a los ${hoy.getDate()} días del mes de ${hoy.toLocaleString('es-ES', { month: 'long' })} de ${hoy.getFullYear()}.`, 12, 254);

    doc.text("__________________________________________", 130, 275);
    doc.text("NOMBRE, FIRMA Y SELLO ENTIDAD CERTIFICADORA", 130, 280);

    doc.save(`Certificado_Origen_${facturaNo || 'ALADI'}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      
      {/* 5. NUEVO: BOTÓN DINÁMICO DE ATRÁS */}
      <div className="w-full max-w-5xl mb-4 flex justify-between items-center">
        <button 
          onClick={() => router.back()} 
          type="button"
          className="bg-white text-emerald-700 border border-emerald-700 px-4 py-2 rounded font-bold hover:bg-emerald-50 transition-colors flex items-center gap-2 shadow-sm">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl border-t-8 border-emerald-600 overflow-hidden">
        
        <div className="bg-emerald-50 p-6 border-b border-emerald-200">
          <h2 className="font-black text-2xl text-emerald-800 uppercase tracking-tight">Certificado de Origen (ALADI)</h2>
          <p className="text-sm text-emerald-600 font-medium">
            Valida el origen de la mercancía para acceder a beneficios arancelarios. Modifica los datos heredados si es necesario.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); generarPDF(); }} className="p-8 space-y-6">
          
          {/* SECCIÓN 1: DATOS HEREDADOS PERO EDITABLES */}
          <section className="bg-emerald-50/30 p-5 rounded-lg border border-emerald-100 shadow-sm">
            <h3 className="font-bold text-emerald-800 mb-4 border-b pb-2">DATOS DE LA OPERACIÓN (Precargados y Editables)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">EXPORTADOR (Productor):</label>
                <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none font-medium" value={exportadorNombre} onChange={(e)=>setExportadorNombre(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">PAÍS IMPORTADOR:</label>
                <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none uppercase font-medium" value={paisImportador} onChange={(e)=>setPaisImportador(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">FACTURA COMERCIAL NO.:</label>
                <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none font-medium" value={facturaNo} onChange={(e)=>setFacturaNo(e.target.value)} required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">CÓDIGO NALADISA / NCM:</label>
                <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ej. 4418.20.00" value={naladisa} onChange={(e)=>setNaladisa(e.target.value)} required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">DESCRIPCIÓN DE LA MERCADERÍA:</label>
                <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none font-medium" value={mercanciaDesc} onChange={(e)=>setMercanciaDesc(e.target.value)} required />
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: ACUERDOS Y NORMAS */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 border-b pb-1">TRATADO INTERNACIONAL</h3>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">ACUERDO COMERCIAL:</label>
                <input type="text" className="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-emerald-500" value={acuerdo} onChange={(e)=>setAcuerdo(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">NORMAS DE ORIGEN:</label>
                <input type="text" className="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-emerald-500" value={normas} onChange={(e)=>setNormas(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 border-b pb-1">CERTIFICACIÓN FINAL</h3>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">CIUDAD DONDE SE CERTIFICA:</label>
                <input type="text" className="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-emerald-500" value={ciudadCertifica} onChange={(e)=>setCiudadCertifica(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">OBSERVACIONES:</label>
                <input type="text" className="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-emerald-500" value={observaciones} onChange={(e)=>setObservaciones(e.target.value)} />
              </div>
            </div>
          </section>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded shadow-lg hover:bg-emerald-700 transition-all text-lg border-b-4 border-emerald-800">
              📥 Descargar Certificado de Origen (PDF)
            </button>
            <Link href="/carta-responsabilidad" className="flex-1 bg-blue-600 text-white font-bold py-4 rounded shadow-lg hover:bg-blue-700 text-center text-lg border-b-4 border-blue-800 flex items-center justify-center">
              Paso 11: Carta de Responsabilidad →
            </Link>
          </div>

        </form>
      </div>
    </main>
  );
}