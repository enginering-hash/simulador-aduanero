"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CertificadoInvima() {
  const router = useRouter();

  // --- 1. INFORMACIÓN GENERAL ---
  const [ciudadDepto, setCiudadDepto] = useState("");
  const [puertoPaso, setPuertoPaso] = useState("");
  const [radicado, setRadicado] = useState("");
  const [fechaRadicado, setFechaRadicado] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [transportadora, setTransportadora] = useState("");
  const [actaInspeccion, setActaInspeccion] = useState("");
  const [fechaActa, setFechaActa] = useState("");

  const [tipoImportacion, setTipoImportacion] = useState("Inicial");
  const [bodega, setBodega] = useState("");
  const [docTransporte, setDocTransporte] = useState("");
  const [certificadoSanitario, setCertificadoSanitario] = useState("");

  // --- 2. DESTINO DE LOS PRODUCTOS ---
  const [identificacion, setIdentificacion] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [direccion, setDireccion] = useState("");
  const [municipio, setMunicipio] = useState("");

  // --- 3. IDENTIFICACIÓN DE LOS PRODUCTOS (TABLA) ---
  // AHORA LIMPIOS POR DEFECTO
  const [items, setItems] = useState([
    { producto: "", fabricante: "", pais: "", pesoBruto: "", pesoNeto: "", cajas: "", lote: "", temp: "", vencim: "", inspeccion: "APROBADO" }
  ]);

  // --- 4. FIRMA Y OBSERVACIONES ---
  const [inspector, setInspector] = useState("ALBA LILIANA BOCANEGRA HERNANDEZ");
  const [observaciones, setObservaciones] = useState(
    "Los productos alimenticios y las materias primas de importación deben cumplir con los requisitos establecidos en la normativa sanitaria vigente en Colombia.\n\nEn caso de presentarse deficiencias en el rotulado, el importador deberá ajustarse a lo dispuesto en la Resolución 5109 de 2005 o en la normativa que la sustituya o complemente."
  );

  // CARGAR LOS DATOS AL ABRIR LA PÁGINA
  useEffect(() => {
    // Cambio de versión a v5 para borrar cachés anteriores
    const borradorGuardado = sessionStorage.getItem("borrador_certificado_invima_v5");
    const hoy = new Date().toISOString().split('T')[0];

    if (borradorGuardado) {
      const datos = JSON.parse(borradorGuardado);
      setCiudadDepto(datos.ciudadDepto || "");
      setPuertoPaso(datos.puertoPaso || "");
      setRadicado(datos.radicado || "");
      setFechaRadicado(datos.fechaRadicado || "");
      setSolicitante(datos.solicitante || "");
      setTransportadora(datos.transportadora || "");
      setActaInspeccion(datos.actaInspeccion || "");
      setFechaActa(datos.fechaActa || "");
      
      setTipoImportacion(datos.tipoImportacion || "Inicial");
      setBodega(datos.bodega || "");
      setDocTransporte(datos.docTransporte || "");
      setCertificadoSanitario(datos.certificadoSanitario || "");

      setIdentificacion(datos.identificacion || "");
      setDestinatario(datos.destinatario || "");
      setDireccion(datos.direccion || "");
      setMunicipio(datos.municipio || "");

      if (datos.items && datos.items.length > 0) setItems(datos.items);
      setInspector(datos.inspector || "ALBA LILIANA BOCANEGRA HERNANDEZ");
      setObservaciones(datos.observaciones || observaciones);
    } else {
      setRadicado(`203${Math.floor(100000 + Math.random() * 900000)}`);
      setFechaRadicado(hoy);
      setFechaActa(hoy);
      setActaInspeccion(`BU-${hoy.replace(/-/g, '')}04`);
      setCertificadoSanitario(`GD${Math.floor(100000 + Math.random() * 900000)}/DS`);

      const datosGuardados = localStorage.getItem('datosReserva');
      if (datosGuardados) {
        const parsed = JSON.parse(datosGuardados);
        setSolicitante(parsed.shipperNombre || "");
        setDestinatario(parsed.consignatarioNombre || "");
        
        // Todo en blanco para que el estudiante lo llene
        setItems([{ 
          producto: parsed.mercancia || "", 
          fabricante: parsed.shipperNombre || "", 
          pais: "", 
          pesoBruto: "",
          pesoNeto: "", 
          cajas: "",    
          lote: "", 
          temp: "", 
          vencim: "", 
          inspeccion: "APROBADO" 
        }]);
      }
    }
  }, []);

  useEffect(() => {
    const borradorActual = {
      ciudadDepto, puertoPaso, radicado, fechaRadicado, solicitante, transportadora, actaInspeccion, fechaActa,
      tipoImportacion, bodega, docTransporte, certificadoSanitario,
      identificacion, destinatario, direccion, municipio, items, inspector, observaciones
    };
    sessionStorage.setItem("borrador_certificado_invima_v5", JSON.stringify(borradorActual));
  });

  const agregarItem = () => {
    setItems([...items, { producto: "", fabricante: "", pais: "", pesoBruto: "", pesoNeto: "", cajas: "", lote: "", temp: "", vencim: "", inspeccion: "APROBADO" }]);
  };

  const actualizarItem = (index: number, campo: string, valor: string) => {
    const nuevosItems = [...items];
    nuevosItems[index] = { ...nuevosItems[index], [campo]: valor };
    setItems(nuevosItems);
  };

  const eliminarProducto = (indexToRemove: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  const generarPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    const doc = new jsPDF("landscape");

    // --- ENCABEZADO INSTITUCIONAL ---
    try {
        const imgPath = "/invima_logo.png";
        const response = await fetch(imgPath);
        if(response.ok){
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64data = reader.result as string;
                doc.addImage(base64data, 'PNG', 14, 10, 45, 15);
                generarContenidoPDF(doc);
            }
            reader.readAsDataURL(blob);
            return; 
        }
    } catch (err) {
        console.warn("No se encontró invima_logo.png en public, usando texto alternativo.");
    }
    
    // Si no hay logo (Fallback text)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(33, 107, 165); // Azul INVIMA
    doc.text("invima", 14, 22);
    
    generarContenidoPDF(doc);
  };

  const generarContenidoPDF = (doc: jsPDF) => {
    // Textos Institucionales Derecha
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text("REPÚBLICA DE COLOMBIA", 280, 12, { align: "right" });
    doc.setFontSize(7);
    doc.text("INSTITUTO NACIONAL DE VIGILANCIA DE MEDICAMENTOS Y ALIMENTOS - INVIMA", 280, 16, { align: "right" });
    doc.text("MINISTERIO DE SALUD Y PROTECCIÓN SOCIAL", 280, 20, { align: "right" });

    doc.setDrawColor(200, 200, 200);
    doc.line(10, 25, 287, 25);

    // --- 1. INFORMACIÓN GENERAL ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("1. Información General", 15, 32);
    
    doc.setFontSize(9);
    doc.text("Ciudad:", 15, 40); doc.setFont("helvetica", "normal"); doc.text(ciudadDepto, 32, 40);
    doc.setFont("helvetica", "bold");
    doc.text("Tipo Importación:", 150, 40); doc.setFont("helvetica", "normal"); doc.text(tipoImportacion, 182, 40);
    
    doc.setFont("helvetica", "bold");
    doc.text("Puerto, aeropuerto o paso de frontera:", 15, 46); doc.setFont("helvetica", "normal"); doc.text(puertoPaso, 78, 46);
    doc.setFont("helvetica", "bold");
    doc.text("Bodega (sitio inspección):", 150, 46); doc.setFont("helvetica", "normal"); doc.text(bodega, 194, 46);

    doc.setFont("helvetica", "bold");
    doc.text("Radicado:", 15, 52); doc.setFont("helvetica", "normal"); doc.text(radicado, 35, 52);
    doc.setFont("helvetica", "bold");
    doc.text("Fecha:", 90, 52); doc.setFont("helvetica", "normal"); doc.text(fechaRadicado, 105, 52);

    doc.setFont("helvetica", "bold");
    doc.text("Solicitante:", 15, 58); doc.setFont("helvetica", "normal"); doc.text(solicitante, 35, 58);
    
    doc.setFont("helvetica", "bold");
    doc.text("Transportadora:", 15, 64); doc.setFont("helvetica", "normal"); doc.text(transportadora, 43, 64);
    doc.setFont("helvetica", "bold");
    doc.text("Doc. Transporte:", 150, 64); doc.setFont("helvetica", "normal"); doc.text(docTransporte, 180, 64);

    doc.setFont("helvetica", "bold");
    doc.text("Acta de inspección No:", 15, 70); doc.setFont("helvetica", "normal"); doc.text(actaInspeccion, 55, 70);
    doc.setFont("helvetica", "bold");
    doc.text("Fecha:", 90, 70); doc.setFont("helvetica", "normal"); doc.text(fechaActa, 105, 70);
    doc.setFont("helvetica", "bold");
    doc.text("Certificado sanitario:", 150, 70); doc.setFont("helvetica", "normal"); doc.text(certificadoSanitario, 185, 70);

    // --- 2. DESTINO DE LOS PRODUCTOS ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("2. Destino de los productos", 15, 82);

    doc.setFontSize(9);
    doc.text("Identificación (NIT):", 30, 90); doc.setFont("helvetica", "normal"); doc.text(identificacion, 65, 90);
    doc.setFont("helvetica", "bold");
    doc.text("Municipio:", 150, 90); doc.setFont("helvetica", "normal"); doc.text(municipio, 170, 90);

    doc.setFont("helvetica", "bold");
    doc.text("Destinatario:", 30, 96); doc.setFont("helvetica", "normal"); doc.text(destinatario, 52, 96);
    
    doc.setFont("helvetica", "bold");
    doc.text("Dirección:", 30, 102); doc.setFont("helvetica", "normal"); doc.text(direccion, 50, 102);

    // --- 3. IDENTIFICACIÓN DE LOS PRODUCTOS ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("3. Identificación de los productos", 15, 114);

    const filas = items.map(item => [
      item.producto,
      item.fabricante,
      item.pais,
      item.pesoBruto,
      item.pesoNeto,
      item.cajas,
      item.lote,
      item.temp,
      item.vencim,
      item.inspeccion
    ]);

    autoTable(doc, {
      startY: 120,
      head: [["Producto", "Fabricante", "País", "P. Bruto (kg)", "P. Neto (kg)", "N° Cajas", "Lote", "Temp °C", "Vencimiento", "Inspección"]],
      body: filas,
      theme: 'grid',
      headStyles: { fillColor: [255, 255, 255], textColor: 0, fontStyle: 'bold', halign: 'center', lineColor: 0, lineWidth: 0.5 },
      styles: { fontSize: 7, cellPadding: 2, textColor: 0, lineColor: 0, lineWidth: 0.5, valign: 'middle', halign: 'center' },
    });

    // --- 4. FIRMA Y OBSERVACIONES ---
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Observaciones:", 15, finalY);
    doc.setFont("helvetica", "normal");
    const lineasObs = doc.splitTextToSize(observaciones, 220);
    doc.text(lineasObs, 50, finalY);

    const alturaObservaciones = lineasObs.length * 5;
    const firmaY = finalY + alturaObservaciones + 15;
    
    // Sello circular simulado
    doc.setDrawColor(0, 0, 150); // Azul tinta de sello
    doc.setLineWidth(1);
    doc.circle(220, firmaY + 5, 20); 
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 150);
    doc.text("INVIMA", 220, firmaY + 2, { align: "center" });
    doc.text("MINSALUD", 220, firmaY + 7, { align: "center" });
    doc.text("CONFORME", 220, firmaY + 12, { align: "center" });

    // Línea de firma
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(60, firmaY + 15, 160, firmaY + 15);
    
    // Textos de firma
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(inspector.toUpperCase() || "NOMBRE DEL INSPECTOR", 110, firmaY + 20, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text("INSPECTOR INVIMA", 110, firmaY + 25, { align: "center" });

    // --- FOOTER INSTITUCIONAL ---
    const footerY = 190; 
    doc.setDrawColor(33, 107, 165); 
    doc.setLineWidth(1.5);
    doc.line(10, footerY, 10, footerY + 15); 

    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("Instituto Nacional de Vigilancia de Medicamentos y Alimentos - Invima", 14, footerY + 2);
    doc.setFont("helvetica", "bold");
    doc.text("Oficina Principal:", 14, footerY + 6); doc.setFont("helvetica", "normal"); doc.text("Cra 10 N° 64 - 28 - Bogotá", 37, footerY + 6);
    doc.setFont("helvetica", "bold");
    doc.text("Administrativo:", 14, footerY + 10); doc.setFont("helvetica", "normal"); doc.text("Cra 10 N° 64 - 60", 34, footerY + 10);
    doc.text("(1) 2948700", 14, footerY + 14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 107, 165);
    doc.text("www.invima.gov.co", 14, footerY + 18);

    doc.save(`Acta_INVIMA_${radicado}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      
      <div className="w-full max-w-6xl mb-4 flex justify-between items-center">
        <button onClick={() => router.back()} type="button" className="bg-white text-sky-800 border border-sky-800 px-4 py-2 rounded font-bold hover:bg-sky-50 transition-colors flex items-center gap-2 shadow-sm">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl border-t-8 border-sky-600 overflow-hidden">
        
        <div className="bg-sky-50 p-6 border-b border-sky-200">
            <h2 className="font-black text-2xl text-sky-900 uppercase tracking-tight">Certificado de Inspección (INVIMA)</h2>
            <p className="text-sm text-sky-700 font-medium">Acta de inspección sanitaria para nacionalización de productos.</p>
        </div>

        <form onSubmit={generarPDF} className="p-8 space-y-6">
          
          {/* SECCIÓN 1: INFO GENERAL */}
          <section className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
            <h3 className="font-bold text-sky-800 mb-4 border-b pb-2 text-sm">1. Información General</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Ciudad - Departamento:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500" placeholder="Ej. BUENAVENTURA - VALLE DEL CAUCA" value={ciudadDepto} onChange={(e)=>setCiudadDepto(e.target.value)} required /></div>
              <div><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Tipo Importación:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500" placeholder="Ej. Inicial" value={tipoImportacion} onChange={(e)=>setTipoImportacion(e.target.value)} required /></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Puerto, aeropuerto o paso de frontera:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500" placeholder="Ej. TERMINAL MARÍTIMO DE BUENAVENTURA" value={puertoPaso} onChange={(e)=>setPuertoPaso(e.target.value)} required /></div>
              <div><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Bodega (sitio inspección):</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500" placeholder="Ej. Sociedad Portuaria Regional" value={bodega} onChange={(e)=>setBodega(e.target.value)} required /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Radicado:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500 font-bold" value={radicado} onChange={(e)=>setRadicado(e.target.value)} required /></div>
              <div><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Fecha Radicado:</label><input type="date" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500 bg-white" value={fechaRadicado} onChange={(e)=>setFechaRadicado(e.target.value)} required /></div>
              <div className="md:col-span-2"><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Solicitante:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500" placeholder="Ej. Agencia de Aduanas Nivel 2" value={solicitante} onChange={(e)=>setSolicitante(e.target.value)} required /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Transportadora:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500 uppercase" value={transportadora} onChange={(e)=>setTransportadora(e.target.value)} required /></div>
              <div><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Doc. Transporte:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500" value={docTransporte} onChange={(e)=>setDocTransporte(e.target.value)} required /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Acta de inspección No:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500" value={actaInspeccion} onChange={(e)=>setActaInspeccion(e.target.value)} required /></div>
              <div><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Fecha Acta:</label><input type="date" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500 bg-white" value={fechaActa} onChange={(e)=>setFechaActa(e.target.value)} required /></div>
              <div className="md:col-span-2"><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Certificado sanitario (Emisor):</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500" value={certificadoSanitario} onChange={(e)=>setCertificadoSanitario(e.target.value)} required /></div>
            </div>
          </section>

          {/* SECCIÓN 2: DESTINO */}
          <section className="bg-sky-50/50 p-5 rounded-lg border border-sky-100">
            <h3 className="font-bold text-sky-800 mb-4 border-b pb-2 text-sm">2. Destino de los productos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Identificación (NIT):</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500" value={identificacion} onChange={(e)=>setIdentificacion(e.target.value)} required /></div>
              <div><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Municipio:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500" placeholder="Ej. CALI - VALLE DEL CAUCA" value={municipio} onChange={(e)=>setMunicipio(e.target.value)} required /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Destinatario:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500" value={destinatario} onChange={(e)=>setDestinatario(e.target.value)} required /></div>
              <div><label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Dirección:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-sky-500 uppercase" value={direccion} onChange={(e)=>setDireccion(e.target.value)} required /></div>
            </div>
          </section>

          {/* SECCIÓN 3: PRODUCTOS */}
          <section className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sky-800 text-sm border-b pb-2 flex-1">3. Identificación de los productos</h3>
              <button type="button" onClick={agregarItem} className="bg-sky-100 text-sky-800 font-bold py-1 px-3 rounded hover:bg-sky-200 text-xs ml-4">+ Producto</button>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="hidden md:grid grid-cols-12 gap-2 bg-gray-100 border border-gray-300 text-gray-800 p-2 rounded-md text-[9px] font-bold text-center items-center w-full shadow-sm">
                <div className="col-span-2 uppercase">Producto</div>
                <div className="col-span-2 uppercase">Fabricante</div>
                <div className="col-span-1 uppercase">País</div>
                <div className="col-span-1 uppercase">P. Bruto(kg)</div>
                <div className="col-span-1 uppercase">P. Neto(kg)</div>
                <div className="col-span-1 uppercase">N° Cajas</div>
                <div className="col-span-1 uppercase">Lote</div>
                <div className="col-span-1 uppercase">Temp °C</div>
                <div className="col-span-1 uppercase">Vencimiento</div>
                <div className="col-span-1 uppercase">Inspección</div>
              </div>
              <div className="w-6 shrink-0 hidden md:block"></div> 
            </div>

            {items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-2">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 border border-gray-300 bg-white p-4 md:p-2 rounded-md shadow-sm w-full">
                  <div className="md:col-span-2"><label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Producto:</label><textarea className="w-full border rounded p-1 text-[10px] outline-none resize-none h-10 font-bold" value={item.producto} onChange={(e) => actualizarItem(index, 'producto', e.target.value)} required /></div>
                  <div className="md:col-span-2"><label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Fabricante:</label><textarea className="w-full border rounded p-1 text-[10px] outline-none resize-none h-10 uppercase" value={item.fabricante} onChange={(e) => actualizarItem(index, 'fabricante', e.target.value)} required /></div>
                  <div className="md:col-span-1"><label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">País:</label><input type="text" className="w-full border rounded p-1 text-[10px] text-center outline-none uppercase" value={item.pais} onChange={(e) => actualizarItem(index, 'pais', e.target.value)} required /></div>
                  
                  <div className="md:col-span-1"><label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">P. Bruto:</label><input type="number" className="w-full border rounded p-1 text-[10px] text-center outline-none" value={item.pesoBruto} onChange={(e) => actualizarItem(index, 'pesoBruto', e.target.value)} required /></div>
                  <div className="md:col-span-1"><label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">P. Neto:</label><input type="number" className="w-full border rounded p-1 text-[10px] text-center outline-none" value={item.pesoNeto} onChange={(e) => actualizarItem(index, 'pesoNeto', e.target.value)} required /></div>
                  <div className="md:col-span-1"><label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Cajas:</label><input type="number" className="w-full border rounded p-1 text-[10px] text-center outline-none" value={item.cajas} onChange={(e) => actualizarItem(index, 'cajas', e.target.value)} required /></div>
                  
                  <div className="md:col-span-1"><label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Lote:</label><textarea className="w-full border rounded p-1 text-[10px] text-center outline-none resize-none h-10 font-mono" value={item.lote} onChange={(e) => actualizarItem(index, 'lote', e.target.value)} required /></div>
                  <div className="md:col-span-1"><label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Temp °C:</label><input type="text" className="w-full border rounded p-1 text-[10px] text-center outline-none" value={item.temp} onChange={(e) => actualizarItem(index, 'temp', e.target.value)} required /></div>
                  <div className="md:col-span-1"><label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Vencim.:</label><input type="text" className="w-full border rounded p-1 text-[10px] text-center outline-none" value={item.vencim} onChange={(e) => actualizarItem(index, 'vencim', e.target.value)} required /></div>
                  <div className="md:col-span-1"><label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Inspección:</label><input type="text" className="w-full border rounded p-1 text-[9px] text-center outline-none font-bold text-green-700 uppercase" value={item.inspeccion} onChange={(e) => actualizarItem(index, 'inspeccion', e.target.value)} required /></div>
                </div>
                
                {/* Botón flotante para eliminar */}
                <div className="w-full md:w-6 shrink-0 flex justify-end md:justify-center mt-2 md:mt-0">
                  {items.length > 1 ? (
                    <button type="button" onClick={() => eliminarProducto(index)} className="bg-red-50 text-red-600 font-bold w-6 h-6 rounded-full hover:bg-red-100 border border-red-200 flex items-center justify-center text-xs">X</button>
                  ) : (
                    <div className="w-6 h-6 hidden md:block"></div>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* SECCIÓN 4: OBSERVACIONES Y FIRMA (FORMULARIO) */}
          <section className="bg-sky-50/50 p-5 rounded-lg border border-sky-100">
            <h3 className="font-bold text-sky-800 mb-4 border-b pb-2 text-sm">4. Observaciones y Firma (Editable)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Observaciones Legales (Editables):</label>
                    <textarea className="w-full border border-gray-300 p-3 text-xs rounded-md bg-white outline-none resize-none h-32 focus:ring-1 focus:ring-sky-500 text-gray-600" value={observaciones} onChange={(e)=>setObservaciones(e.target.value)} required />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase">Nombre del Inspector (Quien firma):</label>
                    <input type="text" className="w-full border p-2 rounded outline-none focus:ring-1 focus:ring-sky-500 font-bold uppercase" placeholder="Ej. ALBA LILIANA BOCANEGRA HERNANDEZ" value={inspector} onChange={(e)=>setInspector(e.target.value)} required />
                    <p className="text-xs text-gray-500 mt-2">Este nombre aparecerá centrado bajo la línea de firma en el PDF profesional.</p>
                </div>
            </div>
          </section>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button type="submit" className="flex-1 bg-sky-700 text-white font-bold py-4 rounded shadow-lg hover:bg-sky-800 transition-all text-lg border-b-4 border-sky-900">
              📥 Descargar Acta INVIMA Profesional (PDF)
            </button>
            <Link href="/documento-transporte" className="flex-1 bg-blue-700 text-white font-bold py-4 rounded shadow-lg hover:bg-blue-800 text-center text-lg border-b-4 border-blue-900 flex items-center justify-center">
              Siguiente Paso: Doc. Transporte (B/L) →
            </Link>
          </div>

        </form>
      </div>
    </main>
  );
}