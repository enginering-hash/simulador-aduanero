"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function ListaEmpaque() {
  const router = useRouter(); 

  // --- NÚMEROS Y FECHAS ---
  const [numeroLista, setNumeroLista] = useState("");
  const [fechaEmision, setFechaEmision] = useState("");

  // --- DATOS DE IDENTIFICACIÓN: EXPORTADOR ---
  const [expRazonSocial, setExpRazonSocial] = useState("");
  const [expEmail, setExpEmail] = useState("");
  const [expTelefono, setExpTelefono] = useState("");
  const [expNit, setExpNit] = useState("");
  const [expDireccion, setExpDireccion] = useState("");
  const [expCiudadPais, setExpCiudadPais] = useState("");

  // --- DATOS DE IDENTIFICACIÓN: IMPORTADOR ---
  const [impRazonSocial, setImpRazonSocial] = useState("");
  const [impEmail, setImpEmail] = useState("");
  const [impTelefono, setImpTelefono] = useState("");
  const [impNit, setImpNit] = useState("");
  const [impDireccion, setImpDireccion] = useState("");
  const [impCiudadPais, setImpCiudadPais] = useState("");

  // --- CONDICIONES Y LOGÍSTICA ---
  const [incoterm, setIncoterm] = useState("");
  const [formaPago, setFormaPago] = useState("");
  const [puertoEmbarque, setPuertoEmbarque] = useState("");
  const [puertoDestino, setPuertoDestino] = useState("");

  // --- DETALLE DE LA CARGA (TABLA) ---
  const [productos, setProductos] = useState([
    { referencia: "", descripcion: "", subpartida: "", pesoBruto: "", pesoNeto: "", cajas: "", m3PorCaja: "", totalM3: "" }
  ]);
  const [observaciones, setObservaciones] = useState("");

  // CARGAR LOS DATOS AL ABRIR LA PÁGINA
  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0];
    const borradorGuardado = sessionStorage.getItem("borrador_lista_empaque_v8"); // Cambio de version para limpiar
    
    const datosFactura = sessionStorage.getItem("borrador_factura_comercial_v3");
    let fData = datosFactura ? JSON.parse(datosFactura) : null;

    let plActual = "";

    if (borradorGuardado) {
      const datos = JSON.parse(borradorGuardado);
      plActual = datos.numeroLista || "";
      setFechaEmision(datos.fechaEmision || hoy);
      
      setExpRazonSocial(datos.expRazonSocial || "");
      setExpEmail(datos.expEmail || "");
      setExpTelefono(datos.expTelefono || "");
      setExpNit(datos.expNit || "");
      setExpDireccion(datos.expDireccion || "");
      setExpCiudadPais(datos.expCiudadPais || "");

      setImpRazonSocial(datos.impRazonSocial || "");
      setImpEmail(datos.impEmail || "");
      setImpTelefono(datos.impTelefono || "");
      setImpNit(datos.impNit || "");
      setImpDireccion(datos.impDireccion || "");
      setImpCiudadPais(datos.impCiudadPais || "");

      setIncoterm(datos.incoterm || "");
      setFormaPago(datos.formaPago || "");
      setPuertoEmbarque(datos.puertoEmbarque || "");
      setPuertoDestino(datos.puertoDestino || "");

      if (datos.productos && datos.productos.length > 0) setProductos(datos.productos);
      setObservaciones(datos.observaciones || "");
    } else {
      setFechaEmision(hoy);
      if(fData) {
        setExpRazonSocial(fData.expRazonSocial || "");
        setExpNit(fData.expNit || "");
        setExpDireccion(fData.expDireccion || "");
        setExpCiudadPais(fData.expCiudadPais || "");
        setExpEmail(fData.expEmail || "");
        setExpTelefono(fData.expTelefono || "");

        setImpRazonSocial(fData.impRazonSocial || "");
        setImpNit(fData.impNit || "");
        setImpDireccion(fData.impDireccion || "");
        setImpCiudadPais(fData.impCiudadPais || "");
        setImpEmail(fData.impEmail || "");
        setImpTelefono(fData.impTelefono || "");
        
        setIncoterm(fData.incoterm || "");
      }
    }

    if (!plActual) {
      const año = new Date().getFullYear().toString().slice(-2);
      plActual = `PL-${Math.floor(100 + Math.random() * 900)}/${año}`;
    }
    setNumeroLista(plActual);
  }, []);

  // GUARDAR LOS DATOS
  useEffect(() => {
    if (numeroLista) {
      const borradorActual = {
        numeroLista, fechaEmision, 
        expRazonSocial, expEmail, expTelefono, expNit, expDireccion, expCiudadPais,
        impRazonSocial, impEmail, impTelefono, impNit, impDireccion, impCiudadPais,
        incoterm, formaPago, puertoEmbarque, puertoDestino,
        productos, observaciones
      };
      sessionStorage.setItem("borrador_lista_empaque_v8", JSON.stringify(borradorActual));
    }
  });

  const agregarProducto = () => {
    setProductos([...productos, { referencia: "", descripcion: "", subpartida: "", pesoBruto: "", pesoNeto: "", cajas: "", m3PorCaja: "", totalM3: "" }]);
  };

  const actualizarProducto = (index: number, campo: string, valor: string) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index] = { ...nuevosProductos[index], [campo]: valor };
    
    // Autocalcular Total m3 si se cambian las cajas o los m3 por caja
    if (campo === 'cajas' || campo === 'm3PorCaja') {
      const cantidadCajas = Number(campo === 'cajas' ? valor : nuevosProductos[index].cajas || 0);
      const metrosPorCaja = Number(campo === 'm3PorCaja' ? valor : nuevosProductos[index].m3PorCaja || 0);
      if (cantidadCajas > 0 && metrosPorCaja > 0) {
        nuevosProductos[index].totalM3 = (cantidadCajas * metrosPorCaja).toFixed(3);
      }
    }

    setProductos(nuevosProductos);
  };

  const eliminarProducto = (indexToRemove: number) => {
    if (productos.length === 1) return;
    setProductos(productos.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    const doc = new jsPDF();

    // --- ENCABEZADO ---
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(expRazonSocial.toUpperCase() || "NOMBRE DEL EXPORTADOR", 20, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(expDireccion || "Dirección del Exportador", 20, 26);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105); 
    doc.text("PACKING LIST / LISTA DE EMPAQUE", 190, 22, { align: "right" });
    
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`N° Packing List: ${numeroLista}`, 190, 30, { align: "right" });
    doc.text(`Fecha de Emisión: ${fechaEmision}`, 190, 36, { align: "right" });

    const lineY = 45;
    doc.setDrawColor(150, 150, 150);
    doc.line(20, lineY, 190, lineY);
    
    // --- BLOQUE DE COLUMNAS ---
    doc.setFont("helvetica", "bold");
    doc.text("Exportador:", 20, lineY + 7);
    doc.setFont("helvetica", "normal");
    doc.text(`Razón Social: ${expRazonSocial}`, 20, lineY + 13);
    doc.text(`NIT: ${expNit}`, 20, lineY + 19);
    doc.text(`Dirección: ${expDireccion}`, 20, lineY + 25);
    doc.text(`Ciudad/País: ${expCiudadPais}`, 20, lineY + 31);
    doc.text(`Tel: ${expTelefono}`, 20, lineY + 37);

    doc.setFont("helvetica", "bold");
    doc.text("Importador:", 105, lineY + 7);
    doc.setFont("helvetica", "normal");
    doc.text(`Razón Social: ${impRazonSocial}`, 105, lineY + 13);
    doc.text(`NIT: ${impNit}`, 105, lineY + 19);
    doc.text(`Dirección: ${impDireccion}`, 105, lineY + 25);
    doc.text(`Ciudad/País: ${impCiudadPais}`, 105, lineY + 31);
    doc.text(`Tel: ${impTelefono}`, 105, lineY + 37);

    // --- CONDICIONES LOGÍSTICAS ---
    const infoY = lineY + 50;
    doc.setFont("helvetica", "bold");
    doc.text("Condiciones de Embarque", 20, infoY);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Incoterm: ${incoterm}`, 20, infoY + 6);
    doc.text(`Forma de Pago: ${formaPago}`, 20, infoY + 12);
    // Plazo de pago fue eliminado de aquí
    doc.text(`Puerto Origen: ${puertoEmbarque}`, 20, infoY + 18);
    doc.text(`Puerto Destino: ${puertoDestino}`, 20, infoY + 24);
    
    // Resumen de Carga eliminado, la tabla sube para ocupar ese espacio
    // --- TABLA DE PRODUCTOS ---
    const startTablaY = infoY + 32; // Se subió la tabla
    const columnas = ["ITEM", "REF", "DESCRIPCIÓN / NCM", "P. BRUTO", "P. NETO", "CAJAS", "M3 / CAJA", "TOTAL M3"];
    
    const filas = productos.map((prod, index) => [
      index + 1,
      prod.referencia,
      `${prod.descripcion}\nNCM: ${prod.subpartida}`,
      `${prod.pesoBruto} KG`,
      `${prod.pesoNeto} KG`,
      `${prod.cajas}`,
      `${prod.m3PorCaja}`,
      `${prod.totalM3}`
    ]);

    autoTable(doc, {
      startY: startTablaY, 
      head: [columnas],
      body: filas,
      theme: 'grid',
      headStyles: { fillColor: [150, 150, 150], textColor: 255 }, 
      styles: { fontSize: 8, cellPadding: 3, valign: 'middle' },
      columnStyles: { 0: { halign: 'center' }, 1: { halign: 'center' }, 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'center' }, 6: { halign: 'right' }, 7: { halign: 'right' } }
    });

    const obsY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Observaciones:", 20, obsY);
    doc.setFont("helvetica", "normal");
    const lineasObs = doc.splitTextToSize(observaciones, 170);
    doc.text(lineasObs, 20, obsY + 6);

    doc.save(`Packing_List_${numeroLista.replace('/', '-')}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      
      <div className="w-full max-w-6xl mb-4 flex justify-between items-center">
        <button onClick={() => router.back()} type="button" className="bg-white text-slate-700 border border-slate-700 px-4 py-2 rounded font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-8 border-t-8 border-slate-600">
        
        <div className="bg-slate-50 border-l-4 border-slate-600 p-4 mb-8 rounded-r-lg">
          <h3 className="font-bold text-slate-800 text-lg mb-1">Paso 9: Lista de Empaque</h3>
          <p className="text-slate-700 text-sm">Detalla la organización física de la carga. Puedes agregar o eliminar productos de la lista.</p>
        </div>

        <h2 className="text-3xl font-bold text-center text-slate-700 mb-8 uppercase">Lista de Empaque</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">N° de Packing List</label>
              <input type="text" className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-600 font-bold outline-none cursor-not-allowed" value={numeroLista} readOnly />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Fecha de Emisión</label>
              <input type="date" className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-slate-500 outline-none bg-white" value={fechaEmision} onChange={(e) => setFechaEmision(e.target.value)} required />
            </div>
          </div>

          {/* DATOS EXPORTADOR / IMPORTADOR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2">Datos del Exportador</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2"><label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Razón Social</label><input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-slate-500 outline-none" value={expRazonSocial} onChange={(e) => setExpRazonSocial(e.target.value)} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">NIT / Tax ID</label><input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-slate-500 outline-none" value={expNit} onChange={(e) => setExpNit(e.target.value)} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Ciudad y País</label><input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-slate-500 outline-none" value={expCiudadPais} onChange={(e) => setExpCiudadPais(e.target.value)} required /></div>
                <div className="sm:col-span-2"><label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Dirección Física</label><input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-slate-500 outline-none" value={expDireccion} onChange={(e) => setExpDireccion(e.target.value)} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Email</label><input type="email" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-slate-500 outline-none" value={expEmail} onChange={(e) => setExpEmail(e.target.value)} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Teléfono</label><input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-slate-500 outline-none" value={expTelefono} onChange={(e) => setExpTelefono(e.target.value)} required /></div>
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2">Datos del Importador</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2"><label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Razón Social</label><input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-slate-500 outline-none" value={impRazonSocial} onChange={(e) => setImpRazonSocial(e.target.value)} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">NIT</label><input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-slate-500 outline-none" value={impNit} onChange={(e) => setImpNit(e.target.value)} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Ciudad y País</label><input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-slate-500 outline-none" value={impCiudadPais} onChange={(e) => setImpCiudadPais(e.target.value)} required /></div>
                <div className="sm:col-span-2"><label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Dirección Física</label><input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-slate-500 outline-none" value={impDireccion} onChange={(e) => setImpDireccion(e.target.value)} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Email</label><input type="email" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-slate-500 outline-none" value={impEmail} onChange={(e) => setImpEmail(e.target.value)} required /></div>
                <div><label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Teléfono</label><input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-slate-500 outline-none" value={impTelefono} onChange={(e) => setImpTelefono(e.target.value)} required /></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border-2 border-dashed border-slate-300 shadow-inner">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Condiciones de Embarque</h3>
            {/* Se reestructuraron las columnas para ocupar el espacio del campo eliminado */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1"><label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Incoterm:</label><input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-slate-500" value={incoterm} onChange={(e) => setIncoterm(e.target.value)} required /></div>
              <div className="md:col-span-1"><label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Forma de Pago:</label><input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-slate-500" value={formaPago} onChange={(e) => setFormaPago(e.target.value)} required /></div>
              <div className="md:col-span-1"><label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Puerto Origen:</label><input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-slate-500" value={puertoEmbarque} onChange={(e) => setPuertoEmbarque(e.target.value)} required /></div>
              <div className="md:col-span-1"><label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Puerto Destino:</label><input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-slate-500" value={puertoDestino} onChange={(e) => setPuertoDestino(e.target.value)} required /></div>
            </div>
          </div>

          {/* TABLA DE PRODUCTOS - DISEÑO MEJORADO SIN COLUMNA DE BORRAR */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Detalle de la Carga</h3>
              <button type="button" onClick={agregarProducto} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-300 text-sm shadow-sm transition-colors border border-gray-300">
                + Agregar Ítem
              </button>
            </div>
            
            {/* Encabezado Principal (Solo 11 Columnas, sin botón de borrar) */}
            <div className="flex items-center gap-2 mb-2">
              <div className="hidden md:grid grid-cols-11 gap-2 bg-slate-700 text-white p-2 rounded-md text-[10px] font-bold text-center items-center w-full shadow-sm">
                <div className="col-span-1 uppercase">Ref.</div>
                <div className="col-span-3 uppercase">Descripción</div>
                <div className="col-span-2 uppercase">Subpartida</div>
                <div className="col-span-1 uppercase">P. Bruto</div>
                <div className="col-span-1 uppercase">P. Neto</div>
                <div className="col-span-1 uppercase">Cajas</div>
                <div className="col-span-1 uppercase">m³ / Caja</div>
                <div className="col-span-1 uppercase">Total m³</div>
              </div>
              {/* Espaciador invisible para alinear la cabecera con los botones "X" inferiores */}
              <div className="w-8 shrink-0 hidden md:block"></div> 
            </div>

            {/* Filas de Datos */}
            {productos.map((producto, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-2">
                
                {/* Cuadrícula de Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-11 gap-2 border border-gray-300 bg-white p-4 md:p-2 rounded-md shadow-sm w-full">
                  <div className="md:col-span-1">
                    <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Referencia:</label>
                    <input type="text" className="w-full border rounded p-1 text-sm text-center outline-none focus:ring-1 focus:ring-slate-500" placeholder="REF-01" value={producto.referencia} onChange={(e) => actualizarProducto(index, 'referencia', e.target.value)} required />
                  </div>
                  
                  <div className="md:col-span-3">
                    <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Descripción:</label>
                    <input type="text" className="w-full border rounded p-1 text-sm outline-none focus:ring-1 focus:ring-slate-500" placeholder="Ej. Partes de motor" value={producto.descripcion} onChange={(e) => actualizarProducto(index, 'descripcion', e.target.value)} required />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Subpartida:</label>
                    <input type="text" className="w-full border rounded p-1 text-sm text-center outline-none focus:ring-1 focus:ring-slate-500" placeholder="8409.91.00" value={producto.subpartida} onChange={(e) => actualizarProducto(index, 'subpartida', e.target.value)} required />
                  </div>
                  
                  <div className="grid grid-cols-2 md:col-span-2 gap-2">
                    <div>
                      <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">P. Bruto:</label>
                      <input type="number" className="w-full border rounded p-1 text-sm text-center outline-none focus:ring-1 focus:ring-slate-500" placeholder="100" value={producto.pesoBruto} onChange={(e) => actualizarProducto(index, 'pesoBruto', e.target.value)} required />
                    </div>
                    <div>
                      <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">P. Neto:</label>
                      <input type="number" className="w-full border rounded p-1 text-sm text-center outline-none focus:ring-1 focus:ring-slate-500" placeholder="95" value={producto.pesoNeto} onChange={(e) => actualizarProducto(index, 'pesoNeto', e.target.value)} required />
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Cajas:</label>
                    <input type="number" className="w-full border rounded p-1 text-sm text-center outline-none focus:ring-1 focus:ring-slate-500" placeholder="50" value={producto.cajas} onChange={(e) => actualizarProducto(index, 'cajas', e.target.value)} required />
                  </div>

                  <div className="grid grid-cols-2 md:col-span-2 gap-2">
                    <div>
                      <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">m³ / Caja:</label>
                      <input type="number" className="w-full border rounded p-1 text-sm text-center outline-none focus:ring-1 focus:ring-slate-500" placeholder="0.25" value={producto.m3PorCaja} onChange={(e) => actualizarProducto(index, 'm3PorCaja', e.target.value)} required />
                    </div>
                    <div>
                      <label className="md:hidden block text-[10px] font-bold text-gray-500 mb-1 uppercase">Total m³:</label>
                      <input type="number" className="w-full border rounded p-1 text-sm text-center outline-none focus:ring-1 focus:ring-slate-500 bg-gray-50" placeholder="12.5" value={producto.totalM3} onChange={(e) => actualizarProducto(index, 'totalM3', e.target.value)} required />
                    </div>
                  </div>
                </div>

                {/* Botón flotante para eliminar (A un ladito) */}
                <div className="w-full md:w-8 shrink-0 flex justify-end md:justify-center mt-2 md:mt-0">
                  {productos.length > 1 ? (
                    <button 
                      type="button" 
                      onClick={() => eliminarProducto(index)} 
                      className="bg-red-50 text-red-600 font-bold w-8 h-8 rounded-full hover:bg-red-100 transition-colors border border-red-200 flex items-center justify-center text-xs shadow-sm"
                      title="Eliminar fila"
                    >
                      X
                    </button>
                  ) : (
                    <div className="w-8 h-8 hidden md:block"></div> 
                  )}
                </div>

              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Observaciones:</label>
            <textarea className="w-full border border-gray-300 p-3 text-sm rounded-md bg-white outline-none resize-none h-20 focus:ring-2 focus:ring-slate-500" placeholder="Notas adicionales del empaque (opcional)..." value={observaciones} onChange={(e)=>setObservaciones(e.target.value)} />
          </div>

          <button type="submit" className="w-full bg-slate-700 text-white font-bold py-4 px-4 rounded-md hover:bg-slate-800 transition-colors shadow-md mt-6 text-lg">
            Descargar Packing List (PDF)
          </button>

          <Link href="/certificado-origen" className="w-full block text-center bg-gray-200 text-gray-700 font-bold py-4 px-4 rounded-md hover:bg-gray-300 transition-colors mt-4 text-lg">
            Siguiente Paso: Certificado de Origen →
          </Link>
        </form>
      </div>
    </main>
  );
}