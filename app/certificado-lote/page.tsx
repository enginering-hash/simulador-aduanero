"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function CertificadoLote() {
  const router = useRouter(); 

  // --- DATOS GENERALES ---
  const [fechaEmision, setFechaEmision] = useState("");
  const [exportador, setExportador] = useState("");
  const [consignatario, setConsignatario] = useState("");
  const [directorTecnico, setDirectorTecnico] = useState("");

  // --- TABLA DE LOTES (MÚLTIPLES) ---
  const [lotes, setLotes] = useState([
    { codigo: "", nombre: "", cantidad: "", pesoNeto: "", lote: "", fechaProduccion: "", fechaVencimiento: "", turno: "" }
  ]);

  // CARGAR LOS DATOS AL ABRIR LA PÁGINA
  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0];
    const borradorGuardado = sessionStorage.getItem("borrador_certificado_lote_v2");

    if (borradorGuardado) {
      const datos = JSON.parse(borradorGuardado);
      setFechaEmision(datos.fechaEmision || hoy);
      setExportador(datos.exportador || "");
      setConsignatario(datos.consignatario || "");
      setDirectorTecnico(datos.directorTecnico || "");
      if (datos.lotes && datos.lotes.length > 0) setLotes(datos.lotes);
    } else {
      // Si NO hay borrador, cargamos datos heredados
      setFechaEmision(hoy);
      const datosGuardados = localStorage.getItem('datosReserva');
      if (datosGuardados) {
        const parsed = JSON.parse(datosGuardados);
        setExportador(parsed.shipperNombre || "");
        setConsignatario(parsed.consignatarioNombre || "");
        
        // Precargar el primer lote con el nombre de la mercancía si existe
        setLotes([
          { codigo: "", nombre: parsed.mercancia || "", cantidad: "", pesoNeto: "", lote: "", fechaProduccion: "", fechaVencimiento: "", turno: "" }
        ]);
      }
    }
  }, []);

  // GUARDAR DATOS EN MEMORIA
  useEffect(() => {
    const borradorActual = {
      fechaEmision, exportador, consignatario, directorTecnico, lotes
    };
    sessionStorage.setItem("borrador_certificado_lote_v2", JSON.stringify(borradorActual));
  });

  const agregarLote = () => {
    setLotes([...lotes, { codigo: "", nombre: "", cantidad: "", pesoNeto: "", lote: "", fechaProduccion: "", fechaVencimiento: "", turno: "" }]);
  };

  const actualizarLote = (index: number, campo: string, valor: string) => {
    const nuevosLotes = [...lotes];
    nuevosLotes[index] = { ...nuevosLotes[index], [campo]: valor };
    setLotes(nuevosLotes);
  };

  const eliminarLote = (indexToRemove: number) => {
    if (lotes.length === 1) return;
    setLotes(lotes.filter((_, index) => index !== indexToRemove));
  };

  const generarPDF = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = new jsPDF("landscape"); // Formato horizontal para que quepan las columnas

    // --- ENCABEZADO ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(217, 119, 6); // Ámbar oscuro
    doc.text(exportador.toUpperCase() || "NOMBRE DEL EXPORTADOR", 148, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("DEPARTAMENTO DE CALIDAD Y TRAZABILIDAD", 148, 26, { align: "center" });
    
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.5);
    doc.line(20, 30, 277, 30);

    // --- TÍTULO ---
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("CERTIFICADO DE LOTE Y PRODUCCIÓN (COA)", 148, 40, { align: "center" });

    // --- DATOS GENERALES ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Fecha de Emisión:", 20, 50);
    doc.setFont("helvetica", "normal");
    doc.text(fechaEmision, 55, 50);

    doc.setFont("helvetica", "bold");
    doc.text("Cliente / Consignatario:", 20, 56);
    doc.setFont("helvetica", "normal");
    doc.text(consignatario.toUpperCase(), 65, 56);

    // --- TABLA DE LOTES ---
    const columnas = ["CÓDIGO", "NOMBRE", "CANTIDAD", "PESO NETO", "LOTE", "F. PRODUCCIÓN", "F. VENCIMIENTO", "TURNO"];
    
    const filas = lotes.map((l) => [
      l.codigo,
      l.nombre,
      l.cantidad,
      l.pesoNeto,
      l.lote,
      l.fechaProduccion,
      l.fechaVencimiento,
      l.turno
    ]);

    autoTable(doc, {
      startY: 65,
      head: [columnas],
      body: filas,
      theme: 'grid',
      headStyles: { fillColor: [245, 158, 11], textColor: 255, fontStyle: 'bold', halign: 'center' },
      styles: { fontSize: 8, cellPadding: 3, valign: 'middle' },
      columnStyles: { 
        0: { halign: 'center' }, 
        2: { halign: 'center' }, 
        3: { halign: 'center' }, 
        4: { halign: 'center' }, 
        5: { halign: 'center' }, 
        6: { halign: 'center' }, 
        7: { halign: 'center' } 
      }
    });

    // --- DECLARACIÓN FINAL ---
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const textoCierre = `Certificamos que los lotes de producción detallados en este documento han sido fabricados, inspeccionados y liberados bajo los estándares de calidad vigentes (BPM), cumpliendo con todas las especificaciones técnicas requeridas para su exportación y comercialización.`;
    const lineasCierre = doc.splitTextToSize(textoCierre, 250);
    doc.text(lineasCierre, 20, finalY);

    // --- FIRMA ---
    const firmaY = finalY + 30;
    doc.setFont("helvetica", "bold");
    doc.line(20, firmaY, 80, firmaY);
    doc.text(directorTecnico.toUpperCase() || "DIRECTOR TÉCNICO", 20, firmaY + 5);
    doc.setFont("helvetica", "normal");
    doc.text("Dirección de Calidad", 20, firmaY + 10);

    doc.save(`Certificado_Lote_${exportador.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      
      <div className="w-full max-w-6xl mb-4 flex justify-between items-center">
        <button onClick={() => router.back()} type="button" className="bg-white text-amber-700 border border-amber-700 px-4 py-2 rounded font-bold hover:bg-amber-50 transition-colors flex items-center gap-2 shadow-sm">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl border-t-8 border-amber-500 overflow-hidden">
        
        <div className="bg-amber-50 p-6 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center font-black text-xl shadow-md">QA</div>
            <div>
              <h2 className="font-black text-2xl text-amber-900 uppercase tracking-tight">Certificado de Lote (COA)</h2>
              <p className="text-sm text-amber-700 font-medium">
                Emite el certificado que garantiza la trazabilidad de los diferentes lotes de producción a exportar.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={generarPDF} className="p-8 space-y-8">
          
          {/* SECCIÓN 1: DATOS GENERALES */}
          <section className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
            <h3 className="font-bold text-amber-800 mb-4 border-b-2 border-amber-100 pb-2">1. DATOS GENERALES</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Fecha de Emisión:</label>
                <input type="date" className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500 outline-none" value={fechaEmision} onChange={(e)=>setFechaEmision(e.target.value)} required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Empresa Exportadora (Fabricante):</label>
                <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500 outline-none font-bold" value={exportador} onChange={(e)=>setExportador(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Consignatario / Cliente:</label>
                <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500 outline-none" value={consignatario} onChange={(e)=>setConsignatario(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Director Técnico (Quien firma):</label>
                <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Ej. Ing. Laura Gómez" value={directorTecnico} onChange={(e)=>setDirectorTecnico(e.target.value)} required />
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: TABLA DE LOTES */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-amber-900 border-b border-amber-200 pb-2">2. TRAZABILIDAD DE LOTES</h3>
              <button type="button" onClick={agregarLote} className="bg-amber-100 text-amber-800 font-bold py-2 px-4 rounded-md hover:bg-amber-200 text-sm shadow-sm transition-colors border border-amber-300">
                + Agregar Lote
              </button>
            </div>

            {/* Encabezado Grid */}
            <div className="flex items-center gap-2 mb-2">
              <div className="hidden md:grid grid-cols-12 gap-2 bg-amber-600 text-white p-2 rounded-md text-[10px] font-bold text-center items-center w-full shadow-sm">
                <div className="col-span-1 uppercase">Código</div>
                <div className="col-span-3 uppercase">Nombre / Producto</div>
                <div className="col-span-1 uppercase">Cant.</div>
                <div className="col-span-1 uppercase">P. Neto</div>
                <div className="col-span-1 uppercase">Lote</div>
                <div className="col-span-2 uppercase">F. Producción</div>
                <div className="col-span-2 uppercase">F. Vencimiento</div>
                <div className="col-span-1 uppercase">Turno</div>
              </div>
              <div className="w-8 shrink-0 hidden md:block"></div> 
            </div>

            {/* Filas */}
            {lotes.map((lote, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-2">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 border border-gray-300 bg-white p-4 md:p-2 rounded-md shadow-sm w-full">
                  
                  <div className="md:col-span-1">
                    <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Código:</label>
                    <input type="text" className="w-full border rounded p-1 text-sm text-center outline-none focus:ring-1 focus:ring-amber-500" placeholder="8710" value={lote.codigo} onChange={(e) => actualizarLote(index, 'codigo', e.target.value)} required />
                  </div>
                  
                  <div className="md:col-span-3">
                    <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Nombre:</label>
                    <input type="text" className="w-full border rounded p-1 text-sm outline-none focus:ring-1 focus:ring-amber-500" placeholder="Galleta de leche..." value={lote.nombre} onChange={(e) => actualizarLote(index, 'nombre', e.target.value)} required />
                  </div>
                  
                  <div className="md:col-span-1">
                    <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Cantidad:</label>
                    <input type="number" className="w-full border rounded p-1 text-sm text-center outline-none focus:ring-1 focus:ring-amber-500" placeholder="135" value={lote.cantidad} onChange={(e) => actualizarLote(index, 'cantidad', e.target.value)} required />
                  </div>
                  
                  <div className="md:col-span-1">
                    <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">P. Neto:</label>
                    <input type="number" className="w-full border rounded p-1 text-sm text-center outline-none focus:ring-1 focus:ring-amber-500" placeholder="931.5" value={lote.pesoNeto} onChange={(e) => actualizarLote(index, 'pesoNeto', e.target.value)} required />
                  </div>
                  
                  <div className="md:col-span-1">
                    <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Lote:</label>
                    <input type="text" className="w-full border rounded p-1 text-sm text-center outline-none focus:ring-1 focus:ring-amber-500 font-bold text-amber-700" placeholder="774839-1" value={lote.lote} onChange={(e) => actualizarLote(index, 'lote', e.target.value)} required />
                  </div>

                  <div className="md:col-span-2">
                    <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Fecha Prod:</label>
                    <input type="text" className="w-full border rounded p-1 text-sm text-center outline-none focus:ring-1 focus:ring-amber-500" placeholder="Ej. 30-sep-25" value={lote.fechaProduccion} onChange={(e) => actualizarLote(index, 'fechaProduccion', e.target.value)} required />
                  </div>

                  <div className="md:col-span-2">
                    <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Fecha Venc:</label>
                    <input type="text" className="w-full border rounded p-1 text-sm text-center outline-none focus:ring-1 focus:ring-amber-500" placeholder="Ej. 30-sep-26" value={lote.fechaVencimiento} onChange={(e) => actualizarLote(index, 'fechaVencimiento', e.target.value)} required />
                  </div>

                  <div className="md:col-span-1">
                    <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Turno:</label>
                    <input type="text" className="w-full border rounded p-1 text-sm text-center outline-none focus:ring-1 focus:ring-amber-500" placeholder="Mañana" value={lote.turno} onChange={(e) => actualizarLote(index, 'turno', e.target.value)} required />
                  </div>

                </div>

                {/* Botón flotante para eliminar */}
                <div className="w-full md:w-8 shrink-0 flex justify-end md:justify-center mt-2 md:mt-0">
                  {lotes.length > 1 ? (
                    <button 
                      type="button" 
                      onClick={() => eliminarLote(index)} 
                      className="bg-red-50 text-red-600 font-bold w-8 h-8 rounded-full hover:bg-red-100 transition-colors border border-red-200 flex items-center justify-center text-xs shadow-sm"
                      title="Eliminar fila"
                    >
                      X
                    </button>
                  ) : (
                    <div className="w-8 h-8 hidden md:block"></div> 
                  )}
                </div>

              </div>
            ))}
          </section>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button type="submit" className="flex-1 bg-amber-600 text-white font-bold py-4 rounded shadow-lg hover:bg-amber-700 transition-all text-lg border-b-4 border-amber-800">
              📥 Descargar Certificado de Lote (PDF)
            </button>
            <Link href="/certificado-ica" className="flex-1 bg-green-700 text-white font-bold py-4 rounded shadow-lg hover:bg-green-800 text-center text-lg border-b-4 border-green-900 flex items-center justify-center">
              Siguiente Paso: Certificado ICA →
            </Link>
          </div>

        </form>
      </div>
    </main>
  );
}