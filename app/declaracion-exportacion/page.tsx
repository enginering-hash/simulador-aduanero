"use client";

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Componente Box optimizado para el diseño DIAN
const Box = ({ num, label, span = "col-span-1", valor, onChange, rows = 1, isTextArea = false, bgClass = "bg-white" }: any) => (
  <div className={`border-r border-b border-black p-1 flex flex-col justify-start ${span} ${bgClass}`} style={{ minHeight: `${rows * 34}px` }}>
    <div className="flex items-start leading-none mb-1">
      {num && <span className="text-[8px] font-bold mr-1 text-black">{num}.</span>}
      <span className="text-[7px] leading-[8px] tracking-tight text-black">{label}</span>
    </div>
    {isTextArea ? (
      <textarea
        className="w-full outline-none text-[9px] font-mono font-bold text-black bg-transparent flex-1 resize-none uppercase"
        value={valor || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input
        type="text"
        className="w-full outline-none text-[9px] font-mono font-bold text-black bg-transparent flex-1 uppercase"
        value={valor || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </div>
);

export default function DeclaracionExportacion() {
  const router = useRouter(); 
  
  const formRef = useRef<HTMLDivElement>(null);

  const [datosReserva, setDatosReserva] = useState<any>({});
  
  const [d, setD] = useState<Record<string, string>>({
    b1: new Date().getFullYear().toString(),
    b4: "60000001234",
    b12: "35",
    b31: "02", 
    b38: "1", 
    b48: "USD",
    b50: "1", 
    b53: "104", 
    b54: "S", 
  });

  const handleChange = (box: string, value: string) => {
    setD(prev => ({ ...prev, [box]: value }));
  };

  useEffect(() => {
    const datosGuardados = localStorage.getItem('datosReserva');
    let parsed = {};
    if (datosGuardados) {
      parsed = JSON.parse(datosGuardados);
      setDatosReserva(parsed);
    }

    const borradorGuardado = sessionStorage.getItem("borrador_declaracion_exportacion_v5");
    
    if (borradorGuardado) {
      setD(JSON.parse(borradorGuardado));
    } else if (datosGuardados) {
      setD(prev => ({
        ...prev,
        b11: (parsed as any).shipperNombre || "",
        b32: (parsed as any).consignatarioNombre || "",
        b35: (parsed as any).destino || "",
        b52: (parsed as any).pesoBruto || "",
        b88: (parsed as any).pesoBruto || "",
        b93: (parsed as any).mercancia || "",
      }));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("borrador_declaracion_exportacion_v5", JSON.stringify(d));
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formRef.current) return;

    try {
      const node = formRef.current;
      
      const imgData = await toPng(node, { 
        pixelRatio: 2, 
        backgroundColor: '#ffffff',
        style: { margin: '0' }
      });
      
      const doc = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = doc.internal.pageSize.getWidth();
      const ratio = node.offsetHeight / node.offsetWidth;
      const pdfHeight = pdfWidth * ratio;
      
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save(`Declaracion_Exportacion_${d.b4 || '600'}.pdf`);
      
    } catch (error) {
      console.error("Error generando el PDF", error);
      alert("Hubo un error al generar el PDF.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-300 p-2 md:p-6 flex flex-col items-center font-sans">
      
      <div className="w-full max-w-[950px] mb-4 flex justify-between items-center overflow-x-auto">
        <button 
          onClick={() => router.back()} 
          type="button"
          className="bg-white text-[#008f39] border border-[#008f39] px-4 py-2 rounded font-bold hover:bg-green-50 transition-colors flex items-center gap-2 shadow-sm shrink-0">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-600 font-bold hover:text-gray-900 flex items-center gap-2 shrink-0">
          🏠 Menú Principal
        </Link>
      </div>

      <div className="overflow-x-auto w-full flex justify-center mb-8">
        {/* CONTENEDOR FOTOGRÁFICO CON DISEÑO DIAN CLONADO */}
        <div ref={formRef} className="w-[950px] min-w-[950px] bg-white border border-gray-400 p-6 shadow-2xl shrink-0">
          
          {/* CABECERA DIAN ACTUALIZADA CON LOGO LOCAL Y SIN BORDE NEGRO */}
          <div className="flex justify-between items-stretch mb-2 gap-4">
            {/* CAMBIO: Se eliminaron las clases 'border border-black' de este div */}
            <div className="w-1/4 p-1 flex flex-col justify-center items-center h-20">
               {/* Usamos el logo directamente desde la carpeta public */}
               <img 
                 src="/logo-dian.png" 
                 alt="Logo DIAN" 
                 className="w-full h-full object-contain"
               />
            </div>
            
            <div className="w-1/2 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-2xl font-black text-black leading-tight">Declaración de Exportación</h1>
              {/* ¡Palabra "Privada" eliminada por completo! */}
            </div>
            
            <div className="w-1/4 flex flex-col gap-1 items-end">
              <div className="border border-black p-1 flex justify-between items-center w-full bg-[#eaf5eb]">
                <span className="text-[9px] font-bold text-black ml-1">1. Año</span>
                <input type="text" className="w-12 outline-none text-xs font-mono font-bold text-right bg-transparent" value={d.b1} onChange={(e) => handleChange('b1', e.target.value)} />
              </div>
              <div className="border border-black p-1 flex flex-col w-full">
                <span className="text-[9px] font-bold text-black ml-1">4. Número de formulario</span>
                <input type="text" className="w-full outline-none text-sm font-mono font-bold text-center mt-1 bg-transparent" value={d.b4} onChange={(e) => handleChange('b4', e.target.value)} />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-12 border-t border-l border-black mt-2">
              
              {/* I. EXPORTADOR - FRANJA VERDE OFICIAL */}
              <div className="col-span-12 bg-[#008f39] text-white p-1 border-r border-b border-black font-bold text-[9px] uppercase tracking-wider">
                I. Exportador
              </div>
              <Box num="5" label="NIT" span="col-span-3" valor={d.b5} onChange={(v: string) => handleChange('b5', v)} />
              <Box num="6" label="DV" span="col-span-1" valor={d.b6} onChange={(v: string) => handleChange('b6', v)} />
              <Box num="11" label="Apellidos y nombres o razón social" span="col-span-8" valor={d.b11} onChange={(v: string) => handleChange('b11', v)} />
              
              <Box num="13" label="Dirección" span="col-span-6" valor={d.b13} onChange={(v: string) => handleChange('b13', v)} />
              <Box num="15" label="Teléfono" span="col-span-3" valor={d.b15} onChange={(v: string) => handleChange('b15', v)} />
              <Box num="12" label="Cód. Admón" span="col-span-1" valor={d.b12} onChange={(v: string) => handleChange('b12', v)} />
              <Box num="16" label="Cód. Dpto" span="col-span-1" valor={d.b16} onChange={(v: string) => handleChange('b16', v)} />
              <Box num="17" label="Cód. Ciudad" span="col-span-1" valor={d.b17} onChange={(v: string) => handleChange('b17', v)} />

              {/* II. DECLARANTE */}
              <div className="col-span-12 bg-[#008f39] text-white p-1 border-r border-b border-black font-bold text-[9px] uppercase tracking-wider">
                II. Declarante
              </div>
              <Box num="24" label="NIT" span="col-span-3" valor={d.b24} onChange={(v: string) => handleChange('b24', v)} />
              <Box num="25" label="DV" span="col-span-1" valor={d.b25} onChange={(v: string) => handleChange('b25', v)} />
              <Box num="26" label="Apellidos y nombres o razón social del declarante autorizado" span="col-span-8" valor={d.b26} onChange={(v: string) => handleChange('b26', v)} />
              
              <Box num="27" label="Tipo usuario" span="col-span-1" valor={d.b27} onChange={(v: string) => handleChange('b27', v)} />
              <Box num="28" label="Cód usuario" span="col-span-1" valor={d.b28} onChange={(v: string) => handleChange('b28', v)} />
              <Box num="29" label="No. documento de identificación" span="col-span-3" valor={d.b29} onChange={(v: string) => handleChange('b29', v)} />
              <Box num="30" label="Apellidos y nombres de quien suscribe el documento" span="col-span-7" valor={d.b30} onChange={(v: string) => handleChange('b30', v)} />

              {/* III. DESTINO Y OPERACIÓN */}
              <div className="col-span-12 bg-[#008f39] text-white p-1 border-r border-b border-black font-bold text-[9px] uppercase tracking-wider">
                III. Destino y Operación
              </div>
              <Box num="31" label="Clase exportador" span="col-span-2" valor={d.b31} onChange={(v: string) => handleChange('b31', v)} />
              <Box num="32" label="Nombre o razón social importador o consignatario" span="col-span-5" valor={d.b32} onChange={(v: string) => handleChange('b32', v)} />
              <Box num="33" label="Dirección país de destino" span="col-span-5" valor={d.b33} onChange={(v: string) => handleChange('b33', v)} />

              <Box num="34" label="Cód país dest." span="col-span-1" valor={d.b34} onChange={(v: string) => handleChange('b34', v)} />
              <Box num="35" label="Ciudad país destino" span="col-span-3" valor={d.b35} onChange={(v: string) => handleChange('b35', v)} />
              <Box num="36" label="Autorización de embarque No." span="col-span-4" valor={d.b36} onChange={(v: string) => handleChange('b36', v)} bgClass="bg-[#eaf5eb]" />
              <Box num="37" label="Fecha (AAAA MM DD)" span="col-span-4" valor={d.b37} onChange={(v: string) => handleChange('b37', v)} bgClass="bg-[#eaf5eb]" />

              <Box num="38" label="Tipo declaración" span="col-span-2" valor={d.b38} onChange={(v: string) => handleChange('b38', v)} />
              <Box num="39" label="Cód." span="col-span-1" valor={d.b39} onChange={(v: string) => handleChange('b39', v)} />
              <Box num="40" label="Cód. lugar salida" span="col-span-3" valor={d.b40} onChange={(v: string) => handleChange('b40', v)} />
              <Box num="41" label="Cód. dpto. procedencia" span="col-span-3" valor={d.b41} onChange={(v: string) => handleChange('b41', v)} />
              <Box num="42" label="DEX anterior No." span="col-span-3" valor={d.b42} onChange={(v: string) => handleChange('b42', v)} />

              {/* IV. TRANSPORTE */}
              <div className="col-span-12 bg-[#008f39] text-white p-1 border-r border-b border-black font-bold text-[9px] uppercase tracking-wider">
                IV. Transporte y Embarque
              </div>
              <Box num="43" label="Fecha DEX ant." span="col-span-2" valor={d.b43} onChange={(v: string) => handleChange('b43', v)} />
              <Box num="44" label="Adhesivo declaración imp. ant." span="col-span-4" valor={d.b44} onChange={(v: string) => handleChange('b44', v)} />
              <Box num="45" label="Fecha adh." span="col-span-2" valor={d.b45} onChange={(v: string) => handleChange('b45', v)} />
              <Box num="46" label="Cód. Mod. imp." span="col-span-2" valor={d.b46} onChange={(v: string) => handleChange('b46', v)} />
              <Box num="47" label="Cód. Ofic. Reg." span="col-span-2" valor={d.b47} onChange={(v: string) => handleChange('b47', v)} />

              <Box num="48" label="Cód. Moneda" span="col-span-1" valor={d.b48} onChange={(v: string) => handleChange('b48', v)} />
              <Box num="49" label="Total moneda neg." span="col-span-2" valor={d.b49} onChange={(v: string) => handleChange('b49', v)} />
              <Box num="50" label="Modo transp." span="col-span-1" valor={d.b50} onChange={(v: string) => handleChange('b50', v)} />
              <Box num="51" label="Cód. bandera" span="col-span-1" valor={d.b51} onChange={(v: string) => handleChange('b51', v)} />
              <Box num="52" label="Peso bruto kgs" span="col-span-2" valor={d.b52} onChange={(v: string) => handleChange('b52', v)} bgClass="bg-[#eaf5eb]" />
              <Box num="53" label="Modalidad" span="col-span-1" valor={d.b53} onChange={(v: string) => handleChange('b53', v)} />
              <Box num="54" label="Forma pago" span="col-span-1" valor={d.b54} onChange={(v: string) => handleChange('b54', v)} />
              <Box num="55" label="Cant. pagos ant." span="col-span-1" valor={d.b55} onChange={(v: string) => handleChange('b55', v)} />
              <Box num="56" label="Fecha primer pago" span="col-span-2" valor={d.b56} onChange={(v: string) => handleChange('b56', v)} />

              <Box num="57" label="Cód. embarque" span="col-span-3" valor={d.b57} onChange={(v: string) => handleChange('b57', v)} />
              <Box num="58" label="Consolidación" span="col-span-3" valor={d.b58} onChange={(v: string) => handleChange('b58', v)} />
              <Box num="59" label="Cant. embarques" span="col-span-3" valor={d.b59} onChange={(v: string) => handleChange('b59', v)} />
              <Box num="60" label="Cód. datos" span="col-span-3" valor={d.b60} onChange={(v: string) => handleChange('b60', v)} />

              {/* V. EMBALAJES */}
              <div className="col-span-12 bg-[#008f39] text-white p-1 border-r border-b border-black font-bold text-[9px] uppercase tracking-wider">
                V. Embalajes y Vistos Buenos
              </div>
              <Box num="61" label="Cód. Emb" span="col-span-2" valor={d.b61} onChange={(v: string) => handleChange('b61', v)} />
              <Box num="62" label="Cant." span="col-span-2" valor={d.b62} onChange={(v: string) => handleChange('b62', v)} />
              <Box num="63" label="Marcas y números" span="col-span-4" valor={d.b63} onChange={(v: string) => handleChange('b63', v)} />
              <Box num="64" label="Cert. origen" span="col-span-2" valor={d.b64} onChange={(v: string) => handleChange('b64', v)} />
              <Box num="65" label="Cuál" span="col-span-2" valor={d.b65} onChange={(v: string) => handleChange('b65', v)} />

              <Box num="74" label="Visto bueno entidad" span="col-span-3" valor={d.b74} onChange={(v: string) => handleChange('b74', v)} />
              <Box num="75" label="No. VB" span="col-span-2" valor={d.b75} onChange={(v: string) => handleChange('b75', v)} />
              <Box num="76" label="Fecha VB" span="col-span-2" valor={d.b76} onChange={(v: string) => handleChange('b76', v)} />
              <Box num="80" label="Cód. Tránsito" span="col-span-1" valor={d.b80} onChange={(v: string) => handleChange('b80', v)} />
              <Box num="81" label="Admón. Embarque" span="col-span-2" valor={d.b81} onChange={(v: string) => handleChange('b81', v)} />
              <Box num="82" label="Localización" span="col-span-2" valor={d.b82} onChange={(v: string) => handleChange('b82', v)} />

              {/* VI. ITEM */}
              <div className="col-span-12 bg-[#008f39] text-white p-1 border-r border-b border-black font-bold text-[9px] uppercase tracking-wider">
                VI. Ítem
              </div>
              <Box num="83" label="Subpartida arancelaria" span="col-span-3" valor={d.b83} onChange={(v: string) => handleChange('b83', v)} />
              <Box num="84" label="Dpto. orig." span="col-span-1" valor={d.b84} onChange={(v: string) => handleChange('b84', v)} />
              <Box num="85" label="No. Factura" span="col-span-3" valor={d.b85} onChange={(v: string) => handleChange('b85', v)} />
              <Box num="86" label="Cód. UM" span="col-span-1" valor={d.b86} onChange={(v: string) => handleChange('b86', v)} />
              <Box num="87" label="Cantidad" span="col-span-2" valor={d.b87} onChange={(v: string) => handleChange('b87', v)} />
              <Box num="88" label="Peso neto kgs" span="col-span-2" valor={d.b88} onChange={(v: string) => handleChange('b88', v)} />
              
              <Box num="89" label="Valor FOB USD" span="col-span-3" valor={d.b89} onChange={(v: string) => handleChange('b89', v)} />
              <Box num="90" label="Valor agregado Nal. USD" span="col-span-4" valor={d.b90} onChange={(v: string) => handleChange('b90', v)} />
              <Box num="91" label="C.I.P." span="col-span-2" valor={d.b91} onChange={(v: string) => handleChange('b91', v)} />
              <Box num="92" label="Apl. casilla 66" span="col-span-3" valor={d.b92} onChange={(v: string) => handleChange('b92', v)} />
              
              <Box num="93" label="Descripción de las mercancías (No inicie con arancel, incluya marcas, seriales)" span="col-span-12" rows={3} isTextArea={true} valor={d.b93} onChange={(v: string) => handleChange('b93', v)} />

              {/* VII. TOTALES */}
              <div className="col-span-12 bg-[#008f39] text-white p-1 border-r border-b border-black font-bold text-[9px] uppercase tracking-wider">
                VII. Totales
              </div>
              <Box num="94" label="Cant. subpartidas" span="col-span-2" valor={d.b94} onChange={(v: string) => handleChange('b94', v)} />
              <Box num="95" label="Hojas anexas Nos." span="col-span-2" valor={d.b95} onChange={(v: string) => handleChange('b95', v)} />
              <Box num="96" label="Total peso neto kgs" span="col-span-2" valor={d.b96} onChange={(v: string) => handleChange('b96', v)} />
              <Box num="97" label="Total valor FOB USD" span="col-span-2" valor={d.b97} onChange={(v: string) => handleChange('b97', v)} bgClass="bg-[#eaf5eb]" />
              <Box num="98" label="Total val agregado" span="col-span-2" valor={d.b98} onChange={(v: string) => handleChange('b98', v)} />
              <Box num="99" label="Cant. hojas anexas" span="col-span-2" valor={d.b99} onChange={(v: string) => handleChange('b99', v)} />
              
              <Box num="100" label="Valor fletes USD" span="col-span-2" valor={d.b100} onChange={(v: string) => handleChange('b100', v)} bgClass="bg-[#eaf5eb]" />
              <Box num="101" label="Valor seguros USD" span="col-span-2" valor={d.b101} onChange={(v: string) => handleChange('b101', v)} bgClass="bg-[#eaf5eb]" />
              <Box num="102" label="Otros gastos USD" span="col-span-2" valor={d.b102} onChange={(v: string) => handleChange('b102', v)} />
              <Box num="103" label="Valor total expo USD" span="col-span-3" valor={d.b103} onChange={(v: string) => handleChange('b103', v)} bgClass="bg-[#d4edd9]" />
              <Box num="104" label="Valor a reintegrar USD" span="col-span-3" valor={d.b104} onChange={(v: string) => handleChange('b104', v)} />

              {/* VIII. USO DIAN */}
              <div className="col-span-12 bg-[#008f39] text-white p-1 border-r border-b border-black font-bold text-[9px] uppercase tracking-wider">
                VIII. Certificación de Embarque (Uso DIAN)
              </div>
              <Box num="105" label="Procede emb?" span="col-span-2" valor={d.b105} onChange={(v: string) => handleChange('b105', v)} bgClass="bg-gray-100" />
              <Box num="106" label="Año Mes Día" span="col-span-2" valor={d.b106} onChange={(v: string) => handleChange('b106', v)} bgClass="bg-gray-100" />
              <Box num="107" label="Auto y acta No." span="col-span-3" valor={d.b107} onChange={(v: string) => handleChange('b107', v)} bgClass="bg-gray-100" />
              <Box num="108" label="Nombre inspector" span="col-span-3" valor={d.b108} onChange={(v: string) => handleChange('b108', v)} bgClass="bg-gray-100" />
              <Box num="109" label="C.C. Inspector" span="col-span-2" valor={d.b109} onChange={(v: string) => handleChange('b109', v)} bgClass="bg-gray-100" />

              <Box num="110" label="No. Manifiesto carga" span="col-span-2" valor={d.b110} onChange={(v: string) => handleChange('b110', v)} bgClass="bg-gray-100" />
              <Box num="111" label="Año Mes Día" span="col-span-2" valor={d.b111} onChange={(v: string) => handleChange('b111', v)} bgClass="bg-gray-100" />
              <Box num="112" label="Cód Admón" span="col-span-1" valor={d.b112} onChange={(v: string) => handleChange('b112', v)} bgClass="bg-gray-100" />
              <Box num="113" label="Bultos" span="col-span-1" valor={d.b113} onChange={(v: string) => handleChange('b113', v)} bgClass="bg-gray-100" />
              <Box num="114" label="Peso kgs" span="col-span-2" valor={d.b114} onChange={(v: string) => handleChange('b114', v)} bgClass="bg-gray-100" />
              <Box num="115" label="Identificación medio transporte" span="col-span-4" valor={d.b115} onChange={(v: string) => handleChange('b115', v)} bgClass="bg-gray-100" />

              <Box num="116" label="Observaciones" span="col-span-12" rows={2} isTextArea={true} valor={d.b116} onChange={(v: string) => handleChange('b116', v)} bgClass="bg-gray-100" />

              <Box num="117" label="DEX definitiva No." span="col-span-3" valor={d.b117} onChange={(v: string) => handleChange('b117', v)} bgClass="bg-gray-100" />
              <Box num="118" label="Fecha" span="col-span-3" valor={d.b118} onChange={(v: string) => handleChange('b118', v)} bgClass="bg-gray-100" />
              <Box num="119" label="Nombre" span="col-span-3" valor={d.b119} onChange={(v: string) => handleChange('b119', v)} bgClass="bg-gray-100" />
              <Box num="120" label="C.C." span="col-span-3" valor={d.b120} onChange={(v: string) => handleChange('b120', v)} bgClass="bg-gray-100" />
              
            </div>
          </form>
        </div>
      </div>

      <div className="w-full max-w-[950px] flex flex-col md:flex-row gap-4 mt-2 mb-8">
        <button onClick={handleSubmit} type="button" className="flex-1 bg-[#008f39] text-white font-bold py-3 rounded shadow-md hover:bg-[#006f2c] transition-all text-sm border-b-4 border-[#005220]">
          📥 Descargar Declaración de Exportación (PDF)
        </button>
        <Link href="/factura" className="flex-1 bg-gray-800 text-white font-bold py-3 rounded shadow-md hover:bg-black text-center text-sm border-b-4 border-gray-900 flex items-center justify-center">
          Paso 8: Factura Comercial Final →
        </Link>
      </div>

    </main>
  );
}