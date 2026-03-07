"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

// COMPONENTE PARA LA ESTRUCTURA FIDEL AL ORIGINAL (Texto FUERA del recuadro)
const LabelField = ({ num, label, value, onChange, colSpan = 1, h = "8", placeholder = "", isBold = false }: any) => {
  return (
    <div style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }} className="flex flex-col gap-0.5">
      {/* TEXTO Y NÚMERO FUERA DEL RECUADRO */}
      <div className="flex gap-1 text-[10px] text-black leading-tight">
        {num && <span className="font-bold">{num}.</span>}
        <span className={`${isBold ? 'font-bold' : 'font-medium'} leading-tight`}>{label}</span>
      </div>
      {/* RECUADRO DE DATOS SOLO */}
      <div className={`border border-black bg-white px-1.5 flex items-center h-${h}`}>
        <input 
          type="text" 
          className="w-full text-xs font-bold text-black outline-none bg-transparent" 
          value={value || ""} 
          onChange={onChange} 
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

// COMPONENTE PARA SECCIONES CON TÍTULO
const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="col-span-12 font-bold text-black text-xs uppercase mt-4 mb-0.5">{title}</h3>
);

export default function DeclaracionCambioExportacion() {
  const router = useRouter(); 

  // --- I. TIPO DE OPERACIÓN ---
  const [tipoOperacion, setTipoOperacion] = useState("2"); 

  // --- II. IDENTIFICACIÓN DE LA DECLARACIÓN ---
  const [nitImc, setNitImc] = useState("");
  const [fechaDec, setFechaDec] = useState("");
  const [numDec, setNumDec] = useState("");

  // --- III. IDENTIFICACIÓN DE LA DECLARACIÓN DE CAMBIO ANTERIOR ---
  const [nitImcAnt, setNitImcAnt] = useState("");
  const [fechaDecAnt, setFechaDecAnt] = useState("");
  const [numDecAnt, setNumDecAnt] = useState("");

  // --- IV. IDENTIFICACIÓN DEL EXPORTADOR ---
  const [tipoId, setTipoId] = useState("");
  const [numIdExp, setNumIdExp] = useState("");
  const [dv, setDv] = useState("");
  const [nombreExp, setNombreExp] = useState("");

  // --- V. DESCRIPCIÓN DE LA OPERACIÓN ---
  const [codMoneda, setCodMoneda] = useState("");
  const [valorMoneda, setValorMoneda] = useState("");
  const [tipoCambio, setTipoCambio] = useState("");

  // --- VI. IDENTIFICACIÓN DEL DECLARANTE ---
  const [nombreDeclarante, setNombreDeclarante] = useState("");
  const [idDeclarante, setIdDeclarante] = useState("");

  // --- OBSERVACIONES ---
  const [observaciones, setObservaciones] = useState("");

  // --- VII. INFORMACIÓN DEX / FACTURAS ---
  const [docs, setDocs] = useState([
    { num: "", fecha: "", numeral: "", valor: "" },
    { num: "", fecha: "", numeral: "", valor: "" },
    { num: "", fecha: "", numeral: "", valor: "" },
  ]);

  // TOTALES
  const [totalFob, setTotalFob] = useState("");
  const [totalGastos, setTotalGastos] = useState("");
  const [deducciones, setDeducciones] = useState("");
  const [reintegroNeto, setReintegroNeto] = useState("");

  // CARGAR LOS DATOS AL ABRIR LA PÁGINA
  useEffect(() => {
    const borradorGuardado = sessionStorage.getItem("borrador_declaracion_cambio_expo_v1");
    
    if (borradorGuardado) {
      const d = JSON.parse(borradorGuardado);
      setTipoOperacion(d.tipoOperacion || "2");
      setNitImc(d.nitImc || ""); setFechaDec(d.fechaDec || ""); setNumDec(d.numDec || "");
      setNitImcAnt(d.nitImcAnt || ""); setFechaDecAnt(d.fechaDecAnt || ""); setNumDecAnt(d.numDecAnt || "");
      setTipoId(d.tipoId || ""); setNumIdExp(d.numIdExp || ""); setDv(d.dv || ""); setNombreExp(d.nombreExp || "");
      setCodMoneda(d.codMoneda || ""); setValorMoneda(d.valorMoneda || ""); setTipoCambio(d.tipoCambio || ""); 
      setNombreDeclarante(d.nombreDeclarante || ""); setIdDeclarante(d.idDeclarante || "");
      setObservaciones(d.observaciones || "");
      setTotalFob(d.totalFob || ""); setTotalGastos(d.totalGastos || ""); setDeducciones(d.deducciones || ""); setReintegroNeto(d.reintegroNeto || "");
      if(d.docs) setDocs(d.docs);
    } else {
      const datosGuardados = localStorage.getItem('datosReservaExpo');
      if (datosGuardados) {
        const parsed = JSON.parse(datosGuardados);
        setNombreExp(parsed.shipperNombre || "");
        setNombreDeclarante(parsed.shipperNombre || "");
      }
    }
  }, []); 

  // GUARDAR BORRADOR CONTINUAMENTE
  useEffect(() => {
    const d = {
      tipoOperacion, nitImc, fechaDec, numDec, nitImcAnt, fechaDecAnt, numDecAnt,
      tipoId, numIdExp, dv, nombreExp, codMoneda, valorMoneda, tipoCambio, 
      nombreDeclarante, idDeclarante, observaciones, docs,
      totalFob, totalGastos, deducciones, reintegroNeto
    };
    sessionStorage.setItem("borrador_declaracion_cambio_expo_v1", JSON.stringify(d));
  });

  const actualizarDoc = (index: number, campo: string, valor: string) => {
    const nuevosDocs = [...docs];
    nuevosDocs[index] = { ...nuevosDocs[index], [campo]: valor };
    setDocs(nuevosDocs);
  };

  const generarPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    const doc = new jsPDF("portrait", "mm", "a4");

    // Función auxiliar para dibujar etiqueta y recuadro fideles al original
    const drawFidelBox = (x: number, y: number, w: number, h: number, num: string, title: string, value: string, isBoldTitle = false) => {
      // 1. Dibujar Texto FUERA
      doc.setFont("helvetica", isBoldTitle ? "bold" : "normal");
      doc.setFontSize(7);
      doc.setTextColor(0, 0, 0);
      let xText = x;
      if (num) {
        doc.setFont("helvetica", "bold");
        doc.text(`${num}.`, x, y + 3);
        xText += 5;
      }
      doc.setFont("helvetica", isBoldTitle ? "bold" : "normal");
      doc.text(title, xText, y + 3);

      // 2. Dibujar Recuadro SOLO
      const yBox = y + 4;
      const hBox = h - 4;
      doc.rect(x, yBox, w, hBox);

      // 3. Dibujar Valor DENTRO
      if (value) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(String(value), x + 2, yBox + (hBox / 2) + 1, { baseline: "middle" });
      }
    };

    try {
        const imgPath = "/logo_banrep.png"; 
        const response = await fetch(imgPath);
        
        if(response.ok){
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64data = reader.result as string;
                doc.addImage(base64data, 'PNG', 12, 10, 22, 22); 
                generarContenidoPDF(doc, drawFidelBox);
            }
            reader.readAsDataURL(blob);
            return; 
        } else {
            throw new Error("Logo no encontrado");
        }
    } catch (err) {
        doc.setFont("helvetica", "bold");
        doc.setLineWidth(0.5);
        doc.circle(23, 20, 10);
        doc.setFontSize(6);
        doc.text("BANCO DE LA", 23, 17, { align: "center" });
        doc.text("REPUBLICA", 23, 21, { align: "center" });
        doc.text("COLOMBIA", 23, 25, { align: "center" });
        generarContenidoPDF(doc, drawFidelBox);
    }
  };

  const generarContenidoPDF = (doc: jsPDF, drawFidelBox: any) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3); // Líneas estándar

    // --- ENCABEZADO ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14); 
    doc.text("Declaración de Cambio por Exportaciones de Bienes", 95, 17, { align: "center" });
    doc.setFontSize(12);
    doc.text("Formulario No. 2", 95, 23, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Circular Reglamentaria Externa DCIN-83 de agosto 9 de 2011", 95, 28, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text("Formulario No. 2", 195, 12, { align: "right" });
    
    // I. TIPO DE OPERACIÓN
    doc.setFontSize(9);
    doc.text("I. TIPO DE OPERACIÓN", 155, 18);
    drawFidelBox(155, 18.5, 45, 10, "1", "Número:", tipoOperacion, true);

    // --- II. IDENTIFICACIÓN DE LA DECLARACIÓN ---
    let y = 35;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("II. IDENTIFICACIÓN DE LA DECLARACIÓN", 10, y);
    y += 1;
    drawFidelBox(10, y, 115, 10, "2", "Nit del I.M.C o Código cuenta de compensación", nitImc, true);
    drawFidelBox(125, y, 40, 10, "3", "Fecha AAAA-MM-DD", fechaDec, true);
    drawFidelBox(165, y, 35, 10, "4", "Número", numDec, true);

    // --- III. IDENTIFICACIÓN DE ANTERIOR ---
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.text("III. IDENTIFICACIÓN DE LA DECLARACIÓN DE CAMBIO ANTERIOR", 10, y);
    y += 1;
    drawFidelBox(10, y, 115, 10, "5", "Nit del I.M.C o Código cuenta de compensación", nitImcAnt, true);
    drawFidelBox(125, y, 40, 10, "6", "Fecha AAAA-MM-DD", fechaDecAnt, true);
    drawFidelBox(165, y, 35, 10, "7", "Número", numDecAnt, true);

    // --- IV. IDENTIFICACIÓN DEL EXPORTADOR ---
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.text("IV. IDENTIFICACIÓN DEL EXPORTADOR", 10, y);
    y += 1;
    drawFidelBox(10, y, 20, 10, "8", "Tipo", tipoId, true);
    drawFidelBox(30, y, 50, 10, "9", "Número de identificación", numIdExp, true);
    drawFidelBox(80, y, 15, 10, "", "DV", dv, true);
    drawFidelBox(95, y, 105, 10, "10", "Nombre o razón social", nombreExp, true);

    // --- V. DESCRIPCIÓN DE LA OPERACIÓN ---
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.text("V. DESCRIPCIÓN DE LA OPERACIÓN (REINTEGRO)", 10, y);
    y += 1;
    drawFidelBox(10, y, 60, 10, "11", "Código moneda reintegro", codMoneda, true);
    drawFidelBox(70, y, 65, 10, "12", "Valor moneda reintegro", valorMoneda, true);
    drawFidelBox(135, y, 65, 10, "13", "Tipo de cambio a USD", tipoCambio, true);

    // JURAMENTO
    y += 18;
    const textLegal = "Para los fines previstos en el articulo 83 de la constitución política de Colombia, declaro bajo la gravedad de juramento que los conceptos, cantidades y demás datos consignados en el presente formulario son correctos y la fiel expresión de la verdad.";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(doc.splitTextToSize(textLegal, 190), 10, y);

    // --- VI. IDENTIFICACIÓN DEL DECLARANTE ---
    y += 12;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("VI. IDENTIFICACIÓN DEL DECLARANTE", 10, y);
    y += 1;
    drawFidelBox(10, y, 95, 11, "14", "Nombre", nombreDeclarante, true);
    drawFidelBox(105, y, 45, 11, "15", "Número de identificación", idDeclarante, true);
    
    // Firma Box
    drawFidelBox(150, y, 50, 11, "16", "Firma", "", true);

    // OBSERVACIONES
    y += 20;
    doc.rect(10, y, 190, 25);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Observaciones:", 12, y + 5);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(observaciones, 185), 12, y + 10);

    // --- VII. INFORMACIÓN DIAN (DEX / FACTURAS) ---
    y += 30;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("INFORMACIÓN REQUERIDA POR LA DIAN:", 10, y);
    y += 5;
    doc.text("VII. INFORMACIÓN DE LOS DOCUMENTOS DE EXPORTACIÓN", 10, y);
    y += 3.5;
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("(Declaración de exportación / Formulario de movimiento de mercancías y/o Factura Comercial)", 10, y);

    const tblY = y + 2;
    const hRow = 6;
    const hHeader = 8;
    
    // Cabecera Tabla (Texto fuera de la celda de datos)
    // Número
    doc.setFont("helvetica", "bold"); doc.text("17.", 10, tblY + 3); doc.setFont("helvetica", "normal"); doc.text("Número", 15, tblY + 3);
    doc.rect(10, tblY + 4, 47.5, hHeader - 4);
    
    // Fecha
    doc.setFont("helvetica", "bold"); doc.text("18.", 57.5, tblY + 3); doc.setFont("helvetica", "normal"); doc.text("Fecha AAAA-MM-DD", 62.5, tblY + 3);
    doc.rect(57.5, tblY + 4, 47.5, hHeader - 4);
    
    // Numeral
    doc.setFont("helvetica", "bold"); doc.text("19.", 105, tblY + 3); doc.setFont("helvetica", "normal"); doc.text("Numeral", 110, tblY + 3);
    doc.rect(105, tblY + 4, 47.5, hHeader - 4);
    
    // Valor
    doc.setFont("helvetica", "bold"); doc.text("20.", 152.5, tblY + 3); doc.setFont("helvetica", "normal"); doc.text("Valor reintegrado USD", 157.5, tblY + 3);
    doc.rect(152.5, tblY + 4, 47.5, hHeader - 4);

    // Filas Tabla
    let rowY = tblY + hHeader;
    docs.forEach((d) => {
        doc.setFont("helvetica", "normal"); doc.setFontSize(8);
        doc.rect(10, rowY, 47.5, hRow); doc.text(d.num, 12, rowY + 4);
        doc.rect(57.5, rowY, 47.5, hRow); doc.text(d.fecha, 59.5, rowY + 4);
        doc.rect(105, rowY, 47.5, hRow); doc.text(d.numeral, 107, rowY + 4);
        doc.rect(152.5, rowY, 47.5, hRow); doc.setFont("helvetica", "bold"); doc.text(d.valor, 154.5, rowY + 4);
        rowY += hRow;
    });

    // TOTALES (Texto a la izquierda, recuadro a la derecha)
    doc.setFont("helvetica", "bold"); doc.setFontSize(7);
    doc.text("21. Total valor FOB", 10, rowY + 4);
    doc.rect(152.5, rowY, 47.5, hRow); doc.setFontSize(8); doc.text(totalFob, 154.5, rowY + 4);
    rowY += hRow;

    doc.setFontSize(7);
    doc.text("22. Total gastos de exportación (numeral cambiario 1510)", 10, rowY + 4);
    doc.rect(152.5, rowY, 47.5, hRow); doc.setFontSize(8); doc.text(totalGastos, 154.5, rowY + 4);
    rowY += hRow;

    doc.setFontSize(7);
    doc.text("23. Deducciones (numeral cambiario 2016)", 10, rowY + 4);
    doc.rect(152.5, rowY, 47.5, hRow); doc.setFontSize(8); doc.text(deducciones, 154.5, rowY + 4);
    rowY += hRow;

    doc.setFontSize(7);
    doc.text("24. Reintegro neto (FOB + gastos deducciones)", 10, rowY + 4);
    doc.rect(152.5, rowY, 47.5, hRow); doc.setFontSize(8); doc.text(reintegroNeto, 154.5, rowY + 4);

    doc.save(`Formulario_No2_Exportaciones_${numDec || 'Borrador'}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-200 p-4 md:p-8 flex flex-col items-center">
      
      <div className="w-full max-w-5xl mb-4 flex justify-between items-center">
        <button onClick={() => router.back()} type="button" className="bg-white text-black border-2 border-black px-4 py-2 rounded font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-sm">
          ← Atrás
        </button>
        <Link href="/" className="text-gray-600 font-bold hover:text-black flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      <div className="w-full max-w-5xl bg-white shadow-2xl overflow-hidden border-2 border-black">
        
        {/* HEADER ESTILO RÉPLICA */}
        <div className="bg-white p-6 border-b-4 border-black flex items-center gap-6">
          <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center border-4 border-black shadow text-[9px] font-black leading-tight text-center">
            <span>BANCO DE LA</span><span>REPUBLICA</span>
          </div>
          <div>
            <h2 className="font-black text-2xl text-black uppercase tracking-tight">Declaración de Cambio por Exportaciones</h2>
            <h3 className="font-bold text-lg text-gray-700">Formulario No. 2</h3>
            <p className="text-xs text-gray-500 font-bold mt-1">Reintegro de divisas por venta de bienes al exterior</p>
          </div>
        </div>

        <form onSubmit={generarPDF} className="p-6 md:p-8 space-y-6">
          
          <div className="grid grid-cols-12 gap-x-2 gap-y-3">
            
            {/* SECCIÓN I - Tipo Op (Top Derecho) */}
            <div className="col-span-12 flex justify-end mb-2">
                <div className="w-64 border-2 border-black p-2 bg-gray-50">
                    <LabelField num="1" label="Número:" value={tipoOperacion} onChange={(e:any)=>setTipoOperacion(e.target.value)} isBold={true} />
                </div>
            </div>

            {/* SECCIÓN II */}
            <SectionTitle title="II. Identificación de la Declaración" />
            <LabelField colSpan={6} num="2" label="Nit del I.M.C o Código cuenta de compensación" value={nitImc} onChange={(e:any)=>setNitImc(e.target.value)} isBold={true} />
            <LabelField colSpan={3} num="3" label="Fecha AAAA-MM-DD" value={fechaDec} onChange={(e:any)=>setFechaDec(e.target.value)} isBold={true} />
            <LabelField colSpan={3} num="4" label="Número" value={numDec} onChange={(e:any)=>setNumDec(e.target.value)} isBold={true} />

            {/* SECCIÓN III */}
            <SectionTitle title="III. Identificación de la Declaración de Cambio Anterior" />
            <LabelField colSpan={6} num="5" label="Nit del I.M.C o Código cuenta de compensación" value={nitImcAnt} onChange={(e:any)=>setNitImcAnt(e.target.value)} isBold={true} />
            <LabelField colSpan={3} num="6" label="Fecha AAAA-MM-DD" value={fechaDecAnt} onChange={(e:any)=>setFechaDecAnt(e.target.value)} isBold={true} />
            <LabelField colSpan={3} num="7" label="Número" value={numDecAnt} onChange={(e:any)=>setNumDecAnt(e.target.value)} isBold={true} />

            {/* SECCIÓN IV */}
            <SectionTitle title="IV. Identificación del Exportador" />
            <LabelField colSpan={2} num="8" label="Tipo" value={tipoId} onChange={(e:any)=>setTipoId(e.target.value)} isBold={true} />
            <LabelField colSpan={3} num="9" label="Número de identificación" value={numIdExp} onChange={(e:any)=>setNumIdExp(e.target.value)} isBold={true} />
            <LabelField colSpan={1} label="DV" value={dv} onChange={(e:any)=>setDv(e.target.value)} isBold={true} />
            <LabelField colSpan={6} num="10" label="Nombre o razón social" value={nombreExp} onChange={(e:any)=>setNombreExp(e.target.value)} isBold={true} />

            {/* SECCIÓN V */}
            <SectionTitle title="V. Descripción de la Operación (Reintegro)" />
            <LabelField colSpan={4} num="11" label="Código moneda reintegro" value={codMoneda} onChange={(e:any)=>setCodMoneda(e.target.value)} isBold={true} />
            <LabelField colSpan={4} num="12" label="Valor moneda reintegro" value={valorMoneda} onChange={(e:any)=>setValorMoneda(e.target.value)} isBold={true} />
            <LabelField colSpan={4} num="13" label="Tipo de cambio a USD" value={tipoCambio} onChange={(e:any)=>setTipoCambio(e.target.value)} isBold={true} />
            
            <div className="col-span-12 mt-2">
                <p className="text-[10px] font-bold text-gray-700 text-justify bg-gray-50 p-2 border border-gray-200 rounded">
                    Para los fines previstos en el articulo 83 de la constitución política de Colombia, declaro bajo la gravedad de juramento que los conceptos, cantidades y demás datos consignados en el presente formulario son correctos y la fiel expresión de la verdad.
                </p>
            </div>

            {/* SECCIÓN VI */}
            <SectionTitle title="VI. Identificación del Declarante" />
            <LabelField colSpan={5} num="14" label="Nombre" value={nombreDeclarante} onChange={(e:any)=>setNombreDeclarante(e.target.value)} isBold={true} h="10" />
            <LabelField colSpan={4} num="15" label="Número de identificación" value={idDeclarante} onChange={(e:any)=>setIdDeclarante(e.target.value)} isBold={true} h="10" />
            <div className="col-span-3 flex flex-col gap-0.5">
                <div className="flex gap-1 text-[10px] text-black font-bold leading-tight"><span>16.</span>Firma</div>
                <div className="border border-black bg-white h-10 flex items-center justify-center text-xs text-gray-400 font-mono">Espacio para Firma</div>
            </div>

            {/* OBSERVACIONES */}
            <div className="col-span-12 mt-4">
              <div className="border border-black p-2 bg-white">
                <h3 className="font-bold text-black text-xs uppercase mb-1">Observaciones:</h3>
                <textarea className="w-full text-xs outline-none resize-none h-16 bg-transparent" value={observaciones} onChange={(e)=>setObservaciones(e.target.value)} />
              </div>
            </div>

            {/* SECCIÓN VII - DIAN */}
            <SectionTitle title="INFORMACIÓN REQUERIDA POR LA DIAN: VII. Información de los Documentos de Exportación" />
            <div className="col-span-12 mt-[-5px]">
                <p className="text-[10px] text-gray-600 font-bold mb-2">(Declaración de exportación / Formulario de movimiento de mercancías y/o Factura Comercial)</p>
            </div>
            
            <div className="col-span-12 border border-black bg-white">
                {/* Cabecera Tabla (Texto fuera de los inputs) */}
                <div className="grid grid-cols-4 bg-gray-100 border-b border-black text-[10px] font-bold text-black divide-x divide-black">
                  <div className="p-1 flex items-center"><span className="mr-1">17.</span>Número</div>
                  <div className="p-1 flex items-center"><span className="mr-1">18.</span>Fecha AAAA-MM-DD</div>
                  <div className="p-1 flex items-center"><span className="mr-1">19.</span>Numeral</div>
                  <div className="p-1 flex items-center"><span className="mr-1">20.</span>Valor reintegrado USD</div>
                </div>
                {/* Filas de Datos (Inputs limpios) */}
                {docs.map((d, index) => (
                  <div key={index} className="grid grid-cols-4 text-xs divide-x divide-black border-b border-black last:border-b-0">
                    <input type="text" className="p-1.5 outline-none bg-transparent w-full" value={d.num} onChange={(e)=>actualizarDoc(index, 'num', e.target.value)} />
                    <input type="text" className="p-1.5 outline-none bg-transparent w-full text-center" value={d.fecha} onChange={(e)=>actualizarDoc(index, 'fecha', e.target.value)} />
                    <input type="text" className="p-1.5 outline-none bg-transparent w-full text-center" value={d.numeral} onChange={(e)=>actualizarDoc(index, 'numeral', e.target.value)} />
                    <input type="text" className="p-1.5 outline-none bg-transparent w-full font-bold text-right" value={d.valor} onChange={(e)=>actualizarDoc(index, 'valor', e.target.value)} />
                  </div>
                ))}
            </div>

            {/* TOTALES (Texto izquierda, Input derecha) */}
            <div className="col-span-12 grid grid-cols-12 gap-1 items-center bg-gray-50 border border-black p-1 mt-1">
                <div className="col-span-9 text-[10px] font-bold text-black"><span className="mr-2">21.</span> Total valor FOB</div>
                <div className="col-span-3 border border-black bg-white h-7 flex items-center px-1">
                    <input type="text" className="w-full text-xs font-bold text-black outline-none bg-transparent text-right" value={totalFob} onChange={(e)=>setTotalFob(e.target.value)} />
                </div>
            </div>
            <div className="col-span-12 grid grid-cols-12 gap-1 items-center bg-gray-50 border border-black p-1">
                <div className="col-span-9 text-[10px] font-bold text-black"><span className="mr-2">22.</span> Total gastos de exportación (numeral cambiario 1510)</div>
                <div className="col-span-3 border border-black bg-white h-7 flex items-center px-1">
                    <input type="text" className="w-full text-xs font-bold text-black outline-none bg-transparent text-right" value={totalGastos} onChange={(e)=>setTotalGastos(e.target.value)} />
                </div>
            </div>
            <div className="col-span-12 grid grid-cols-12 gap-1 items-center bg-gray-50 border border-black p-1">
                <div className="col-span-9 text-[10px] font-bold text-black"><span className="mr-2">23.</span> Deducciones (numeral cambiario 2016)</div>
                <div className="col-span-3 border border-black bg-white h-7 flex items-center px-1">
                    <input type="text" className="w-full text-xs font-bold text-black outline-none bg-transparent text-right" value={deducciones} onChange={(e)=>setDeducciones(e.target.value)} />
                </div>
            </div>
            <div className="col-span-12 grid grid-cols-12 gap-1 items-center bg-gray-50 border border-black p-1">
                <div className="col-span-9 text-[10px] font-bold text-black"><span className="mr-2">24.</span> Reintegro neto (FOB + gastos deducciones)</div>
                <div className="col-span-3 border border-black bg-white h-7 flex items-center px-1">
                    <input type="text" className="w-full text-xs font-bold text-black outline-none bg-transparent text-right" value={reintegroNeto} onChange={(e)=>setReintegroNeto(e.target.value)} />
                </div>
            </div>

          </div>

          <div className="flex flex-col gap-4 mt-10 pt-6 border-t-4 border-black">
            <button type="submit" className="w-full bg-black text-white font-black py-5 rounded shadow-xl hover:bg-gray-800 transition-all text-xl uppercase tracking-widest">
              📥 Descargar Formulario No. 2 (PDF Profesional)
            </button>
            <Link href="/" className="w-full block text-center bg-gray-200 text-black font-bold py-4 rounded-md hover:bg-gray-300 transition-colors mt-2 text-lg">
              🎉 Finalizar Simulación y Volver al Menú
            </Link>
          </div>

        </form>
      </div>
    </main>
  );
}