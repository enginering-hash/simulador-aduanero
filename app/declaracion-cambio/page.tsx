"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

// COMPONENTE PARA DIBUJAR LAS CASILLAS IGUAL AL FORMULARIO REAL
const Field = ({ num, label, value, onChange, colSpan = 1, width = "w-full", isSignature = false }: any) => {
  return (
    <div 
      className={`border-2 border-black p-1 flex flex-col justify-between bg-white ${isSignature ? 'h-12' : ''}`}
      style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }}
    >
      <div className="flex gap-1 text-[10px] text-black font-bold leading-tight mb-1">
        {num && <span>{num}.</span>}
        <span className="leading-tight">{label}</span>
      </div>
      {!isSignature && (
        <input 
          type="text" 
          className={`${width} text-xs font-bold text-black outline-none bg-transparent`} 
          value={value || ""} 
          onChange={onChange} 
        />
      )}
    </div>
  );
};

export default function DeclaracionCambio() {
  const router = useRouter(); 

  // --- I. TIPO DE OPERACIÓN ---
  const [tipoOperacion, setTipoOperacion] = useState("");

  // --- II. IDENTIFICACIÓN DE LA DECLARACIÓN ---
  const [nitImc, setNitImc] = useState("");
  const [fechaDec, setFechaDec] = useState("");
  const [numDec, setNumDec] = useState("");

  // --- III. IDENTIFICACIÓN DE LA DECLARACIÓN DE CAMBIO ANTERIOR ---
  const [nitImcAnt, setNitImcAnt] = useState("");
  const [fechaDecAnt, setFechaDecAnt] = useState("");
  const [numDecAnt, setNumDecAnt] = useState("");

  // --- IV. IDENTIFICACIÓN DEL IMPORTADOR ---
  const [tipoId, setTipoId] = useState("");
  const [numIdImp, setNumIdImp] = useState("");
  const [dv, setDv] = useState("");
  const [nombreImp, setNombreImp] = useState("");

  // --- V. DESCRIPCIÓN DE LA OPERACIÓN ---
  const [codMoneda, setCodMoneda] = useState("");
  const [tipoCambio, setTipoCambio] = useState("");
  const [numeral, setNumeral] = useState("");
  const [valorMoneda, setValorMoneda] = useState("");
  const [valorUsd, setValorUsd] = useState("");

  // --- VI. IDENTIFICACIÓN DEL DECLARANTE ---
  const [nombreDeclarante, setNombreDeclarante] = useState("");
  const [idDeclarante, setIdDeclarante] = useState("");

  // --- OBSERVACIONES ---
  const [observaciones, setObservaciones] = useState("");

  // --- VII. INFORMACIÓN DOCUMENTOS DE IMPORTACIÓN (DIM) ---
  const [dims, setDims] = useState([
    { num1: "", val1: "", num2: "", val2: "" },
    { num1: "", val1: "", num2: "", val2: "" },
    { num1: "", val1: "", num2: "", val2: "" },
  ]);

  // CARGAR LOS DATOS AL ABRIR LA PÁGINA (SOLO SI HAY BORRADOR)
  useEffect(() => {
    const borradorGuardado = sessionStorage.getItem("borrador_declaracion_cambio_v4");
    
    if (borradorGuardado) {
      const d = JSON.parse(borradorGuardado);
      setTipoOperacion(d.tipoOperacion || "");
      setNitImc(d.nitImc || ""); setFechaDec(d.fechaDec || ""); setNumDec(d.numDec || "");
      setNitImcAnt(d.nitImcAnt || ""); setFechaDecAnt(d.fechaDecAnt || ""); setNumDecAnt(d.numDecAnt || "");
      setTipoId(d.tipoId || ""); setNumIdImp(d.numIdImp || ""); setDv(d.dv || ""); setNombreImp(d.nombreImp || "");
      setCodMoneda(d.codMoneda || ""); setTipoCambio(d.tipoCambio || ""); setNumeral(d.numeral || ""); setValorMoneda(d.valorMoneda || ""); setValorUsd(d.valorUsd || "");
      setNombreDeclarante(d.nombreDeclarante || ""); setIdDeclarante(d.idDeclarante || "");
      setObservaciones(d.observaciones || "");
      if(d.dims) setDims(d.dims);
    } 
    // SIN VALORES POR DEFECTO. TODO INICIA EN BLANCO.
  }, []); 

  // GUARDAR BORRADOR CONTINUAMENTE
  useEffect(() => {
    const d = {
      tipoOperacion, nitImc, fechaDec, numDec, nitImcAnt, fechaDecAnt, numDecAnt,
      tipoId, numIdImp, dv, nombreImp, codMoneda, tipoCambio, numeral, valorMoneda,
      valorUsd, nombreDeclarante, idDeclarante, observaciones, dims
    };
    sessionStorage.setItem("borrador_declaracion_cambio_v4", JSON.stringify(d));
  });

  const actualizarDim = (index: number, campo: string, valor: string) => {
    const nuevosDims = [...dims];
    nuevosDims[index] = { ...nuevosDims[index], [campo]: valor };
    setDims(nuevosDims);
  };

  const generarPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    const doc = new jsPDF("portrait", "mm", "a4");

    try {
        const imgPath = "/logo_banrep.png"; 
        const response = await fetch(imgPath);
        
        if(response.ok){
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64data = reader.result as string;
                // Logo en la esquina superior izquierda
                doc.addImage(base64data, 'PNG', 12, 10, 22, 22); 
                generarContenidoPDF(doc);
            }
            reader.readAsDataURL(blob);
            return; 
        } else {
            throw new Error("Logo no encontrado");
        }
    } catch (err) {
        // Logo de respaldo dibujado
        doc.setFont("helvetica", "bold");
        doc.setLineWidth(0.5);
        doc.circle(23, 20, 10);
        doc.setFontSize(6);
        doc.text("BANCO DE LA", 23, 17, { align: "center" });
        doc.text("REPUBLICA", 23, 21, { align: "center" });
        doc.text("COLOMBIA", 23, 25, { align: "center" });
        generarContenidoPDF(doc);
    }
  };

  const generarContenidoPDF = (doc: jsPDF) => {
    doc.setDrawColor(0, 0, 0); // Color Negro para líneas y bordes
    doc.setLineWidth(0.6); // Líneas gruesas como en el formulario real

    // Función para dibujar cajas de formulario
    const drawBox = (x: number, y: number, w: number, h: number, num: string, title: string, value: string, textOffset = 2.5) => {
      doc.rect(x, y, w, h);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      if (num) {
        doc.text(`${num}.`, x + 1, y + 3.5);
        doc.setFont("helvetica", "normal");
        doc.text(title, x + 6, y + 3.5);
      } else {
        doc.setFont("helvetica", "normal");
        doc.text(title, x + 1, y + 3.5);
      }
      if (value) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(String(value), x + textOffset, y + h - 2);
      }
    };

    // --- ENCABEZADO ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14); 
    doc.text("Declaración de Cambio por Importaciones de Bienes", 95, 17, { align: "center" });
    doc.setFontSize(12);
    doc.text("Formulario No. 1", 95, 23, { align: "center" });
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Circular Reglamentaria Externa DCIN-83 de agosto 9 de 2011", 95, 28, { align: "center" });
    
    // Top Derecho (Tipo de Operación)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Formulario No. 1", 195, 12, { align: "right" });
    
    doc.setFontSize(9);
    doc.text("I. TIPO DE OPERACIÓN", 155, 18);
    drawBox(155, 20, 45, 8, "1", "Número:", tipoOperacion, 15);

    // --- II. IDENTIFICACIÓN DE LA DECLARACIÓN ---
    let y = 35;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("II. IDENTIFICACIÓN DE LA DECLARACIÓN", 10, y);
    drawBox(10, y + 2, 115, 8, "2", "Nit del I.M.C o Código cuenta de compensación", nitImc);
    drawBox(125, y + 2, 40, 8, "3", "Fecha AAAA-MM-DD", fechaDec);
    drawBox(165, y + 2, 35, 8, "4", "Número", numDec);

    // --- III. DECLARACIÓN DE CAMBIO ANTERIOR ---
    y += 16;
    doc.text("III. IDENTIFICACIÓN DE LA DECLARACIÓN DE CAMBIO ANTERIOR", 10, y);
    drawBox(10, y + 2, 115, 8, "5", "Nit del I.M.C o Código cuenta de compensación", nitImcAnt);
    drawBox(125, y + 2, 40, 8, "6", "Fecha AAAA-MM-DD", fechaDecAnt);
    drawBox(165, y + 2, 35, 8, "7", "Número", numDecAnt);

    // --- IV. IDENTIFICACIÓN DEL IMPORTADOR ---
    y += 16;
    doc.text("IV. IDENTIFICACIÓN DEL IMPORTADOR", 10, y);
    drawBox(10, y + 2, 20, 8, "8", "Tipo", tipoId);
    drawBox(30, y + 2, 50, 8, "9", "Número de identificación", numIdImp);
    drawBox(80, y + 2, 15, 8, "", "DV", dv);
    drawBox(95, y + 2, 105, 8, "10", "Nombre o razón social", nombreImp);

    // --- V. DESCRIPCIÓN DE LA OPERACIÓN ---
    y += 16;
    doc.text("V. DESCRIPCIÓN DE LA OPERACIÓN", 10, y);
    drawBox(10, y + 2, 35, 8, "11", "Código moneda de giro", codMoneda);
    drawBox(45, y + 2, 35, 8, "12", "Tipo de cambio a USD", tipoCambio);
    drawBox(80, y + 2, 25, 8, "13", "Numeral", numeral);
    drawBox(105, y + 2, 45, 8, "14", "Valor moneda giro", valorMoneda);
    drawBox(150, y + 2, 50, 8, "15", "Valor USD", valorUsd);

    // --- JURAMENTO ---
    y += 16;
    const textLegal = "Para los fines previstos en el articulo 83 de la constitución política de Colombia, declaro bajo la gravedad de juramento que los conceptos, cantidades y demás datos consignados en el presente formulario son correctos y la fiel expresión de la verdad.";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(doc.splitTextToSize(textLegal, 190), 10, y);

    // --- VI. IDENTIFICACIÓN DEL DECLARANTE ---
    y += 12;
    doc.setFontSize(9);
    doc.text("VI. IDENTIFICACIÓN DEL DECLARANTE", 10, y);
    drawBox(10, y + 2, 95, 10, "16", "Nombre", nombreDeclarante);
    drawBox(105, y + 2, 45, 10, "17", "Número de identificación", idDeclarante);
    drawBox(150, y + 2, 50, 10, "18", "Firma", ""); // Firma en blanco

    // --- OBSERVACIONES ---
    y += 18;
    doc.setLineWidth(0.6);
    doc.roundedRect(10, y, 190, 40, 4, 4);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Observaciones:", 12, y + 5);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(observaciones, 185), 12, y + 10);

    // --- VII. INFORMACIÓN DIAN ---
    y += 50;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("INFORMACIÓN REQUERIDA POR LA DIAN:", 10, y);
    doc.text("VII. INFORMACIÓN DOCUMENTOS DE IMPORTACIÓN", 10, y + 6);

    const tblY = y + 8;
    // Cabecera Tabla
    drawBox(10, tblY, 47.5, 6, "19", "Número", "");
    drawBox(57.5, tblY, 47.5, 6, "20", "Valor USD", "");
    drawBox(105, tblY, 47.5, 6, "19", "Número", "");
    drawBox(152.5, tblY, 47.5, 6, "20", "Valor USD", "");

    // Filas Tabla
    let rowY = tblY + 6;
    dims.forEach((d) => {
        doc.rect(10, rowY, 47.5, 6); doc.text(d.num1, 12, rowY + 4);
        doc.rect(57.5, rowY, 47.5, 6); doc.text(d.val1, 59.5, rowY + 4);
        doc.rect(105, rowY, 47.5, 6); doc.text(d.num2, 107, rowY + 4);
        doc.rect(152.5, rowY, 47.5, 6); doc.text(d.val2, 154.5, rowY + 4);
        rowY += 6;
    });

    doc.save(`Formulario_1_Importaciones_${numDec || 'Blanco'}.pdf`);
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
        
        {/* HEADER VISUAL */}
        <div className="bg-white p-6 border-b-4 border-black flex items-center gap-6">
          <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center border-4 border-black shadow text-[9px] font-black leading-tight text-center">
            <span>BANCO DE LA</span><span>REPUBLICA</span>
          </div>
          <div>
            <h2 className="font-black text-2xl text-black uppercase tracking-tight">Declaración de Cambio por Importaciones</h2>
            <h3 className="font-bold text-lg text-gray-700">Formulario No. 1</h3>
            <p className="text-xs text-gray-500 font-bold mt-1">Circular Reglamentaria Externa DCIN-83</p>
          </div>
        </div>

        <form onSubmit={generarPDF} className="p-6 md:p-8 space-y-6">
          
          <div className="grid grid-cols-12 gap-2">
            
            {/* SECCIÓN I */}
            <div className="col-span-12 flex justify-end mb-2">
                <div className="w-64 border-2 border-black p-2 bg-gray-50">
                    <h3 className="font-bold text-black text-xs uppercase mb-1">I. Tipo de Operación</h3>
                    <Field num="1" label="Número:" value={tipoOperacion} onChange={(e:any)=>setTipoOperacion(e.target.value)} />
                </div>
            </div>

            {/* SECCIÓN II */}
            <section className="col-span-12 space-y-1 mb-4">
              <h3 className="font-bold text-black text-sm uppercase">II. Identificación de la Declaración</h3>
              <div className="grid grid-cols-12 gap-1">
                <Field colSpan={6} num="2" label="Nit del I.M.C o Código cuenta de compensación" value={nitImc} onChange={(e:any)=>setNitImc(e.target.value)} />
                <Field colSpan={3} num="3" label="Fecha AAAA-MM-DD" value={fechaDec} onChange={(e:any)=>setFechaDec(e.target.value)} />
                <Field colSpan={3} num="4" label="Número" value={numDec} onChange={(e:any)=>setNumDec(e.target.value)} />
              </div>
            </section>

            {/* SECCIÓN III */}
            <section className="col-span-12 space-y-1 mb-4">
              <h3 className="font-bold text-black text-sm uppercase">III. Identificación de la Declaración de Cambio Anterior</h3>
              <div className="grid grid-cols-12 gap-1">
                <Field colSpan={6} num="5" label="Nit del I.M.C o Código cuenta de compensación" value={nitImcAnt} onChange={(e:any)=>setNitImcAnt(e.target.value)} />
                <Field colSpan={3} num="6" label="Fecha AAAA-MM-DD" value={fechaDecAnt} onChange={(e:any)=>setFechaDecAnt(e.target.value)} />
                <Field colSpan={3} num="7" label="Número" value={numDecAnt} onChange={(e:any)=>setNumDecAnt(e.target.value)} />
              </div>
            </section>

            {/* SECCIÓN IV */}
            <section className="col-span-12 space-y-1 mb-4">
              <h3 className="font-bold text-black text-sm uppercase">IV. Identificación del Importador</h3>
              <div className="grid grid-cols-12 gap-1">
                <Field colSpan={2} num="8" label="Tipo" value={tipoId} onChange={(e:any)=>setTipoId(e.target.value)} />
                <Field colSpan={3} num="9" label="Número de identificación" value={numIdImp} onChange={(e:any)=>setNumIdImp(e.target.value)} />
                <Field colSpan={1} label="DV" value={dv} onChange={(e:any)=>setDv(e.target.value)} />
                <Field colSpan={6} num="10" label="Nombre o razón social" value={nombreImp} onChange={(e:any)=>setNombreImp(e.target.value)} />
              </div>
            </section>

            {/* SECCIÓN V */}
            <section className="col-span-12 space-y-1 mb-4">
              <h3 className="font-bold text-black text-sm uppercase">V. Descripción de la Operación</h3>
              <div className="grid grid-cols-12 gap-1">
                <Field colSpan={2} num="11" label="Cód. moneda de giro" value={codMoneda} onChange={(e:any)=>setCodMoneda(e.target.value)} />
                <Field colSpan={3} num="12" label="Tipo de cambio a USD" value={tipoCambio} onChange={(e:any)=>setTipoCambio(e.target.value)} />
                <Field colSpan={2} num="13" label="Numeral" value={numeral} onChange={(e:any)=>setNumeral(e.target.value)} />
                <Field colSpan={3} num="14" label="Valor moneda giro" value={valorMoneda} onChange={(e:any)=>setValorMoneda(e.target.value)} />
                <Field colSpan={2} num="15" label="Valor USD" value={valorUsd} onChange={(e:any)=>setValorUsd(e.target.value)} />
              </div>
              <p className="text-[10px] font-bold text-gray-700 mt-2 text-justify">
                Para los fines previstos en el articulo 83 de la constitución política de Colombia, declaro bajo la gravedad de juramento que los conceptos, cantidades y demás datos consignados en el presente formulario son correctos y la fiel expresión de la verdad.
              </p>
            </section>

            {/* SECCIÓN VI */}
            <section className="col-span-12 space-y-1 mb-4">
              <h3 className="font-bold text-black text-sm uppercase">VI. Identificación del Declarante</h3>
              <div className="grid grid-cols-12 gap-1">
                <Field colSpan={5} num="16" label="Nombre" value={nombreDeclarante} onChange={(e:any)=>setNombreDeclarante(e.target.value)} />
                <Field colSpan={4} num="17" label="Número de identificación" value={idDeclarante} onChange={(e:any)=>setIdDeclarante(e.target.value)} />
                <Field colSpan={3} num="18" label="Firma" isSignature={true} />
              </div>
            </section>

            {/* OBSERVACIONES */}
            <section className="col-span-12 mb-6">
              <div className="border-2 border-black rounded-xl p-3 bg-white">
                <h3 className="font-bold text-black text-xs uppercase mb-1">Observaciones:</h3>
                <textarea className="w-full text-xs outline-none resize-none h-20 bg-transparent" value={observaciones} onChange={(e)=>setObservaciones(e.target.value)} />
              </div>
            </section>

            {/* SECCIÓN VII */}
            <section className="col-span-12 space-y-1">
              <h3 className="font-bold text-black text-sm uppercase">INFORMACIÓN REQUERIDA POR LA DIAN:</h3>
              <h3 className="font-bold text-black text-sm uppercase mb-2">VII. Información Documentos de Importación</h3>
              
              {/* Tabla DIM Manual */}
              <div className="border-2 border-black bg-white">
                <div className="grid grid-cols-4 bg-gray-100 border-b-2 border-black text-[10px] font-bold text-black divide-x-2 divide-black">
                  <div className="p-1"><span className="mr-1">19.</span>Número</div>
                  <div className="p-1"><span className="mr-1">20.</span>Valor USD</div>
                  <div className="p-1"><span className="mr-1">19.</span>Número</div>
                  <div className="p-1"><span className="mr-1">20.</span>Valor USD</div>
                </div>
                {dims.map((dim, index) => (
                  <div key={index} className="grid grid-cols-4 text-xs divide-x-2 divide-black border-b last:border-b-0 border-black">
                    <input type="text" className="p-1 outline-none bg-transparent" value={dim.num1} onChange={(e)=>actualizarDim(index, 'num1', e.target.value)} />
                    <input type="text" className="p-1 outline-none bg-transparent" value={dim.val1} onChange={(e)=>actualizarDim(index, 'val1', e.target.value)} />
                    <input type="text" className="p-1 outline-none bg-transparent" value={dim.num2} onChange={(e)=>actualizarDim(index, 'num2', e.target.value)} />
                    <input type="text" className="p-1 outline-none bg-transparent" value={dim.val2} onChange={(e)=>actualizarDim(index, 'val2', e.target.value)} />
                  </div>
                ))}
              </div>
            </section>

          </div>

          <div className="flex flex-col gap-4 mt-10 pt-6 border-t-4 border-black">
            <button type="submit" className="w-full bg-black text-white font-black py-5 rounded shadow-xl hover:bg-gray-800 transition-all text-xl uppercase tracking-widest">
              📥 Descargar Declaración de Cambio
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}