"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function CartaRetiroContenedor() {
  const router = useRouter();
  
  // --- LOGO DE LA TRANSPORTADORA ---
  const [logoBase64, setLogoBase64] = useState<string>("");

  // --- DATOS TOTALMENTE EDITABLES ---
  const [fechaEmision, setFechaEmision] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [contenedores, setContenedores] = useState("");
  const [shipperNombre, setShipperNombre] = useState("");

  const [puertoOrigen, setPuertoOrigen] = useState("Buenaventura");
  const [puertoDestino, setPuertoDestino] = useState(""); 
  const [naviera, setNaviera] = useState("ONE");
  const [pesoBruto, setPesoBruto] = useState(""); 
  const [patioVacio, setPatioVacio] = useState("");
  const [empresaTransporte, setEmpresaTransporte] = useState("");

  // CARGAR LOS DATOS AL ABRIR LA PÁGINA
  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    const borradorGuardado = sessionStorage.getItem("borrador_carta_retiro_v5");
    
    if (borradorGuardado) {
      const datos = JSON.parse(borradorGuardado);
      setLogoBase64(datos.logoBase64 || ""); // Cargar Logo
      setFechaEmision(datos.fechaEmision || hoy);
      setBookingRef(datos.bookingRef || "");
      setContenedores(datos.contenedores || "");
      setShipperNombre(datos.shipperNombre || "");
      setPuertoOrigen(datos.puertoOrigen || "Buenaventura");
      setPuertoDestino(datos.puertoDestino || "");
      setNaviera(datos.naviera || "ONE");
      setPesoBruto(datos.pesoBruto || "");
      setPatioVacio(datos.patioVacio || "");
      setEmpresaTransporte(datos.empresaTransporte || "");
    } else {
      // Precarga automática desde el Booking
      setFechaEmision(hoy);
      const datosGuardados = localStorage.getItem('datosReserva');
      if (datosGuardados) {
        const parsed = JSON.parse(datosGuardados);
        if (parsed.bookingRef) setBookingRef(parsed.bookingRef);
        if (parsed.contenedores) setContenedores(parsed.contenedores);
        if (parsed.shipperNombre) setShipperNombre(parsed.shipperNombre);
        if (parsed.destino) setPuertoDestino(parsed.destino);
        if (parsed.pesoBruto) setPesoBruto(parsed.pesoBruto);
      }
    }
  }, []);

  // GUARDAR DATOS AUTOMÁTICAMENTE
  useEffect(() => {
    const borradorActual = {
      logoBase64, fechaEmision, bookingRef, contenedores, shipperNombre,
      puertoOrigen, puertoDestino, naviera, pesoBruto, patioVacio, empresaTransporte
    };
    sessionStorage.setItem("borrador_carta_retiro_v5", JSON.stringify(borradorActual));
  });

  // FUNCIÓN PARA SUBIR Y CONVERTIR EL LOGO
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = new jsPDF();

    // --- LOGO DE LA TRANSPORTADORA (CUADRADO 25x25) ---
    if (logoBase64) {
      doc.addImage(logoBase64, 20, 10, 25, 25);
    }

    // --- ENCABEZADO ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(13, 148, 136); // Teal
    // Alineamos el título y la fecha a la derecha para no chocar con el logo
    doc.text("CARTA DE RETIRO", 190, 25, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`${puertoOrigen}, ${fechaEmision}`, 190, 32, { align: "right" });

    // --- INFORMACIÓN DE LA OPERACIÓN ---
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 40, 190, 40);

    doc.setFont("helvetica", "bold");
    doc.text("DATOS DE LA RESERVA:", 20, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`Booking No: ${bookingRef}`, 20, 57);
    doc.text(`Exportador: ${shipperNombre}`, 20, 64);
    doc.text(`Contenedores: ${contenedores}`, 20, 71);

    doc.setFont("helvetica", "bold");
    doc.text("DETALLES LOGÍSTICOS:", 110, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`Naviera: ${naviera}`, 110, 57);
    doc.text(`Puerto Origen: ${puertoOrigen}`, 110, 64);
    doc.text(`Puerto Destino: ${puertoDestino}`, 110, 71);
    doc.text(`Peso Bruto: ${pesoBruto}`, 110, 78);

    // --- CUERPO DE LA CARTA (CORREGIDO PARA USAR PUERTO DE ORIGEN) ---
    const cuerpo = `Por medio de la presente, autorizamos a la empresa transportadora ${empresaTransporte.toUpperCase()} para realizar el retiro de los equipos vacíos en el patio ${patioVacio.toUpperCase()}. Una vez realizado el cargue de la mercancía con un peso bruto de ${pesoBruto}, el contenedor será trasladado para su ingreso lleno al puerto de ${puertoOrigen.toUpperCase()}.`;
    
    const lineas = doc.splitTextToSize(cuerpo, 170);
    doc.text(lineas, 20, 95);

    // --- FIRMA ---
    doc.setFont("helvetica", "bold");
    doc.text("Atentamente,", 20, 140);
    doc.line(20, 165, 80, 165);
    doc.text("Departamento de Operaciones", 20, 172);
    doc.text(shipperNombre || "Exportador", 20, 177);

    doc.save(`Carta_Retiro_${bookingRef}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      
      <div className="w-full max-w-4xl mb-4 flex justify-between items-center">
        <button 
          onClick={() => router.back()} 
          type="button"
          className="bg-white text-teal-700 border border-teal-700 px-4 py-2 rounded font-bold hover:bg-teal-50 transition-colors flex items-center gap-2 shadow-sm">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 border-t-8 border-teal-500">
        
        <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-8 rounded-r-lg">
          <h3 className="font-bold text-teal-800 text-lg mb-1">Paso 6: Carta de Retiro de Contenedor</h3>
          <p className="text-teal-700 text-sm">
            Verifica y edita los datos de la autorización para que el transporte retire el contenedor vacío y lo entregue lleno en el puerto de destino.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-center text-teal-600 mb-8 uppercase tracking-tight">Carta de Retiro</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="bg-white p-4 rounded-lg border-2 border-dashed border-teal-300 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <label className="block text-sm font-bold text-teal-800 mb-2">Añadir Logo de la Transportadora (Opcional)</label>
              <p className="text-xs text-gray-500 mb-3">Sube el logo de la empresa que retira para que encabece el documento.</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload} 
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200 cursor-pointer" 
              />
            </div>
            {logoBase64 && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-gray-400 mb-1">Vista Previa</span>
                <img src={logoBase64} alt="Logo Preview" className="h-20 w-20 object-contain border border-gray-200 rounded p-1 shadow-sm" />
                <button type="button" onClick={() => setLogoBase64("")} className="text-xs text-red-500 hover:underline mt-1">Quitar logo</button>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-sm font-bold text-teal-700 mb-3 border-b pb-1 uppercase">Datos Base</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">FECHA DE EMISIÓN:</label>
                <input type="date" className="w-full border p-2 text-sm rounded outline-none focus:ring-2 focus:ring-teal-500 bg-white" value={fechaEmision} onChange={(e)=>setFechaEmision(e.target.value)} required/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">NÚMERO DE BOOKING:</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-2 focus:ring-teal-500 bg-white" value={bookingRef} onChange={(e)=>setBookingRef(e.target.value)} required/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">CONTENEDORES ASIGNADOS:</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-2 focus:ring-teal-500 bg-white" value={contenedores} onChange={(e)=>setContenedores(e.target.value)} required/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">EXPORTADOR (VENDEDOR):</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-2 focus:ring-teal-500 bg-white" value={shipperNombre} onChange={(e)=>setShipperNombre(e.target.value)} required/>
              </div>
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">PUERTO DE ORIGEN:</label>
              <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-2 focus:ring-teal-500 bg-white" value={puertoOrigen} onChange={(e)=>setPuertoOrigen(e.target.value)} required/>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">PUERTO DE DESTINO:</label>
              <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-2 focus:ring-teal-500 bg-white" value={puertoDestino} onChange={(e)=>setPuertoDestino(e.target.value)} required/>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">PESO BRUTO:</label>
              <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-2 focus:ring-teal-500 bg-white" placeholder="Ej. 24,500 KG" value={pesoBruto} onChange={(e)=>setPesoBruto(e.target.value)} required/>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">LÍNEA NAVIERA:</label>
              <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-2 focus:ring-teal-500 bg-white" value={naviera} onChange={(e)=>setNaviera(e.target.value)} required/>
            </div>
          </section>

          <section className="bg-teal-50/50 p-4 rounded-lg border border-teal-100">
            <h3 className="text-sm font-bold text-teal-700 mb-3 border-b pb-1 uppercase">Datos del Patio de Vacíos</h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">NOMBRE DEL PATIO (Donde se recoge):</label>
              <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-2 focus:ring-teal-500 bg-white" placeholder="Ej. PATIO CONTECAR" value={patioVacio} onChange={(e)=>setPatioVacio(e.target.value)} required/>
            </div>
          </section>

          <section className="border border-gray-200 p-4 rounded-lg space-y-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 border-b pb-1 uppercase">Logística Terrestre</h3>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">EMPRESA TRANSPORTADORA:</label>
              <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-2 focus:ring-teal-500 bg-white" placeholder="Ej. CONALCA S.A.S" value={empresaTransporte} onChange={(e)=>setEmpresaTransporte(e.target.value)} required/>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Puerto de Origen (Entrega de lleno):</label>
              <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-2 focus:ring-teal-500 bg-white" value={puertoOrigen} onChange={(e)=>setPuertoOrigen(e.target.value)} required />
            </div>
          </section>

          <button type="submit" className="w-full bg-teal-600 text-white font-bold py-4 px-4 rounded-md hover:bg-teal-700 transition-colors shadow-md mt-6 text-lg">
            Generar y Descargar Carta de Retiro (PDF)
          </button>

          <Link href="/declaracion-exportacion" className="w-full block text-center bg-teal-100 text-teal-800 font-bold py-4 px-4 rounded-md hover:bg-teal-200 transition-colors mt-4 text-lg">
            Siguiente Paso: Declaración de Exportación →
          </Link>
        </form>
      </div>
    </main>
  );
}