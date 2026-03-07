"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function CartaResponsabilidad() {
  const router = useRouter(); 

  // --- DATOS DEL REPRESENTANTE LEGAL Y EMPRESA ---
  const [ciudadFecha, setCiudadFecha] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [nit, setNit] = useState("");
  const [direccionEmpresa, setDireccionEmpresa] = useState("");
  const [telefonoEmpresa, setTelefonoEmpresa] = useState("");
  
  const [representanteLegal, setRepresentanteLegal] = useState("");
  const [cedulaRepresentante, setCedulaRepresentante] = useState("");
  
  // --- DATOS LOGÍSTICOS ---
  const [agenciaAduanas, setAgenciaAduanas] = useState("");
  const [puertoEmbarque, setPuertoEmbarque] = useState("");
  const [puertoDestino, setPuertoDestino] = useState("");
  const [consignatario, setConsignatario] = useState("");
  const [mercancia, setMercancia] = useState("");
  const [pesoBruto, setPesoBruto] = useState("");
  const [reservaContenedor, setReservaContenedor] = useState("");

  // CARGAR LOS DATOS AL ABRIR LA PÁGINA (Borrador o Nuevo)
  useEffect(() => {
    const borradorGuardado = sessionStorage.getItem("borrador_carta_responsabilidad");

    if (borradorGuardado) {
      // Restauramos los datos desde el borrador temporal
      const datos = JSON.parse(borradorGuardado);
      setCiudadFecha(datos.ciudadFecha || "");
      setEmpresa(datos.empresa || "");
      setNit(datos.nit || "");
      setDireccionEmpresa(datos.direccionEmpresa || "");
      setTelefonoEmpresa(datos.telefonoEmpresa || "");
      setRepresentanteLegal(datos.representanteLegal || "");
      setCedulaRepresentante(datos.cedulaRepresentante || "");
      setAgenciaAduanas(datos.agenciaAduanas || "");
      setPuertoEmbarque(datos.puertoEmbarque || "");
      setPuertoDestino(datos.puertoDestino || "");
      setConsignatario(datos.consignatario || "");
      setMercancia(datos.mercancia || "");
      setPesoBruto(datos.pesoBruto || "");
      setReservaContenedor(datos.reservaContenedor || "");
    } else {
      // Si NO hay borrador, generamos fecha y heredamos datos del Booking
      const hoy = new Date();
      const opcionesFecha: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      setCiudadFecha(`Buenaventura, ${hoy.toLocaleDateString('es-ES', opcionesFecha)}`);

      const datosGuardados = localStorage.getItem('datosReserva');
      if (datosGuardados) {
        const parsed = JSON.parse(datosGuardados);
        setEmpresa(parsed.shipperNombre || "");
        setPuertoEmbarque(parsed.puertoCargue || "Buenaventura");
        setPuertoDestino(parsed.destino || "");
        setConsignatario(parsed.consignatarioNombre || "");
        setMercancia(parsed.mercancia || "");
        setPesoBruto(parsed.pesoBruto || "");
        setReservaContenedor(`${parsed.bookingRef || ""} / ${parsed.contenedores || ""}`);
      }
    }
  }, []);

  // GUARDAR LOS DATOS CADA VEZ QUE ESCRIBES ALGO
  useEffect(() => {
    const borradorActual = {
      ciudadFecha, empresa, nit, direccionEmpresa, telefonoEmpresa,
      representanteLegal, cedulaRepresentante, agenciaAduanas,
      puertoEmbarque, puertoDestino, consignatario, mercancia,
      pesoBruto, reservaContenedor
    };
    sessionStorage.setItem("borrador_carta_responsabilidad", JSON.stringify(borradorActual));
  });

  const generarPDF = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = new jsPDF();

    // --- MÁRGENES Y FUENTES BÁSICAS ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const margenIzquierdo = 25;
    
    // ¡SOLUCIÓN!: Se ajustó cursorY de 40 a 20 para subir todo el texto en el PDF.
    let cursorY = 20;

    // --- FECHA Y DESTINATARIO ---
    doc.text(ciudadFecha, margenIzquierdo, cursorY);
    cursorY += 15;

    doc.setFont("helvetica", "bold");
    doc.text("Señores", margenIzquierdo, cursorY);
    cursorY += 6;
    doc.text("POLICÍA NACIONAL", margenIzquierdo, cursorY);
    cursorY += 6;
    doc.text("DIRECCIÓN DE ANTINARCÓTICOS - AREA DE CONTROL PORTUARIO", margenIzquierdo, cursorY);
    cursorY += 6;
    doc.text("Ciudad", margenIzquierdo, cursorY);
    cursorY += 15;

    // --- ASUNTO ---
    doc.setFontSize(11);
    doc.text("REF: CARTA DE RESPONSABILIDAD", margenIzquierdo, cursorY);
    cursorY += 15;

    // --- CUERPO DEL DOCUMENTO ---
    doc.setFont("helvetica", "normal");
    
    const parrafo1 = `Yo, ${representanteLegal.toUpperCase()}, mayor de edad y vecino de esta ciudad, identificado con Cédula de Ciudadanía No. ${cedulaRepresentante}, obrando en mi calidad de Representante Legal de la empresa ${empresa.toUpperCase()} con NIT ${nit}, por medio del presente documento me permito manifestar a ustedes, bajo la gravedad de juramento, que mi representada asume toda la responsabilidad civil, penal y administrativa por el contenido de la exportación que a continuación se detalla:`;
    
    const lineasP1 = doc.splitTextToSize(parrafo1, 160);
    doc.text(lineasP1, margenIzquierdo, cursorY);
    cursorY += (lineasP1.length * 6) + 10;

    // --- DETALLES DE LA CARGA ---
    doc.setFont("helvetica", "bold");
    const detalles = [
      `Exportador:`,
      `Agencia de Aduanas (SIA):`,
      `Puerto de Embarque:`,
      `Puerto de Destino:`,
      `Consignatario:`,
      `Descripción de la Mercancía:`,
      `Peso Bruto:`,
      `Reserva (Booking) / Equipo:`
    ];
    const valores = [
      empresa.toUpperCase(),
      agenciaAduanas.toUpperCase(),
      puertoEmbarque.toUpperCase(),
      puertoDestino.toUpperCase(),
      consignatario.toUpperCase(),
      mercancia.toUpperCase(),
      `${pesoBruto} KG`,
      reservaContenedor.toUpperCase()
    ];

    for (let i = 0; i < detalles.length; i++) {
      doc.setFont("helvetica", "bold");
      doc.text(detalles[i], margenIzquierdo, cursorY);
      doc.setFont("helvetica", "normal");
      
      // Ajuste si la descripción es muy larga
      if (detalles[i] === `Descripción de la Mercancía:`) {
         const mercLineas = doc.splitTextToSize(valores[i], 90);
         doc.text(mercLineas, margenIzquierdo + 65, cursorY);
         cursorY += (mercLineas.length * 6);
      } else if (detalles[i] === `Consignatario:`) {
         const consLineas = doc.splitTextToSize(valores[i], 90);
         doc.text(consLineas, margenIzquierdo + 65, cursorY);
         cursorY += (consLineas.length * 6);
      } else {
         doc.text(valores[i], margenIzquierdo + 65, cursorY);
         cursorY += 8;
      }
    }

    cursorY += 5;

    // --- CLÁUSULA ANTINARCÓTICOS ---
    const parrafo2 = `Igualmente certificamos que la mercancía detallada anteriormente es lícita, no contiene sustancias estupefacientes, psicotrópicas, precursores químicos, armas, explosivos, ni dineros, y que la empresa ha tomado todas las medidas de seguridad para evitar que la carga sea contaminada en su proceso de empaque y transporte hasta las instalaciones del puerto.`;
    
    const lineasP2 = doc.splitTextToSize(parrafo2, 160);
    doc.text(lineasP2, margenIzquierdo, cursorY);
    cursorY += (lineasP2.length * 6) + 25;

    // --- FIRMA ---
    doc.setFont("helvetica", "bold");
    doc.text("___________________________________________________", margenIzquierdo, cursorY);
    cursorY += 6;
    doc.text("FIRMA DEL REPRESENTANTE LEGAL", margenIzquierdo, cursorY);
    cursorY += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${representanteLegal.toUpperCase()}`, margenIzquierdo, cursorY);
    cursorY += 6;
    doc.text(`C.C: ${cedulaRepresentante}`, margenIzquierdo, cursorY);
    cursorY += 6;
    doc.text(`Empresa: ${empresa.toUpperCase()}`, margenIzquierdo, cursorY);
    cursorY += 6;
    doc.text(`Dirección: ${direccionEmpresa} | Teléfono: ${telefonoEmpresa}`, margenIzquierdo, cursorY);

    doc.save(`Carta_Antinarcoticos_${empresa.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-200 p-4 md:p-8 flex flex-col items-center">
      
      <div className="w-full max-w-4xl mb-4 flex justify-between items-center">
        <button 
          onClick={() => router.back()} 
          type="button"
          className="bg-white text-blue-900 border border-blue-900 px-4 py-2 rounded font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border-t-8 border-blue-900 overflow-hidden">
        
        <div className="bg-blue-50 p-6 border-b border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center font-black text-xl shadow-md">PONAL</div>
            <div>
              <h2 className="font-black text-2xl text-blue-950 uppercase tracking-tight">Carta de Responsabilidad (Antinarcóticos)</h2>
              <p className="text-sm text-blue-800 font-medium">
                Documento legal obligatorio asumiendo la responsabilidad penal y civil por el contenido de la carga.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={generarPDF} className="p-8 space-y-8">
          
          {/* SECCIÓN 1: REPRESENTANTE LEGAL */}
          <section className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
            <h3 className="font-bold text-blue-900 mb-4 border-b-2 border-blue-100 pb-2">1. DATOS DEL REPRESENTANTE LEGAL Y EMPRESA</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">NOMBRE COMPLETO (Rep. Legal):</label>
                <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-900 outline-none uppercase" placeholder="Ej. Carlos Arturo Gómez" value={representanteLegal} onChange={(e)=>setRepresentanteLegal(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">CÉDULA DE CIUDADANÍA:</label>
                <input type="number" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-900 outline-none" placeholder="Ej. 16.789.456" value={cedulaRepresentante} onChange={(e)=>setCedulaRepresentante(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">RAZÓN SOCIAL DE LA EMPRESA:</label>
                <input type="text" className="w-full border p-2 rounded bg-gray-50 uppercase font-bold" value={empresa} onChange={(e)=>setEmpresa(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">NIT:</label>
                <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-900 outline-none" placeholder="Ej. 900.123.456-7" value={nit} onChange={(e)=>setNit(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">DIRECCIÓN DE LA EMPRESA:</label>
                <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-900 outline-none" placeholder="Ej. Calle 100 # 15-20, Bogotá" value={direccionEmpresa} onChange={(e)=>setDireccionEmpresa(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">TELÉFONO DE CONTACTO:</label>
                <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-900 outline-none" placeholder="Ej. (601) 555-1234" value={telefonoEmpresa} onChange={(e)=>setTelefonoEmpresa(e.target.value)} required />
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: DATOS DE LA CARGA (PRECABADOS) */}
          <section className="bg-blue-50/50 p-6 rounded-lg border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-4 border-b-2 border-blue-200 pb-2">2. DETALLES DE LA EXPORTACIÓN (Precargados)</h3>
            
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">AGENCIA DE ADUANAS (SIA):</label>
              <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-900 outline-none uppercase" placeholder="Ej. Agencia de Aduanas Nivel 1 S.A." value={agenciaAduanas} onChange={(e)=>setAgenciaAduanas(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">PUERTO DE EMBARQUE:</label>
                <input type="text" className="w-full border p-2 rounded bg-white outline-none" value={puertoEmbarque} onChange={(e)=>setPuertoEmbarque(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">PUERTO DE DESTINO:</label>
                <input type="text" className="w-full border p-2 rounded bg-white outline-none" value={puertoDestino} onChange={(e)=>setPuertoDestino(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">RESERVA (BOOKING) / CONTENEDOR:</label>
                <input type="text" className="w-full border p-2 rounded bg-white outline-none font-bold" value={reservaContenedor} onChange={(e)=>setReservaContenedor(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">PESO BRUTO TOTAL (KG):</label>
                <input type="text" className="w-full border p-2 rounded bg-white outline-none" value={pesoBruto} onChange={(e)=>setPesoBruto(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">CONSIGNATARIO (Destinatario Final):</label>
                <input type="text" className="w-full border p-2 rounded bg-white outline-none" value={consignatario} onChange={(e)=>setConsignatario(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">DESCRIPCIÓN DE LA MERCANCÍA:</label>
                <textarea className="w-full border p-2 rounded bg-white outline-none resize-none h-16" value={mercancia} onChange={(e)=>setMercancia(e.target.value)} required />
              </div>
            </div>
          </section>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button type="submit" className="flex-1 bg-blue-900 text-white font-bold py-4 rounded shadow-lg hover:bg-blue-950 transition-all text-lg border-b-4 border-gray-900">
              📥 Descargar Carta a Policía (PDF)
            </button>
            <Link href="/certificado-ica-exportacion" className="flex-1 bg-teal-600 text-white font-bold py-4 rounded shadow-lg hover:bg-teal-700 text-center text-lg border-b-4 border-teal-800 flex items-center justify-center">
              Siguiente Paso: Certificado ICA →
            </Link>
          </div>

        </form>
      </div>
    </main>
  );
}