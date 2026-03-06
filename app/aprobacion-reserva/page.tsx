"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function AprobacionReserva() {
  const router = useRouter(); 

  // --- ESTADOS EDITABLES ---
  const [naviera, setNaviera] = useState("");
  // NUEVO: Estados para los datos de contacto de la naviera
  const [navieraOffice, setNavieraOffice] = useState("");
  const [navieraTel, setNavieraTel] = useState("");
  const [navieraEmail, setNavieraEmail] = useState("");

  const [bookingRef, setBookingRef] = useState("");
  const [buque, setBuque] = useState("");
  const [eta, setEta] = useState("");
  const [fechaActual, setFechaActual] = useState(""); // Ahora será "Fecha de Zarpe"
  const [cutOff, setCutOff] = useState("");
  
  const [shipperNombre, setShipperNombre] = useState("");
  const [consignatarioNombre, setConsignatarioNombre] = useState("");
  const [puertoCargue, setPuertoCargue] = useState("");
  const [destino, setDestino] = useState("");
  const [mercancia, setMercancia] = useState("");
  const [contenedores, setContenedores] = useState("");
  const [tipoServicio, setTipoServicio] = useState("FCL");

  // CARGAR DATOS AL ABRIR LA PÁGINA
  useEffect(() => {
    // ¡SOLUCIÓN!: Borramos cualquier borrador viejo al entrar para que siempre esté "limpio"
    // a menos que vengas de un estado intermedio en la misma sesión.
    // Para asegurar que siempre pida los datos de nuevo, comentamos la lectura del borrador.
    // sessionStorage.removeItem("borrador_aprobacion_reserva_edit");

    const datosGuardados = localStorage.getItem('datosReserva');
    const datosAnteriores = datosGuardados ? JSON.parse(datosGuardados) : {};

    setBookingRef(datosAnteriores.bookingRef || "");
    setShipperNombre(datosAnteriores.shipperNombre || "");
    setConsignatarioNombre(datosAnteriores.consignatarioNombre || "");
    setPuertoCargue(datosAnteriores.puertoCargue || "");
    setDestino(datosAnteriores.destino || "");
    setMercancia(datosAnteriores.mercancia || "");
    setContenedores(datosAnteriores.contenedores || "");
    setTipoServicio(datosAnteriores.tipoServicio || "FCL");

    // Limpiamos los campos que antes se generaban aleatoriamente
    setBuque("");
    setEta("");
    setFechaActual("");
    setCutOff("");
    setNaviera("");
    setNavieraOffice("");
    setNavieraTel("");
    setNavieraEmail("");

    // Si el paso 4 traía Cut-off (aunque ya lo quitamos, por si acaso)
    if (datosAnteriores.cutOff && datosAnteriores.cutOff.trim() !== "") {
      setCutOff(datosAnteriores.cutOff);
    }
  }, []);

  // GUARDAR EL BORRADOR CADA VEZ QUE SE EDITA ALGO
  useEffect(() => {
    if (bookingRef) {
      const borradorActual = { 
        naviera, navieraOffice, navieraTel, navieraEmail, bookingRef, buque, eta, fechaActual, cutOff,
        shipperNombre, consignatarioNombre, puertoCargue, destino, mercancia, contenedores, tipoServicio
      };
      sessionStorage.setItem("borrador_aprobacion_reserva_edit", JSON.stringify(borradorActual));
      
      const globalActual = localStorage.getItem('datosReserva');
      if(globalActual){
        const datosGlobales = JSON.parse(globalActual);
        const nuevosGlobales = { ...datosGlobales, bookingRef, shipperNombre, consignatarioNombre, puertoCargue, destino, mercancia, contenedores, tipoServicio, cutOff };
        localStorage.setItem('datosReserva', JSON.stringify(nuevosGlobales));
      }
    }
  });

  const generarPDF = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = new jsPDF();

    // --- ENCABEZADO DE LA NAVIERA ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(29, 78, 216); // Azul Naviera
    doc.text((naviera || "NOMBRE DE LA NAVIERA").toUpperCase(), 105, 25, { align: "center" });
    
    // --- NUEVO: DATOS DE CONTACTO DINÁMICOS ---
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    const officeText = navieraOffice ? `Office: ${navieraOffice}` : "Office: ---";
    const telText = navieraTel ? `Telephone: ${navieraTel}` : "Telephone: ---";
    const emailText = navieraEmail ? `Email: ${navieraEmail}` : "Email: ---";
    doc.text(`${officeText}\n${telText}\n${emailText}`, 105, 32, { align: "center" });

    doc.setLineWidth(0.5);
    doc.setDrawColor(29, 78, 216);
    doc.line(20, 45, 190, 45);

    // --- TÍTULO Y REFERENCIAS ---
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`BOOKING CONFIRMATION NO. ${bookingRef}`, 105, 55, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    // CAMBIO: Ahora dice "Fecha de Zarpe"
    doc.text(`Fecha de Zarpe: ${fechaActual}`, 20, 70);
    doc.setFont("helvetica", "italic");
    doc.text(`REF : EMBARQUE A BORDO DE / ${buque}`, 20, 80);
    doc.text(`ETA DESTINO - ${eta}`, 20, 86);
    
    doc.setFont("helvetica", "bold");
    doc.text("Por medio de la presente confirmamos su reserva de espacio para embarque a bordo de la", 20, 96);
    doc.text("Nave en referencia. Datos del embarque como sigue:", 20, 102);

    // --- TABLA DE DATOS ---
    autoTable(doc, {
      startY: 110,
      margin: { left: 20, right: 20 },
      body: [
        ["BOOKING NO", `: ${bookingRef}`],
        ["SHIPPER", `: ${shipperNombre.toUpperCase()}`],
        ["CNEE", `: ${consignatarioNombre.toUpperCase()}`],
        ["PTO. DE EMBARQUE", `: ${puertoCargue.toUpperCase()}`],
        ["DESTINO FINAL", `: ${destino.toUpperCase()}`],
        ["PRODUCTOS", `: ${mercancia.toUpperCase()}`],
        ["CONTAINERS", `: ${contenedores.toUpperCase()}`],
        ["CONDICION", `: ${tipoServicio}`],
        ["EMBARQUE VIA", `: ALMACEN A SOLICITUD DEL CLIENTE`],
        ["FLETE MARÍTIMO", `: AS PER AGREEMENT`]
      ],
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 3, font: "helvetica", fontStyle: "bold" },
      columnStyles: { 0: { cellWidth: 50 } }
    });

    // --- DIBUJAR BORDE DE LA TABLA ---
    const tablaFinalY = (doc as any).lastAutoTable.finalY;
    doc.setDrawColor(0, 0, 0); 
    doc.setLineWidth(0.5); 
    doc.rect(20, 110, 170, tablaFinalY - 110);

    // --- PLAZOS (CUT-OFFS) ---
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold", "underline");
    doc.text("PLAZOS PARA ENTREGA DE CARGA / DOCUMENTOS", 20, finalY);
    
    doc.setFont("helvetica", "normal");
    doc.text(`LA RECEPCION DE LA PRE-MATRIZ DEL CONOCIMIENTO DE EMBARQUE SERA 72 HORAS UTILES ANTES DEL`, 20, finalY + 10);
    doc.text(`ARRIBO DE LA NAVE. (Favor indicar datos completos).`, 20, finalY + 15);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 38, 38); 
    doc.text(`CUT-OFF FÍSICO (INGRESO A PUERTO): ${cutOff}`, 20, finalY + 25);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text("PARA CUALQUIER CONSULTA ADICIONAL, FAVOR CONTACTARNOS.", 20, finalY + 40);
    
    doc.text("ATENTAMENTE,", 20, finalY + 55);
    doc.text("DEPARTAMENTO DE EXPORTACIONES", 20, finalY + 65);
    doc.text((naviera || "NOMBRE DE LA NAVIERA").toUpperCase(), 20, finalY + 70);

    doc.save(`Booking_Confirmation_${bookingRef}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-200 p-8 flex flex-col items-center">
      
      <div className="w-full max-w-4xl mb-4 flex justify-between items-center">
        <button 
          onClick={() => router.back()} 
          type="button"
          className="bg-white text-blue-700 border border-blue-700 px-4 py-2 rounded font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        
        <div className="bg-blue-900 text-white p-6 flex justify-between items-center">
          <div className="w-2/3">
            <input 
              type="text" 
              className="w-full bg-transparent border-b border-blue-400 text-2xl font-black tracking-wider outline-none focus:border-white placeholder-blue-300 mb-2"
              value={naviera}
              onChange={(e) => setNaviera(e.target.value)}
              placeholder="Nombre de la Naviera (Ej: MAERSK)"
              required
            />
            {/* NUEVO: CAMPOS DE CONTACTO DE LA NAVIERA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              <input 
                type="text" 
                className="bg-blue-800 border border-blue-700 text-xs p-1 rounded outline-none focus:ring-1 focus:ring-blue-300 placeholder-blue-400"
                value={navieraOffice}
                onChange={(e) => setNavieraOffice(e.target.value)}
                placeholder="Dirección de la oficina"
              />
              <input 
                type="text" 
                className="bg-blue-800 border border-blue-700 text-xs p-1 rounded outline-none focus:ring-1 focus:ring-blue-300 placeholder-blue-400"
                value={navieraTel}
                onChange={(e) => setNavieraTel(e.target.value)}
                placeholder="Teléfono"
              />
              <input 
                type="email" 
                className="bg-blue-800 border border-blue-700 text-xs p-1 rounded outline-none focus:ring-1 focus:ring-blue-300 placeholder-blue-400"
                value={navieraEmail}
                onChange={(e) => setNavieraEmail(e.target.value)}
                placeholder="Email de contacto"
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-blue-200">Estado de Solicitud:</p>
            <p className="bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm inline-block mt-1 animate-pulse">APROBADO</p>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
            <h3 className="font-bold text-blue-900 text-lg mb-1">Paso 5: Recepción del Booking Confirmation</h3>
            <p className="text-blue-800 text-sm">
              Simula la confirmación de la naviera. <strong>Llena los campos vacíos</strong> (Naviera, Buque, Fechas) para completar el documento antes de descargarlo.
            </p>
          </div>

          <form onSubmit={generarPDF}>
            <div className="border border-gray-300 p-6 rounded bg-gray-50 mb-8 text-sm text-gray-800 shadow-inner">
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-2 mb-6 border-b pb-4">
                <h2 className="font-bold text-lg">BOOKING CONFIRMATION NO.</h2>
                <input 
                  type="text" 
                  className="border border-gray-300 rounded px-2 py-1 font-bold text-lg text-center w-48 outline-none focus:ring-2 focus:ring-blue-500"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="col-span-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <strong className="w-32">REF A BORDO /</strong>
                    <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500" placeholder="Nombre del Buque (Ej: MSC GALAXY)" value={buque} onChange={(e) => setBuque(e.target.value)} required />
                  </div>
                  <div className="flex items-center gap-2">
                    <strong className="w-32">ETA DESTINO:</strong>
                    <input type="date" className="flex-1 border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500" value={eta} onChange={(e) => setEta(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {/* CAMBIO: Ahora dice "FECHA DE ZARPE" */}
                    <strong className="w-24 leading-tight">FECHA DE ZARPE:</strong>
                    <input type="date" className="flex-1 border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500" value={fechaActual} onChange={(e) => setFechaActual(e.target.value)} required />
                  </div>
                </div>
              </div>
              
              <div className="mb-6 text-gray-900">
                <p className="font-bold">
                  Por medio de la presente confirmamos su reserva de espacio para embarque a bordo de la <br/>
                  Nave en referencia. Datos del embarque como sigue:
                </p>
              </div>

              <div className="bg-white p-4 border border-gray-300 grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <strong className="w-40">SHIPPER:</strong>
                  <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500" value={shipperNombre} onChange={(e) => setShipperNombre(e.target.value)} required />
                </div>
                <div className="flex items-center gap-2">
                  <strong className="w-40">CNEE:</strong>
                  <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500" value={consignatarioNombre} onChange={(e) => setConsignatarioNombre(e.target.value)} required />
                </div>
                <div className="flex items-center gap-2">
                  <strong className="w-40">PTO. DE EMBARQUE:</strong>
                  <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500" value={puertoCargue} onChange={(e) => setPuertoCargue(e.target.value)} required />
                </div>
                <div className="flex items-center gap-2">
                  <strong className="w-40">DESTINO FINAL:</strong>
                  <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500" value={destino} onChange={(e) => setDestino(e.target.value)} required />
                </div>
                <div className="flex items-center gap-2">
                  <strong className="w-40">PRODUCTOS:</strong>
                  <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500" value={mercancia} onChange={(e) => setMercancia(e.target.value)} required />
                </div>
                <div className="flex items-center gap-2">
                  <strong className="w-40">CONTAINERS:</strong>
                  <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500" value={contenedores} onChange={(e) => setContenedores(e.target.value)} required />
                </div>
                <div className="flex items-center gap-2">
                  <strong className="w-40">CONDICION:</strong>
                  <select className="flex-1 border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 bg-white" value={tipoServicio} onChange={(e) => setTipoServicio(e.target.value)} required>
                    <option value="FCL">FCL</option>
                    <option value="LCL">LCL</option>
                  </select>
                </div>
              </div>

              <div className="bg-red-50 text-red-800 p-4 border border-red-200 rounded font-bold flex flex-col md:flex-row items-center justify-center gap-2">
                <span>CUT-OFF INGRESO A PUERTO:</span>
                <input type="text" className="border border-red-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-red-500 text-center" value={cutOff} onChange={(e) => setCutOff(e.target.value)} placeholder="Ej. 2025-05-03 17:00 HRS" required />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button type="submit" className="flex-1 bg-blue-800 text-white font-bold py-4 px-4 rounded-md hover:bg-blue-900 transition-colors shadow-md text-center">
                📥 Descargar Booking Confirmation (PDF)
              </button>

              <Link href="/carta-retiro" className="flex-1 bg-gray-200 text-gray-800 font-bold py-4 px-4 rounded-md hover:bg-gray-300 transition-colors shadow-md text-center flex items-center justify-center">
                Siguiente Paso: Carta Retiro Contenedor →
              </Link>
            </div>
          </form>

        </div>
      </div>
    </main>
  );
}