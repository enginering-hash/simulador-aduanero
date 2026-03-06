"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CertificadoICA() {
  const router = useRouter();

  // --- DATOS DE ORGANIZACIONES Y PAÍSES (Editables, sin pre-llenado agresivo) ---
  const [orgOrigen, setOrgOrigen] = useState("");
  const [orgDestino, setOrgDestino] = useState("");
  const [dePais, setDePais] = useState("");
  const [paraPais, setParaPais] = useState("");

  // --- DATOS DEL ENVÍO (Heredados y Editables) ---
  const [exportador, setExportador] = useState("");
  const [consignatario, setConsignatario] = useState("");
  const [descripcionBultos, setDescripcionBultos] = useState("");
  const [marcasDistintivas, setMarcasDistintivas] = useState("");
  const [lugarOrigen, setLugarOrigen] = useState("");
  const [mediosTransporte, setMediosTransporte] = useState("");
  const [puertoEntrada, setPuertoEntrada] = useState("");
  const [nombreProductor, setNombreProductor] = useState("");

  // --- DATOS ESPECÍFICOS ICA ---
  const [numeroCertificado, setNumeroCertificado] = useState("");
  const [nombreBotanico, setNombreBotanico] = useState("");
  const [declaracionAdicional, setDeclaracionAdicional] = useState("");
  
  // Tratamiento
  const [fechaTratamiento, setFechaTratamiento] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [quimico, setQuimico] = useState("");
  const [concentracion, setConcentracion] = useState("");
  const [duracionTemp, setDuracionTemp] = useState("");

  // --- DATOS DE FIRMA Y EXPEDICIÓN ---
  const [lugarExpedicion, setLugarExpedicion] = useState("Buenaventura");
  const [fechaExpedicion, setFechaExpedicion] = useState("");
  const [funcionario, setFuncionario] = useState("");

  // CARGAR LOS DATOS AL ABRIR LA PÁGINA
  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0];
    const borradorGuardado = sessionStorage.getItem("borrador_certificado_ica_v3");

    if (borradorGuardado) {
      const datos = JSON.parse(borradorGuardado);
      setOrgOrigen(datos.orgOrigen || "");
      setOrgDestino(datos.orgDestino || "");
      setDePais(datos.dePais || "");
      setParaPais(datos.paraPais || "");
      setExportador(datos.exportador || "");
      setConsignatario(datos.consignatario || "");
      setDescripcionBultos(datos.descripcionBultos || "");
      setMarcasDistintivas(datos.marcasDistintivas || "");
      setLugarOrigen(datos.lugarOrigen || "");
      setMediosTransporte(datos.mediosTransporte || "");
      setPuertoEntrada(datos.puertoEntrada || "");
      setNombreProductor(datos.nombreProductor || "");
      setNumeroCertificado(datos.numeroCertificado || "");
      setNombreBotanico(datos.nombreBotanico || "");
      setDeclaracionAdicional(datos.declaracionAdicional || "");
      setFechaTratamiento(datos.fechaTratamiento || "");
      setTratamiento(datos.tratamiento || "");
      setQuimico(datos.quimico || "");
      setConcentracion(datos.concentracion || "");
      setDuracionTemp(datos.duracionTemp || "");
      
      setLugarExpedicion(datos.lugarExpedicion || "Buenaventura");
      setFechaExpedicion(datos.fechaExpedicion || hoy);
      setFuncionario(datos.funcionario || "");
    } else {
      // Si es la primera vez, generamos número de certificado y heredamos datos base
      setNumeroCertificado(`CV 09 - ${Math.floor(100000 + Math.random() * 900000)}`);
      setFechaExpedicion(hoy);
      setLugarExpedicion("Buenaventura");
      
      // Sugerimos una declaración adicional estándar
      setDeclaracionAdicional("Los productos vegetales aquí descritos cumplen con los requisitos fitosanitarios de importación.");

      const datosGuardados = localStorage.getItem('datosReserva');
      if (datosGuardados) {
        const parsed = JSON.parse(datosGuardados);
        setExportador(parsed.shipperNombre || "");
        setConsignatario(parsed.consignatarioNombre || "");
        setParaPais(parsed.destino?.split(',').pop()?.trim() || "");
        setDescripcionBultos(parsed.contenedores || "");
        setPuertoEntrada(parsed.destino || "");
        setNombreProductor(parsed.shipperNombre || "");
        setDePais("Colombia");
      }
    }
  }, []);

  // GUARDAR LOS DATOS EN BORRADOR
  useEffect(() => {
    const borradorActual = {
      orgOrigen, orgDestino, dePais, paraPais, exportador, consignatario,
      descripcionBultos, marcasDistintivas, lugarOrigen, mediosTransporte,
      puertoEntrada, nombreProductor, numeroCertificado, nombreBotanico,
      declaracionAdicional, fechaTratamiento, tratamiento, quimico,
      concentracion, duracionTemp, lugarExpedicion, fechaExpedicion, funcionario
    };
    sessionStorage.setItem("borrador_certificado_ica_v3", JSON.stringify(borradorActual));
  });

  const generarPDF = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = new jsPDF();

    // --- ENCABEZADO SUPERIOR ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(0, 132, 61); // Verde ICA
    doc.text("ica", 14, 22);
    
    doc.setDrawColor(0, 132, 61);
    doc.setFillColor(252, 211, 77); // Amarillo
    doc.circle(32, 16, 2, "F");

    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("República de Colombia", 45, 12);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("Instituto Colombiano Agropecuario - ICA", 45, 16);
    doc.text("Ministerio de Agricultura y Desarrollo Rural", 45, 20);

    // Título Central
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Certificado Fitosanitario", 105, 30, { align: "center" });

    // Número de Certificado
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`No. ${numeroCertificado}`, 155, 30);

    // --- BLOQUE 1: ORGANIZACIONES ---
    autoTable(doc, {
      startY: 42,
      body: [
        [`Organización de Protección Fitosanitaria:\n${orgOrigen}`, `A Organización de Protección Fitosanitaria:\n${orgDestino}`],
        [`De: ${dePais}`, `Para: ${paraPais}`]
      ],
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3, textColor: 0, lineColor: [150, 150, 150] }
    });

    // --- BLOQUE 2: DESCRIPCIÓN DEL ENVÍO ---
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 2,
      head: [[{ content: "Descripción del Envío", colSpan: 2 }]],
      body: [
        [{ content: `Nombre y dirección del exportador:\n${exportador}`, colSpan: 2 }],
        [{ content: `Nombre y dirección del destinatario:\n${consignatario}`, colSpan: 2 }],
        [{ content: `Número y descripción de los bultos:\n${descripcionBultos}`, colSpan: 2 }],
        [{ content: `Marcas distintivas:\n${marcasDistintivas}`, colSpan: 2 }],
        [`Lugar de origen:\n${lugarOrigen}`, `Medios de transporte:\n${mediosTransporte}`],
        [`Punto de entrada:\n${puertoEntrada}`, `Productor y cantidad:\n${nombreProductor}`],
        [{ content: `Nombre botánico de las plantas:\n${nombreBotanico}`, colSpan: 2 }]
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 132, 61], textColor: 255, fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 3, textColor: 0, lineColor: [150, 150, 150] }
    });

    // --- BLOQUE 3: DECLARACIÓN ADICIONAL ---
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 2,
      head: [["Declaración Adicional"]],
      body: [[declaracionAdicional]],
      theme: 'grid',
      headStyles: { fillColor: [0, 132, 61], textColor: 255, fontSize: 9 },
      styles: { fontSize: 8, textColor: 0, lineColor: [150, 150, 150], cellPadding: 3 }
    });

    // --- BLOQUE 4: TRATAMIENTO ---
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 2,
      head: [[{ content: "Tratamiento de Desinfestación o Desinfección", colSpan: 2 }]],
      body: [
        [`Fecha: ${fechaTratamiento}`, `Tratamiento: ${tratamiento}`],
        [`Producto Químico: ${quimico}`, `Concentración: ${concentracion}`],
        [`Duración y Temperatura: ${duracionTemp}`, `Información Adicional: Ninguna`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 132, 61], textColor: 255, fontSize: 9 },
      styles: { fontSize: 8, textColor: 0, lineColor: [150, 150, 150], cellPadding: 3 }
    });

    // --- BLOQUE 5: FIRMA ---
    const finalY = (doc as any).lastAutoTable.finalY + 12;
    doc.setFont("helvetica", "bold");
    // AQUÍ SE APLICA EL CAMBIO QUE SOLICITASTE
    doc.text(`Lugar y Fecha de Expedición: ${lugarExpedicion}, ${fechaExpedicion}`, 14, finalY);
    doc.text(`Nombre del funcionario autorizado: ${funcionario}`, 14, finalY + 10);
    
    doc.line(130, finalY + 25, 190, finalY + 25);
    doc.text("Firma y Sello", 150, finalY + 30);

    doc.save(`Certificado_ICA_${numeroCertificado}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      
      <div className="w-full max-w-5xl mb-4 flex justify-between items-center">
        <button 
          onClick={() => router.back()} 
          type="button"
          className="bg-white text-green-800 border border-green-800 px-4 py-2 rounded font-bold hover:bg-green-50 transition-colors flex items-center gap-2 shadow-sm">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl border-t-8 border-green-700 overflow-hidden">
        
        <div className="bg-green-50 p-6 border-b border-green-200 flex justify-between items-center">
          <div>
            <h2 className="font-black text-2xl text-green-900 tracking-tight">Certificado Fitosanitario (ICA)</h2>
            <p className="text-sm text-green-700 font-medium">Requisito obligatorio para exportación de productos de origen vegetal/animal.</p>
          </div>
          <div className="bg-white p-2 border border-green-200 font-mono text-sm font-bold text-green-800 rounded">
            {numeroCertificado}
          </div>
        </div>

        <form onSubmit={generarPDF} className="p-8 space-y-6">
          
          {/* SECCIÓN 1: ORGANIZACIONES */}
          <section className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
            <h3 className="font-bold text-green-800 mb-4 border-b pb-2 text-sm">1. Datos de Organizaciones y Países</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Organización de Origen:</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" placeholder="Ej. Instituto Colombiano Agropecuario" value={orgOrigen} onChange={(e)=>setOrgOrigen(e.target.value)} required />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Organización de Destino:</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" placeholder="Ej. APHIS (USA)" value={orgDestino} onChange={(e)=>setOrgDestino(e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">País de Origen (De):</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" placeholder="Ej. Colombia" value={dePais} onChange={(e)=>setDePais(e.target.value)} required />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">País de Destino (Para):</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" placeholder="Ej. Estados Unidos" value={paraPais} onChange={(e)=>setParaPais(e.target.value)} required />
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: IDENTIFICACIÓN DEL ENVÍO */}
          <section className="bg-gray-50 p-5 rounded-lg border border-gray-300 shadow-sm">
            <h3 className="font-bold text-green-800 mb-4 border-b pb-2 text-sm">2. Descripción del Envío</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Exportador (Nombre y Dirección):</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" value={exportador} onChange={(e)=>setExportador(e.target.value)} required />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Consignatario (Nombre y Dirección):</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" value={consignatario} onChange={(e)=>setConsignatario(e.target.value)} required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Bultos / Embalaje:</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" placeholder="Ej. 1 Contenedor 40HC" value={descripcionBultos} onChange={(e)=>setDescripcionBultos(e.target.value)} required />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Marcas Distintivas:</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" placeholder="Ej. N/A o Sin Marcas" value={marcasDistintivas} onChange={(e)=>setMarcasDistintivas(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Lugar de Origen:</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" placeholder="Ej. Quindío, Colombia" value={lugarOrigen} onChange={(e)=>setLugarOrigen(e.target.value)} required />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Medios de Transporte:</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" placeholder="Ej. Marítimo" value={mediosTransporte} onChange={(e)=>setMediosTransporte(e.target.value)} required />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Punto de Entrada:</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" placeholder="Ej. Puerto de Miami" value={puertoEntrada} onChange={(e)=>setPuertoEntrada(e.target.value)} required />
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: DATOS BOTÁNICOS Y TÉCNICOS */}
          <section className="bg-green-50/50 p-5 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-800 mb-4 border-b border-green-300 pb-2 text-sm">3. Detalles Botánicos y Declaración</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-green-700 mb-1">Nombre Botánico (Científico):</label>
                <input type="text" className="w-full border p-2 text-sm rounded focus:ring-1 focus:ring-green-500 outline-none italic" placeholder="Ej. Coffea arabica" value={nombreBotanico} onChange={(e)=>setNombreBotanico(e.target.value)} required />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-green-700 mb-1">Productor y Cantidad:</label>
                <input type="text" className="w-full border p-2 text-sm rounded focus:ring-1 focus:ring-green-500 outline-none" placeholder="Ej. Finca El Paraíso - 2000 KG" value={nombreProductor} onChange={(e)=>setNombreProductor(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-green-700 mb-1">Declaración Adicional:</label>
              <textarea className="w-full border p-2 text-sm rounded h-16 resize-none outline-none focus:ring-1 focus:ring-green-500" placeholder="Escribe aquí las declaraciones fitosanitarias requeridas..." value={declaracionAdicional} onChange={(e)=>setDeclaracionAdicional(e.target.value)} required />
            </div>
          </section>

          {/* SECCIÓN 4: TRATAMIENTO */}
          <section className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
            <h3 className="font-bold text-green-800 mb-4 border-b pb-2 text-sm">4. Tratamiento de Desinfestación</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Fecha de Tratamiento:</label>
                <input type="date" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500 bg-white" value={fechaTratamiento} onChange={(e)=>setFechaTratamiento(e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Tratamiento:</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" placeholder="Ej. Fumigación" value={tratamiento} onChange={(e)=>setTratamiento(e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Producto Químico:</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" placeholder="Ej. Bromuro de Metilo" value={quimico} onChange={(e)=>setQuimico(e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Concentración:</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" placeholder="Ej. 10%" value={concentracion} onChange={(e)=>setConcentracion(e.target.value)} />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Duración y Temperatura:</label>
              <input type="text" className="w-full md:w-1/2 border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" placeholder="Ej. 24 Horas a 18°C" value={duracionTemp} onChange={(e)=>setDuracionTemp(e.target.value)} />
            </div>
          </section>

          {/* SECCIÓN 5: FIRMA Y EXPEDICIÓN */}
          <section className="border-t border-gray-300 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Lugar de Expedición:</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" placeholder="Ej. Buenaventura" value={lugarExpedicion} onChange={(e)=>setLugarExpedicion(e.target.value)} required />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Fecha de Expedición:</label>
                <input type="date" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500 bg-white" value={fechaExpedicion} onChange={(e)=>setFechaExpedicion(e.target.value)} required />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Funcionario Autorizado (Quien firma):</label>
                <input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-green-500" placeholder="Ej. Carlos Mario Restrepo" value={funcionario} onChange={(e)=>setFuncionario(e.target.value)} required />
              </div>
            </div>
          </section>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button type="submit" className="flex-1 bg-green-700 text-white font-bold py-4 rounded shadow-lg hover:bg-green-800 transition-all text-lg border-b-4 border-green-900">
              📥 Descargar Certificado ICA (PDF)
            </button>
            <Link href="/certificado-invima" className="flex-1 bg-blue-700 text-white font-bold py-4 rounded shadow-lg hover:bg-blue-800 text-center text-lg border-b-4 border-blue-900 flex items-center justify-center">
              Siguiente Paso: Certificado INVIMA →
            </Link>
          </div>

        </form>
      </div>
    </main>
  );
}