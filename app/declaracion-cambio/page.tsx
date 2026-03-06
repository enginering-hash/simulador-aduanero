"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function DeclaracionCambio() {
  const router = useRouter(); 

  // --- ESTADOS ---
  const [tipoOperacion, setTipoOperacion] = useState("1");
  const [nitImc, setNitImc] = useState("860.005.216-7");
  const [fechaDec, setFechaDec] = useState("");
  const [numDec, setNumDec] = useState("");
  const [nitImcAnt, setNitImcAnt] = useState("");
  const [fechaDecAnt, setFechaDecAnt] = useState("");
  const [numDecAnt, setNumDecAnt] = useState("");
  const [tipoId, setTipoId] = useState("NI");
  const [numIdImp, setNumIdImp] = useState("");
  const [dv, setDv] = useState("");
  const [nombreImp, setNombreImp] = useState("");
  const [codMoneda, setCodMoneda] = useState("USD");
  const [tipoCambio, setTipoCambio] = useState("4000.00");
  const [numeral, setNumeral] = useState("2014");
  const [valorMoneda, setValorMoneda] = useState("0.00");
  const [valorUsd, setValorUsd] = useState("0.00");
  const [nombreDeclarante, setNombreDeclarante] = useState("");
  const [idDeclarante, setIdDeclarante] = useState("");
  const [observaciones, setObservaciones] = useState("Giro de divisas por importación de bienes.");
  const [dimNum, setDimNum] = useState("");
  const [dimValor, setDimValor] = useState("");

  // CARGAR LOS DATOS AL ABRIR LA PÁGINA
  useEffect(() => {
    const borradorGuardado = sessionStorage.getItem("borrador_declaracion_cambio_v2");
    
    if (borradorGuardado) {
      const datos = JSON.parse(borradorGuardado);
      setTipoOperacion(datos.tipoOperacion || "1");
      setNitImc(datos.nitImc || "860.005.216-7");
      setFechaDec(datos.fechaDec || "");
      setNumDec(datos.numDec || "");
      setNitImcAnt(datos.nitImcAnt || "");
      setFechaDecAnt(datos.fechaDecAnt || "");
      setNumDecAnt(datos.numDecAnt || "");
      setTipoId(datos.tipoId || "NI");
      setNumIdImp(datos.numIdImp || "");
      setDv(datos.dv || "");
      setNombreImp(datos.nombreImp || "");
      setCodMoneda(datos.codMoneda || "USD");
      setTipoCambio(datos.tipoCambio || "4000.00");
      setNumeral(datos.numeral || "2014");
      setValorMoneda(datos.valorMoneda || "0.00");
      setValorUsd(datos.valorUsd || "0.00");
      setNombreDeclarante(datos.nombreDeclarante || "");
      setIdDeclarante(datos.idDeclarante || "");
      setObservaciones(datos.observaciones || "");
      setDimNum(datos.dimNum || "");
      setDimValor(datos.dimValor || "");
    } else {
      const hoy = new Date();
      setFechaDec(hoy.toISOString().split('T')[0]);
      setNumDec(`BR-${Math.floor(100000 + Math.random() * 900000)}`);

      const datosGuardados = localStorage.getItem('datosReserva');
      if (datosGuardados) {
        const parsed = JSON.parse(datosGuardados);
        setNombreImp(parsed.consignatarioNombre || "");
        setNombreDeclarante(parsed.consignatarioNombre || "");
        setNumIdImp("900123456");
        setDv("1");
      }
    }
  }, []); 

  // GUARDAR LOS DATOS CADA VEZ QUE ESCRIBES ALGO
  useEffect(() => {
    const borradorActual = {
      tipoOperacion, nitImc, fechaDec, numDec, nitImcAnt, fechaDecAnt, numDecAnt,
      tipoId, numIdImp, dv, nombreImp, codMoneda, tipoCambio, numeral, valorMoneda,
      valorUsd, nombreDeclarante, idDeclarante, observaciones, dimNum, dimValor
    };
    sessionStorage.setItem("borrador_declaracion_cambio_v2", JSON.stringify(borradorActual));
  });

  const generarPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    const doc = new jsPDF();
    
    // Intento de cargar logo del Banco de la República desde la carpeta /public
    try {
        const imgPath = "/logo_banrep.png"; 
        const response = await fetch(imgPath);
        
        if(response.ok){
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64data = reader.result as string;
                doc.addImage(base64data, 'PNG', 12, 10, 25, 20); 
                generarContenidoPDF(doc);
            }
            reader.readAsDataURL(blob);
            return; 
        } else {
            throw new Error("Logo no encontrado");
        }
    } catch (err) {
        console.warn("No se encontró logo_banrep.png en public, usando logo por defecto.");
        doc.setFont("helvetica", "bold");
        doc.circle(25, 20, 8);
        doc.setFontSize(6);
        doc.text("BANCO DE LA", 25, 18, { align: "center" });
        doc.text("REPUBLICA", 25, 22, { align: "center" });
        doc.text("COLOMBIA", 25, 26, { align: "center" });
        generarContenidoPDF(doc);
    }
  };

  const generarContenidoPDF = (doc: jsPDF) => {
    // --- ENCABEZADO CORREGIDO (Evita solapamientos) ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10); // Reducido un poco para que quepa mejor
    doc.text("Declaración de Cambio por Importaciones de Bienes", 95, 16, { align: "center" });
    doc.text("Formulario No. 1", 95, 21, { align: "center" });
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Circular Reglamentaria Externa DCIN-83", 95, 25, { align: "center" });
    
    // Bloque derecho movido más a la orilla para no chocar
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Formulario No. 1", 195, 12, { align: "right" });
    
    doc.setFontSize(8);
    doc.text("I. TIPO DE OPERACIÓN", 155, 18);
    doc.rect(155, 20, 40, 7);
    doc.setFont("helvetica", "normal");
    doc.text("1. Número:", 157, 25);
    doc.line(175, 20, 175, 27);
    
    // Evitar desbordamiento si escriben algo muy largo en Tipo Operación
    doc.setFont("helvetica", "bold");
    const textoOperacion = tipoOperacion.length > 8 ? tipoOperacion.substring(0, 8) + "..." : tipoOperacion;
    doc.text(textoOperacion, 177, 25);

    // --- TABLAS ---
    const headStyles: any = { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold', fontSize: 7, cellPadding: 1 };
    const bodyStyles: any = { fontSize: 8, textColor: 0, cellPadding: 2 };

    doc.setFontSize(9);
    doc.text("II. IDENTIFICACIÓN DE LA DECLARACIÓN", 14, 40);
    autoTable(doc, {
      startY: 42,
      head: [["2. Nit del I.M.C o Código cuenta de compensación", "3. Fecha AAAA-MM-DD", "4. Número"]],
      body: [[nitImc, fechaDec, numDec]],
      theme: 'grid', headStyles, styles: bodyStyles
    });

    doc.setFontSize(9);
    doc.text("III. IDENTIFICACIÓN DE LA DECLARACIÓN DE CAMBIO ANTERIOR", 14, (doc as any).lastAutoTable.finalY + 8);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["5. Nit del I.M.C o Código cuenta de compensación", "6. Fecha AAAA-MM-DD", "7. Número"]],
      body: [[nitImcAnt, fechaDecAnt, numDecAnt]],
      theme: 'grid', headStyles, styles: bodyStyles
    });

    doc.setFontSize(9);
    doc.text("IV. IDENTIFICACIÓN DEL IMPORTADOR", 14, (doc as any).lastAutoTable.finalY + 8);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["8. Tipo", "9. Número de identificación", "DV", "10. Nombre o razón social"]],
      body: [[tipoId, numIdImp, dv, nombreImp]],
      theme: 'grid', headStyles, styles: bodyStyles,
      columnStyles: { 0: { cellWidth: 20 }, 2: { cellWidth: 15 } }
    });

    doc.setFontSize(9);
    doc.text("V. DESCRIPCIÓN DE LA OPERACIÓN", 14, (doc as any).lastAutoTable.finalY + 8);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["11. Código moneda giro", "12. Tipo de cambio a USD", "13. Numeral", "14. Valor moneda giro", "15. Valor USD"]],
      body: [[codMoneda, tipoCambio, numeral, valorMoneda, valorUsd]],
      theme: 'grid', headStyles, styles: bodyStyles
    });

    const textLegal = "Para los fines previstos en el articulo 83 de la constitución política de Colombia, declaro bajo la gravedad de juramento que los conceptos, cantidades y demás datos consignados en el presente formulario son correctos y la fiel expresión de la verdad.";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(doc.splitTextToSize(textLegal, 180), 14, (doc as any).lastAutoTable.finalY + 8);

    doc.setFontSize(9);
    doc.text("VI. IDENTIFICACIÓN DEL DECLARANTE", 14, (doc as any).lastAutoTable.finalY + 20);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 22,
      head: [["16. Nombre", "17. Número de identificación", "18. Firma"]],
      body: [[nombreDeclarante, idDeclarante, ""]],
      theme: 'grid', headStyles, styles: { ...bodyStyles, minCellHeight: 12 }
    });

    const obsY = (doc as any).lastAutoTable.finalY + 5;
    doc.roundedRect(14, obsY, 182, 35, 3, 3);
    doc.setFontSize(8);
    doc.text("Observaciones:", 16, obsY + 5);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(observaciones, 175), 16, obsY + 10);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("INFORMACIÓN REQUERIDA POR LA DIAN:", 14, obsY + 45);
    doc.text("VII. INFORMACIÓN DOCUMENTOS DE IMPORTACIÓN", 14, obsY + 50);

    autoTable(doc, {
      startY: obsY + 53,
      head: [["19. Número", "20. Valor USD", "19. Número", "20. Valor USD"]],
      body: [
        [dimNum, dimValor, "", ""],
        ["", "", "", ""],
        ["", "", "", ""]
      ],
      theme: 'grid', headStyles, styles: bodyStyles
    });

    doc.save(`Formulario_1_Importaciones_${numDec}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-200 p-4 md:p-8 flex flex-col items-center">
      
      <div className="w-full max-w-5xl mb-4 flex justify-between items-center">
        <button 
          onClick={() => router.back()} 
          type="button"
          className="bg-white text-yellow-700 border border-yellow-700 px-4 py-2 rounded font-bold hover:bg-yellow-50 transition-colors flex items-center gap-2 shadow-sm">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl border-t-8 border-yellow-500 overflow-hidden">
        
        <div className="bg-yellow-50 p-6 border-b border-yellow-200 flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-full flex flex-col items-center justify-center border-2 border-yellow-600 shadow text-[8px] font-black leading-tight text-center">
            <span>BANCO DE LA</span><span>REPUBLICA</span>
          </div>
          <div>
            <h2 className="font-black text-xl text-yellow-900 uppercase tracking-tight">Declaración de Cambio (Formulario No. 1)</h2>
            <p className="text-sm text-yellow-700 font-medium">Giro de divisas por Importaciones de Bienes ante el Banco de la República.</p>
          </div>
        </div>

        <form onSubmit={generarPDF} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            <section className="col-span-12 md:col-span-12 bg-white p-4 rounded border border-gray-300 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-800 border-b pb-1 text-xs uppercase">I. y II. Identificación de la Declaración</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div><label className="block text-[10px] font-bold text-gray-500">1. TIPO DE OPERACIÓN:</label><input type="text" maxLength={4} className="w-full border p-2 text-xs rounded" value={tipoOperacion} onChange={(e)=>setTipoOperacion(e.target.value)} required /></div>
                <div className="md:col-span-2"><label className="block text-[10px] font-bold text-gray-500">2. NIT DEL I.M.C (Banco):</label><input type="text" className="w-full border p-2 text-xs rounded" value={nitImc} onChange={(e)=>setNitImc(e.target.value)} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-500">3. FECHA:</label><input type="date" className="w-full border p-2 text-xs rounded" value={fechaDec} onChange={(e)=>setFechaDec(e.target.value)} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-500">4. NÚMERO:</label><input type="text" className="w-full border p-2 text-xs rounded font-bold" value={numDec} onChange={(e)=>setNumDec(e.target.value)} required /></div>
              </div>
            </section>

            <section className="col-span-12 bg-yellow-50/50 p-4 rounded border border-yellow-200 space-y-3">
              <h3 className="font-bold text-yellow-800 border-b border-yellow-200 pb-1 text-xs uppercase">IV. Identificación del Importador</h3>
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500">8. TIPO ID:</label><input type="text" className="w-full border p-2 text-xs rounded" value={tipoId} onChange={(e)=>setTipoId(e.target.value)} required /></div>
                <div className="col-span-3"><label className="block text-[10px] font-bold text-gray-500">9. NÚMERO ID:</label><input type="text" className="w-full border p-2 text-xs rounded" value={numIdImp} onChange={(e)=>setNumIdImp(e.target.value)} required /></div>
                <div className="col-span-1"><label className="block text-[10px] font-bold text-gray-500">DV:</label><input type="text" className="w-full border p-2 text-xs rounded text-center" value={dv} onChange={(e)=>setDv(e.target.value)} required /></div>
                <div className="col-span-6"><label className="block text-[10px] font-bold text-gray-500">10. NOMBRE O RAZÓN SOCIAL:</label><input type="text" className="w-full border p-2 text-xs rounded font-bold" value={nombreImp} onChange={(e)=>setNombreImp(e.target.value)} required /></div>
              </div>
            </section>

            <section className="col-span-12 bg-white p-4 rounded border border-gray-300 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-800 border-b pb-1 text-xs uppercase">V. Descripción de la Operación (Giro de Divisas)</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div><label className="block text-[10px] font-bold text-gray-500">11. CÓD. MONEDA GIRO:</label><input type="text" className="w-full border p-2 text-xs rounded uppercase" value={codMoneda} onChange={(e)=>setCodMoneda(e.target.value)} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-500">12. TIPO CAMBIO:</label><input type="number" step="0.01" className="w-full border p-2 text-xs rounded" value={tipoCambio} onChange={(e)=>setTipoCambio(e.target.value)} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-500">13. NUMERAL:</label><input type="text" className="w-full border p-2 text-xs rounded font-bold text-blue-700" placeholder="2014" value={numeral} onChange={(e)=>setNumeral(e.target.value)} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-500">14. VALOR GIRO:</label><input type="number" step="0.01" className="w-full border p-2 text-xs rounded font-mono" value={valorMoneda} onChange={(e)=>setValorMoneda(e.target.value)} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-500">15. VALOR USD:</label><input type="number" step="0.01" className="w-full border p-2 text-xs rounded font-mono font-bold text-green-700" value={valorUsd} onChange={(e)=>setValorUsd(e.target.value)} required /></div>
              </div>
            </section>

            <div className="col-span-12 md:col-span-6 space-y-4">
              <section className="bg-white p-4 rounded border border-gray-300 shadow-sm">
                <h3 className="font-bold text-gray-800 border-b pb-1 text-xs uppercase mb-3">VI. Identificación del Declarante</h3>
                <div className="space-y-3">
                  <div><label className="block text-[10px] font-bold text-gray-500">16. NOMBRE:</label><input type="text" className="w-full border p-2 text-xs rounded uppercase" value={nombreDeclarante} onChange={(e)=>setNombreDeclarante(e.target.value)} required /></div>
                  <div><label className="block text-[10px] font-bold text-gray-500">17. NÚMERO DE IDENTIFICACIÓN:</label><input type="text" className="w-full border p-2 text-xs rounded" value={idDeclarante} onChange={(e)=>setIdDeclarante(e.target.value)} required /></div>
                </div>
              </section>
              
              <section className="bg-white p-4 rounded border border-gray-300 shadow-sm">
                <h3 className="font-bold text-gray-800 border-b pb-1 text-xs uppercase mb-3">VII. Información Documentos de Importación</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-[10px] font-bold text-gray-500">19. NÚMERO DIM (DIAN):</label><input type="text" className="w-full border p-2 text-xs rounded" value={dimNum} onChange={(e)=>setDimNum(e.target.value)} /></div>
                  <div><label className="block text-[10px] font-bold text-gray-500">20. VALOR USD:</label><input type="number" className="w-full border p-2 text-xs rounded" value={dimValor} onChange={(e)=>setDimValor(e.target.value)} /></div>
                </div>
              </section>
            </div>

            <div className="col-span-12 md:col-span-6">
              <section className="bg-white p-4 rounded border border-gray-300 shadow-sm h-full">
                <h3 className="font-bold text-gray-800 border-b pb-1 text-xs uppercase mb-3">Observaciones</h3>
                <textarea className="w-full border p-2 text-xs rounded h-32 resize-none outline-none focus:ring-1 focus:ring-yellow-500" value={observaciones} onChange={(e)=>setObservaciones(e.target.value)} />
              </section>
            </div>

          </div>

          <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-gray-200">
            <button type="submit" className="w-full bg-yellow-600 text-white font-black py-5 rounded-lg shadow-xl hover:bg-yellow-700 transition-all text-xl uppercase tracking-widest border-b-4 border-yellow-800">
              📥 Descargar Declaración de Cambio (Form 1)
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}