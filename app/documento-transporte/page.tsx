"use client";

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function DocumentoTransporteExportacion() {
  const router = useRouter(); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 0. CONFIGURACIÓN NAVIERA (ENCABEZADO EDITABLE) ---
  const [lineaNavieraNombre, setLineaNavieraNombre] = useState("");
  const [lineaNavieraNit, setLineaNavieraNit] = useState("");
  const [lineaNavieraLogo, setLineaNavieraLogo] = useState<string | null>(null); // Base64

  // --- 1. PARTES (ACTORES) - ESTRUCTURADOS ---
  // Exportador (Shipper)
  const [sRazonSocial, setSRazonSocial] = useState("");
  const [sNit, setSNit] = useState("");
  const [sContacto, setSContacto] = useState("");
  const [sCiudad, setSCiudad] = useState("");
  const [sPais, setSPais] = useState("");

  // Consignatario (Consignee)
  const [cRazonSocial, setCRazonSocial] = useState("");
  const [cNit, setCNit] = useState("");
  const [cContacto, setCContacto] = useState("");
  const [cCiudad, setCCiudad] = useState("");
  const [cPais, setCPais] = useState("");

  // Notificar a (Notify Party)
  const [nRazonSocial, setNRazonSocial] = useState("");
  const [nNit, setNNit] = useState("");
  const [nContacto, setNContacto] = useState("");
  const [nCiudad, setNCiudad] = useState("");
  const [nPais, setNPais] = useState("");

  // --- 2. RUTAS Y LOGÍSTICA ---
  const [placeOfReceipt, setPlaceOfReceipt] = useState("");
  const [portOfLoading, setPortOfLoading] = useState("");
  const [portOfDischarge, setPortOfDischarge] = useState("");
  const [placeOfDelivery, setPlaceOfDelivery] = useState("");
  const [vesselVoyage, setVesselVoyage] = useState("");
  const [transshipmentTo, setTransshipmentTo] = useState(""); 

  // --- 3. DATOS DEL DOCUMENTO Y FLETES ---
  const [blNumero, setBlNumero] = useState("");
  const [packingListNo, setPackingListNo] = useState("");
  const [freightPayableBy, setFreightPayableBy] = useState("");
  const [termsOfSale, setTermsOfSale] = useState("");
  const [placeDateIssue, setPlaceDateIssue] = useState("");
  const [numberOfOriginals, setNumberOfOriginals] = useState(""); 
  const [agentContact, setAgentContact] = useState("");
  const [totalContainersReceived, setTotalContainersReceived] = useState(""); 
  const [freightAmount, setFreightAmount] = useState("");
  const [freightType, setFreightType] = useState("Prepagado"); // Prepagado o Al Cobro

  // --- DATOS EMBARQUE ---
  const [shippedOnBoardDate, setShippedOnBoardDate] = useState("");

  // --- 4. DETALLES DE LA CARGA ---
  const [marksAndNumbers, setMarksAndNumbers] = useState("");
  const [noOfPkgs, setNoOfPkgs] = useState("");
  const [description, setDescription] = useState("");
  const [grossWeight, setGrossWeight] = useState("");
  const [measurement, setMeasurement] = useState("");

  // CARGAR LOS DATOS AL ABRIR LA PÁGINA
  useEffect(() => {
    // Aumentamos la versión para limpiar caché anterior y que la tabla de carga salga limpia
    const borradorGuardado = sessionStorage.getItem("borrador_documento_transporte_expo_v2");

    if (borradorGuardado) {
      const datos = JSON.parse(borradorGuardado);
      
      setLineaNavieraNombre(datos.lineaNavieraNombre || "");
      setLineaNavieraNit(datos.lineaNavieraNit || "");
      setLineaNavieraLogo(datos.lineaNavieraLogo || null);

      setSRazonSocial(datos.sRazonSocial || ""); setSNit(datos.sNit || ""); setSContacto(datos.sContacto || ""); setSCiudad(datos.sCiudad || ""); setSPais(datos.sPais || "");
      setCRazonSocial(datos.cRazonSocial || ""); setCNit(datos.cNit || ""); setCContacto(datos.cContacto || ""); setCCiudad(datos.cCiudad || ""); setCPais(datos.cPais || "");
      setNRazonSocial(datos.nRazonSocial || ""); setNNit(datos.nNit || ""); setNContacto(datos.nContacto || ""); setNCiudad(datos.nCiudad || ""); setNPais(datos.nPais || "");

      setPlaceOfReceipt(datos.placeOfReceipt || "");
      setPortOfLoading(datos.portOfLoading || "");
      setPortOfDischarge(datos.portOfDischarge || "");
      setPlaceOfDelivery(datos.placeOfDelivery || "");
      setVesselVoyage(datos.vesselVoyage || "");
      setTransshipmentTo(datos.transshipmentTo || "");

      setBlNumero(datos.blNumero || "");
      setPackingListNo(datos.packingListNo || "");
      setFreightPayableBy(datos.freightPayableBy || "");
      setTermsOfSale(datos.termsOfSale || "");
      setPlaceDateIssue(datos.placeDateIssue || "");
      setNumberOfOriginals(datos.numberOfOriginals || ""); 
      setAgentContact(datos.agentContact || "");
      setTotalContainersReceived(datos.totalContainersReceived || "");
      
      setFreightAmount(datos.freightAmount || "");
      setFreightType(datos.freightType || "Prepagado");
      
      setMarksAndNumbers(datos.marksAndNumbers || "");
      setNoOfPkgs(datos.noOfPkgs || "");
      setDescription(datos.description || "");
      setGrossWeight(datos.grossWeight || "");
      setMeasurement(datos.measurement || "");
      
      setShippedOnBoardDate(datos.shippedOnBoardDate || "");
    } else {
      const hoy = new Date();
      const opciones = { day: 'numeric', month: 'long', year: 'numeric' } as const;
      const fechaFormateada = hoy.toLocaleDateString('es-ES', opciones);
      
      setBlNumero(`BL-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`);
      setShippedOnBoardDate(fechaFormateada); 

      // Heredar solo datos esenciales, dejando la sección de Carga (5) 100% en blanco
      const datosGuardados = localStorage.getItem('datosReservaExpo');
      if (datosGuardados) {
        const parsed = JSON.parse(datosGuardados);
        setSRazonSocial(parsed.shipperNombre || "");
        setCRazonSocial(parsed.consignatarioNombre || "");
        // NOTA: Se eliminó la herencia de "description" y "marksAndNumbers" para que se llenen manualmente.
      }
    }
  }, []);

  // GUARDAR LOS DATOS CADA VEZ QUE ESCRIBES ALGO
  useEffect(() => {
    const borradorActual = {
      lineaNavieraNombre, lineaNavieraNit, lineaNavieraLogo,
      sRazonSocial, sNit, sContacto, sCiudad, sPais,
      cRazonSocial, cNit, cContacto, cCiudad, cPais,
      nRazonSocial, nNit, nContacto, nCiudad, nPais,
      placeOfReceipt, portOfLoading, portOfDischarge, placeOfDelivery, vesselVoyage, transshipmentTo,
      blNumero, packingListNo, freightPayableBy, termsOfSale, placeDateIssue, numberOfOriginals,
      agentContact, totalContainersReceived, freightAmount, freightType, marksAndNumbers,
      noOfPkgs, description, grossWeight, measurement, shippedOnBoardDate
    };
    sessionStorage.setItem("borrador_documento_transporte_expo_v2", JSON.stringify(borradorActual));
  });

  // Manejador de subida de logo cuadrado
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLineaNavieraLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatearShipper = () => {
    let texto = sRazonSocial;
    if (sNit) texto += `\nNIT: ${sNit}`;
    if (sCiudad || sPais) texto += `\n${sCiudad}${sCiudad && sPais ? ' - ' : ''}${sPais}`;
    if (sContacto) texto += `\nTel/Contacto: ${sContacto}`;
    return texto;
  };

  const formatearConsignee = () => {
    let texto = cRazonSocial;
    if (cNit) texto += `\nNIT/Tax ID: ${cNit}`;
    if (cCiudad || cPais) texto += `\n${cCiudad}${cCiudad && cPais ? ' - ' : ''}${cPais}`;
    if (cContacto) texto += `\nTel/Contacto: ${cContacto}`;
    return texto;
  };

  const formatearNotify = () => {
    if (nRazonSocial === "IGUAL AL CONSIGNATARIO") return "IGUAL AL CONSIGNATARIO";
    let texto = nRazonSocial;
    if (nNit) texto += `\nNIT/Tax ID: ${nNit}`;
    if (nCiudad || nPais) texto += `\n${nCiudad}${nCiudad && nPais ? ' - ' : ''}${nPais}`;
    if (nContacto) texto += `\nTel/Contacto: ${nContacto}`;
    return texto;
  };

  const generarPDF = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = new jsPDF();

    doc.setLineWidth(0.5);
    doc.setFont("helvetica", "bold");
    doc.rect(10, 10, 190, 277);

    // --- ENCABEZADO ---
    
    if (lineaNavieraLogo) {
        doc.addImage(lineaNavieraLogo, 'PNG', 14, 13, 14, 14); 
    } else {
        doc.setFillColor(0, 174, 239); // Cyan
        doc.rect(15, 15, 10, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text("*", 17, 23);
    }

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(lineaNavieraNombre.toUpperCase(), 30, 20); 
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(lineaNavieraNit.toUpperCase(), 30, 25); 

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("CONOCIMIENTO DE EMBARQUE\n(BILL OF LADING)\nPUERTO A PUERTO", 120, 18);
    
    doc.line(10, 30, 200, 30);

    // --- CUADRÍCULA PRINCIPAL ---
    doc.line(100, 30, 100, 140);
    
    // Izquierda
    doc.line(10, 60, 100, 60); 
    doc.line(10, 90, 100, 90); 
    doc.line(10, 115, 100, 115); 
    doc.line(10, 127.5, 100, 127.5); 
    doc.line(55, 115, 55, 140); 

    // Derecha
    doc.line(100, 40, 200, 40); 
    doc.line(100, 55, 200, 55); 
    doc.line(100, 65, 200, 65); 
    doc.line(100, 80, 200, 80); 
    doc.line(100, 105, 200, 105); 
    doc.line(100, 120, 200, 120); 
    doc.line(100, 130, 200, 130); 
    
    doc.line(160, 30, 160, 55); 
    doc.line(150, 120, 150, 140); 

    // --- TEXTOS: LADO IZQUIERDO ---
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("Exportador / Remitente (Nombre completo y dirección)", 12, 34);
    doc.setFont("helvetica", "bold");
    doc.text(doc.splitTextToSize(formatearShipper(), 85), 12, 39);

    doc.setFont("helvetica", "normal");
    doc.text("Consignatario / Destinatario (Nombre completo y dirección)", 12, 64);
    doc.setFont("helvetica", "bold");
    doc.text(doc.splitTextToSize(formatearConsignee(), 85), 12, 69);

    doc.setFont("helvetica", "normal");
    doc.text("Notificar a (Nombre completo y dirección)", 12, 94);
    doc.setFont("helvetica", "bold");
    doc.text(doc.splitTextToSize(formatearNotify(), 85), 12, 99);

    doc.setFont("helvetica", "normal");
    doc.text("Lugar de Recepción:", 12, 119); doc.setFont("helvetica", "bold"); doc.text(placeOfReceipt, 12, 124);
    doc.setFont("helvetica", "normal");
    doc.text("Puerto de Embarque:", 57, 119); doc.setFont("helvetica", "bold"); doc.text(portOfLoading, 57, 124);
    doc.setFont("helvetica", "normal");
    doc.text("Lugar de Entrega:", 12, 132); doc.setFont("helvetica", "bold"); doc.text(placeOfDelivery, 12, 137);
    doc.setFont("helvetica", "normal");
    doc.text("Puerto de Descarga:", 57, 132); doc.setFont("helvetica", "bold"); doc.text(portOfDischarge, 57, 137);

    // --- TEXTOS: LADO DERECHO ---
    doc.setFont("helvetica", "normal");
    doc.text("Lista de Empaque No.:", 102, 34); doc.setFont("helvetica", "bold"); doc.text(packingListNo, 102, 38);
    doc.setFont("helvetica", "normal");
    doc.text("B/L (Conocimiento de Emb.) No.:", 162, 34); doc.setFont("helvetica", "bold"); doc.text(blNumero, 162, 38);

    doc.setFont("helvetica", "normal");
    doc.text("Fletes y Cargos Pagaderos por:", 102, 44); doc.setFont("helvetica", "bold"); doc.text(freightPayableBy, 102, 49);
    doc.setFont("helvetica", "normal");
    doc.text("Términos de Venta (Incoterm):", 162, 44); doc.setFont("helvetica", "bold"); doc.text(termsOfSale, 162, 49);

    doc.setFont("helvetica", "normal");
    doc.text("Número de B/L Originales Emitidos:", 102, 59); doc.setFont("helvetica", "bold"); doc.text(numberOfOriginals, 155, 59);

    doc.setFont("helvetica", "normal");
    doc.text("Lugar y fecha de emisión:", 102, 69); doc.setFont("helvetica", "bold"); doc.text(placeDateIssue, 102, 74);

    doc.setFont("helvetica", "normal");
    doc.text("Para Liberación de Carga, Contactar a:", 102, 84);
    doc.setFont("helvetica", "bold");
    doc.text(doc.splitTextToSize(agentContact, 95), 102, 89);

    doc.setFont("helvetica", "normal");
    doc.text(`Total de Contenedores/Bultos Recibidos: ${totalContainersReceived}`, 102, 110);

    doc.setFont("helvetica", "normal");
    doc.text("Para Transbordo en:", 102, 124); doc.setFont("helvetica", "bold"); doc.text(transshipmentTo, 102, 128);
    doc.setFont("helvetica", "normal");
    doc.text("Buque / Viaje:", 152, 124); doc.setFont("helvetica", "bold"); doc.text(vesselVoyage, 152, 128);

    // --- TABLA DE CARGA ---
    doc.line(10, 140, 200, 140); 
    doc.line(10, 150, 200, 150); 

    doc.line(45, 140, 45, 230); 
    doc.line(65, 140, 65, 230); 
    doc.line(145, 140, 145, 230); 
    doc.line(175, 140, 175, 230); 

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("Marcas y\nNúmeros", 27, 144, { align: "center" });
    doc.text("No. de Bultos", 55, 146, { align: "center" });
    doc.text("Descripción de Bultos y\nMercancía", 105, 144, { align: "center" });
    doc.text("Peso Bruto", 160, 146, { align: "center" });
    doc.text("Volumen", 187, 146, { align: "center" });

    // Preparar el peso y medida con sus respectivos sufijos de manera automática
    const safeGrossWeight = grossWeight ? `${grossWeight.replace(/kg/i, '').trim()} Kg` : "";
    const safeMeasurement = measurement ? `${measurement.replace(/m3/i, '').trim()} M3` : "";

    doc.setFont("helvetica", "bold");
    doc.text(doc.splitTextToSize(marksAndNumbers, 33), 12, 155);
    doc.text(noOfPkgs, 55, 155, { align: "center" });
    doc.text(doc.splitTextToSize(description, 75), 68, 155);
    doc.text(safeGrossWeight, 160, 155, { align: "center" });
    doc.text(safeMeasurement, 187, 155, { align: "center" });

    // --- DISCLAIMER ---
    doc.line(10, 230, 200, 230); 
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    const disclaimer = "Los detalles anteriores son de acuerdo a la declaración del exportador. El transportista recibió los bienes antes mencionados en aparente buen estado y condición, a menos que se especifique lo contrario, para su transporte al lugar acordado anteriormente sujeto a los términos de este Conocimiento de Embarque, incluidos los del reverso. AL ACEPTAR ESTE DOCUMENTO, el Exportador, Consignatario, Tenedor del mismo y Propietario de los bienes, aceptan estar sujetos a todas sus estipulaciones, excepciones y condiciones.";
    doc.text(doc.splitTextToSize(disclaimer, 185), 12, 233);

    // --- PIE DE PÁGINA: FLETES Y FIRMAS ---
    doc.line(10, 245, 200, 245);
    
    doc.line(60, 245, 60, 265);
    doc.line(100, 245, 100, 265);
    doc.line(125, 245, 125, 265);
    doc.line(145, 245, 145, 287); 
    doc.line(10, 252, 145, 252);
    doc.line(10, 265, 145, 265);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Flete Marítimo", 35, 260, { align: "center" });
    doc.text("Prepagado", 112, 249, { align: "center" });
    doc.text("Al Cobro", 135, 249, { align: "center" });

    doc.setFont("helvetica", "bold");
    if(freightType === "Prepagado") {
      doc.text(freightAmount, 103, 260);
    } else {
      doc.text(freightAmount, 128, 260);
    }

    doc.setFont("helvetica", "normal");
    doc.text("En fe de lo cual", 12, 273);
    
    doc.rect(34, 269, 5, 5); 
    if (numberOfOriginals) {
        doc.text(numberOfOriginals.substring(0, 1), 36.5, 273, { align: "center" });
    }

    doc.setFontSize(6);
    doc.text("Se han firmado los B/L originales indicados,\nuno de los cuales siendo cumplido,\nlos demás perderán su valor legal.", 42, 271);

    // Fechas y Firmas
    doc.setFontSize(8);
    doc.text(`Embarcado a Bordo: ${shippedOnBoardDate}`, 148, 250);
    
    const lineasPuerto = doc.splitTextToSize(`Lugar: ${portOfLoading}`, 45);
    doc.text(lineasPuerto, 148, 254);
    
    doc.text("Firma: _______________________________", 148, 273);
    doc.text(`B/L No: ${blNumero}`, 148, 279);
    doc.setFontSize(6);
    doc.text("Los términos de desembarque continúan en el reverso", 148, 283);

    doc.text("El contrato evidenciado en este documento se rige por el derecho marítimo internacional.", 12, 280);

    doc.save(`Documento_Transporte_Exportacion_${blNumero}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-200 p-4 md:p-8 flex flex-col items-center">
      
      <div className="w-full max-w-6xl mb-4 flex justify-between items-center">
        <button 
          onClick={() => router.back()} 
          type="button"
          className="bg-white text-blue-800 border border-blue-800 px-4 py-2 rounded font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl border-t-8 border-blue-600 overflow-hidden">
        
        <div className="bg-blue-50 p-6 border-b border-blue-200 flex justify-between items-center">
          <div>
            <h2 className="font-black text-2xl text-blue-900 uppercase tracking-tight">Documento de Transporte (B/L) - Exportación</h2>
            <p className="text-sm text-blue-700 font-medium">Contrato de transporte y título de propiedad de la mercancía. Totalmente editable.</p>
          </div>
          <div className="bg-white p-2 border border-blue-200 font-mono text-sm font-bold text-blue-800 shadow-sm">
            {blNumero}
          </div>
        </div>

        <form onSubmit={generarPDF} className="p-8 space-y-6">
          
          {/* CONFIGURACIÓN NAVIERA */}
          <section className="bg-white p-5 rounded-lg border-2 border-dashed border-sky-300 shadow-sm space-y-4">
            <h3 className="font-bold text-sky-800 text-sm uppercase">⚙️ Configuración del Encabezado (Naviera)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Nombre de la Naviera:</label>
                    <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500 font-bold text-sky-900" placeholder="Ej. LÍNEA OCEÁNICA" value={lineaNavieraNombre} onChange={(e)=>setLineaNavieraNombre(e.target.value)} required />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">NIT / RFC de la Naviera:</label>
                    <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500" placeholder="Ej. NIT 900.123.456-7" value={lineaNavieraNit} onChange={(e)=>setLineaNavieraNit(e.target.value)} required />
                </div>
            </div>

            <div className="bg-sky-50 p-4 rounded-md border border-sky-100 mt-2 flex items-center gap-4">
                {lineaNavieraLogo ? (
                    <img src={lineaNavieraLogo} alt="Logo Naviera" className="w-16 h-16 rounded border border-gray-300 object-cover" />
                ) : (
                    <div className="w-16 h-16 rounded border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-gray-400">Sin Logo</div>
                )}
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Subir Logo Cuadrado (45x45px recomendado):</label>
                    <input type="file" ref={fileInputRef} accept="image/*" onChange={handleLogoUpload} className="text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200 cursor-pointer" />
                    {lineaNavieraLogo && (
                        <button type="button" onClick={() => setLineaNavieraLogo(null)} className="text-[10px] text-red-600 hover:underline mt-1 block">Remover Logo</button>
                    )}
                </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LADO IZQUIERDO: PARTES Y RUTAS */}
            <div className="space-y-6">
              
              <section className="bg-white p-4 rounded border border-gray-300 shadow-sm space-y-4">
                <h3 className="font-bold text-blue-800 border-b pb-1 text-xs uppercase">1. Partes del Contrato</h3>
                
                {/* SHIPPER */}
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <h4 className="text-[10px] font-bold text-gray-700 mb-2 uppercase">Exportador / Remitente (Shipper)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2"><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500 font-bold" placeholder="Razón Social" value={sRazonSocial} onChange={(e)=>setSRazonSocial(e.target.value)} required /></div>
                    <div><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500" placeholder="NIT / Tax ID" value={sNit} onChange={(e)=>setSNit(e.target.value)} /></div>
                    <div><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500" placeholder="Teléfono / Contacto" value={sContacto} onChange={(e)=>setSContacto(e.target.value)} /></div>
                    <div><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ciudad" value={sCiudad} onChange={(e)=>setSCiudad(e.target.value)} /></div>
                    <div><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500 uppercase" placeholder="País" value={sPais} onChange={(e)=>setSPais(e.target.value)} required /></div>
                  </div>
                </div>

                {/* CONSIGNEE */}
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <h4 className="text-[10px] font-bold text-gray-700 mb-2 uppercase">Consignatario / Destinatario (Consignee)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2"><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500 font-bold" placeholder="Razón Social" value={cRazonSocial} onChange={(e)=>setCRazonSocial(e.target.value)} required /></div>
                    <div><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500" placeholder="NIT / Tax ID" value={cNit} onChange={(e)=>setCNit(e.target.value)} /></div>
                    <div><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500" placeholder="Teléfono / Contacto" value={cContacto} onChange={(e)=>setCContacto(e.target.value)} /></div>
                    <div><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ciudad" value={cCiudad} onChange={(e)=>setCCiudad(e.target.value)} /></div>
                    <div><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500 uppercase" placeholder="País" value={cPais} onChange={(e)=>setCPais(e.target.value)} required /></div>
                  </div>
                </div>

                {/* NOTIFY PARTY */}
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <h4 className="text-[10px] font-bold text-gray-700 mb-2 uppercase flex justify-between items-center">
                    Notificar a (Notify Party)
                    <button type="button" onClick={() => {setNRazonSocial("IGUAL AL CONSIGNATARIO"); setNNit(""); setNContacto(""); setNCiudad(""); setNPais("");}} className="text-[9px] text-blue-600 hover:underline">Igual al Consignatario</button>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2"><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500" placeholder="Razón Social (O 'IGUAL AL CONSIGNATARIO')" value={nRazonSocial} onChange={(e)=>setNRazonSocial(e.target.value)} required /></div>
                    {nRazonSocial !== "IGUAL AL CONSIGNATARIO" && (
                      <>
                        <div><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500" placeholder="NIT / Tax ID" value={nNit} onChange={(e)=>setNNit(e.target.value)} /></div>
                        <div><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500" placeholder="Teléfono / Contacto" value={nContacto} onChange={(e)=>setNContacto(e.target.value)} /></div>
                        <div><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ciudad" value={nCiudad} onChange={(e)=>setNCiudad(e.target.value)} /></div>
                        <div><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500 uppercase" placeholder="País" value={nPais} onChange={(e)=>setNPais(e.target.value)} /></div>
                      </>
                    )}
                  </div>
                </div>
              </section>

              <section className="bg-blue-50/30 p-4 rounded border border-blue-100 space-y-3">
                <h3 className="font-bold text-blue-800 border-b pb-1 text-xs uppercase">2. Rutas y Transporte</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-[10px] font-bold text-gray-500">LUGAR DE RECEPCIÓN:</label><input type="text" className="w-full border p-2 text-xs rounded outline-none" value={placeOfReceipt} onChange={(e)=>setPlaceOfReceipt(e.target.value)} /></div>
                  <div><label className="block text-[10px] font-bold text-gray-500">PUERTO DE EMBARQUE (Origen):</label><input type="text" className="w-full border p-2 text-xs rounded outline-none" value={portOfLoading} onChange={(e)=>setPortOfLoading(e.target.value)} /></div>
                  <div><label className="block text-[10px] font-bold text-gray-500">LUGAR DE ENTREGA:</label><input type="text" className="w-full border p-2 text-xs rounded outline-none" value={placeOfDelivery} onChange={(e)=>setPlaceOfDelivery(e.target.value)} /></div>
                  <div><label className="block text-[10px] font-bold text-gray-500">PUERTO DE DESCARGA (Destino):</label><input type="text" className="w-full border p-2 text-xs rounded outline-none" value={portOfDischarge} onChange={(e)=>setPortOfDischarge(e.target.value)} /></div>
                  <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500">BUQUE / VIAJE (Vessel/Voyage):</label><input type="text" className="w-full border p-2 text-xs rounded outline-none font-bold text-blue-700 uppercase" placeholder="Ej. MSC GALAXY / 029W" value={vesselVoyage} onChange={(e)=>setVesselVoyage(e.target.value)} required /></div>
                  <div><label className="block text-[10px] font-bold text-gray-500">PARA TRANSBORDO EN:</label><input type="text" className="w-full border p-2 text-xs rounded outline-none" value={transshipmentTo} onChange={(e)=>setTransshipmentTo(e.target.value)} required /></div>
                </div>
              </section>
            </div>

            {/* LADO DERECHO: DOCUMENTO, FLETES Y AGENTE */}
            <div className="space-y-6">
              <section className="bg-white p-4 rounded border border-gray-300 shadow-sm space-y-3">
                <h3 className="font-bold text-blue-800 border-b pb-1 text-xs uppercase">3. Detalles Administrativos</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-[10px] font-bold text-gray-500">LISTA DE EMPAQUE NO.:</label><input type="text" className="w-full border p-2 text-xs rounded outline-none" value={packingListNo} onChange={(e)=>setPackingListNo(e.target.value)} /></div>
                  <div><label className="block text-[10px] font-bold text-gray-500">INCOTERM (Terms of Sale):</label><input type="text" className="w-full border p-2 text-xs rounded outline-none" placeholder="Ej. FOB" value={termsOfSale} onChange={(e)=>setTermsOfSale(e.target.value)} required /></div>
                  
                  <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500">FLETES PAGADEROS POR:</label><input type="text" className="w-full border p-2 text-xs rounded outline-none" value={freightPayableBy} onChange={(e)=>setFreightPayableBy(e.target.value)} required /></div>
                  
                  <div><label className="block text-[10px] font-bold text-gray-500">LUGAR Y FECHA DE EMISIÓN:</label><input type="text" className="w-full border p-2 text-xs rounded outline-none" value={placeDateIssue} onChange={(e)=>setPlaceDateIssue(e.target.value)} required /></div>
                  
                  <div><label className="block text-[10px] font-bold text-gray-500 mb-1">NÚMERO DE B/L ORIGINALES:</label><input type="text" className="w-full border p-2 text-xs rounded outline-none" placeholder="Ej. 3 o Tres (3)" value={numberOfOriginals} onChange={(e)=>setNumberOfOriginals(e.target.value)} /></div>

                  <div><label className="block text-[10px] font-bold text-gray-500 mb-1">FECHA EMBARQUE A BORDO:</label><input type="text" className="w-full border p-2 text-xs rounded outline-none font-bold text-blue-800 focus:ring-1 focus:ring-blue-500 bg-blue-50" placeholder="Ej. 5 de marzo de 2026" value={shippedOnBoardDate} onChange={(e)=>setShippedOnBoardDate(e.target.value)} required /></div>
                  
                  <div><label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">CONTENEDORES RECIBIDOS:</label><input type="text" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ej. 1/0" value={totalContainersReceived} onChange={(e)=>setTotalContainersReceived(e.target.value)} /></div>

                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500">PARA LIBERAR CARGA, CONTACTAR A (Agente):</label>
                    <textarea className="w-full border p-2 text-xs rounded outline-none h-16 resize-none" value={agentContact} onChange={(e)=>setAgentContact(e.target.value)} required />
                  </div>

                </div>
              </section>

              <section className="bg-blue-50/30 p-4 rounded border border-blue-100 space-y-3">
                <h3 className="font-bold text-blue-800 border-b pb-1 text-xs uppercase">4. Fletes (Ocean Freight)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-[10px] font-bold text-gray-500">VALOR DEL FLETE:</label><input type="text" className="w-full border p-2 text-xs rounded outline-none font-mono font-bold" value={freightAmount} onChange={(e)=>setFreightAmount(e.target.value)} required /></div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500">TIPO DE PAGO:</label>
                    <select className="w-full border p-2 text-xs rounded outline-none bg-white font-bold" value={freightType} onChange={(e)=>setFreightType(e.target.value)}>
                      <option value="Prepagado">PREPAGADO (Origen)</option>
                      <option value="Al Cobro">AL COBRO (Destino)</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* SECCIÓN INFERIOR: LA CARGA (TABLA) */}
          <section className="bg-white p-4 rounded border border-gray-300 shadow-sm mt-6">
            <h3 className="font-bold text-blue-800 border-b pb-2 mb-3 text-xs uppercase">5. Descripción de la Carga (Cuerpo del B/L)</h3>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-2"><label className="block text-[9px] font-bold text-gray-500 text-center">MARCAS Y NÚMEROS</label><textarea className="w-full border p-2 text-[10px] rounded h-24 resize-none" value={marksAndNumbers} onChange={(e)=>setMarksAndNumbers(e.target.value)} required /></div>
              <div className="col-span-2"><label className="block text-[9px] font-bold text-gray-500 text-center">NO. DE BULTOS</label><textarea className="w-full border p-2 text-[10px] rounded h-24 resize-none text-center" value={noOfPkgs} onChange={(e)=>setNoOfPkgs(e.target.value)} required /></div>
              <div className="col-span-4"><label className="block text-[9px] font-bold text-gray-500 text-center">DESCRIPCIÓN DE MERCANCÍA</label><textarea className="w-full border p-2 text-[10px] rounded h-24 resize-none font-bold text-gray-700" value={description} onChange={(e)=>setDescription(e.target.value)} required /></div>
              
              <div className="col-span-2"><label className="block text-[9px] font-bold text-gray-500 text-center">PESO BRUTO (Kg)</label><textarea className="w-full border p-2 text-[10px] rounded h-24 resize-none text-center" placeholder="Ej. 886.6" value={grossWeight} onChange={(e)=>setGrossWeight(e.target.value)} required /></div>
              <div className="col-span-2"><label className="block text-[9px] font-bold text-gray-500 text-center">VOLUMEN (M3)</label><textarea className="w-full border p-2 text-[10px] rounded h-24 resize-none text-center" placeholder="Ej. 15.5" value={measurement} onChange={(e)=>setMeasurement(e.target.value)} required /></div>
            </div>
          </section>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button type="submit" className="flex-1 bg-blue-700 text-white font-bold py-4 rounded shadow-lg hover:bg-blue-800 transition-all text-lg border-b-4 border-blue-900">
              📥 Descargar B/L en Español Profesional (PDF)
            </button>
            <Link href="/declaracion-cambio-exportacion" className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded shadow-lg hover:bg-indigo-700 text-center text-lg border-b-4 border-indigo-800 flex items-center justify-center">
              Paso Final: Declaración de Cambio →
            </Link>
          </div>

        </form>
      </div>
    </main>
  );
}