"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function FacturaProformaExportacion() {
  const router = useRouter(); 

  // --- LOGO DEL EXPORTADOR ---
  const [logoBase64, setLogoBase64] = useState<string>("");

  // --- NÚMEROS Y FECHAS ---
  const [numeroProforma, setNumeroProforma] = useState("");
  const [numeroPedido, setNumeroPedido] = useState(""); 
  const [fechaElaboracion, setFechaElaboracion] = useState("");

  // --- DATOS DE IDENTIFICACIÓN: EXPORTADOR (TÚ) ---
  const [expRazonSocial, setExpRazonSocial] = useState("Mi Empresa Exportadora S.A.S.");
  const [expEmail, setExpEmail] = useState("");
  const [expTelefono, setExpTelefono] = useState("");
  const [expNit, setExpNit] = useState("");
  const [expDireccion, setExpDireccion] = useState("");
  const [expCiudadPais, setExpCiudadPais] = useState("");

  // --- DATOS DE IDENTIFICACIÓN: IMPORTADOR (CLIENTE) ---
  const [impRazonSocial, setImpRazonSocial] = useState("Cliente Internacional S.A.");
  const [impEmail, setImpEmail] = useState("");
  const [impTelefono, setImpTelefono] = useState("");
  const [impNit, setImpNit] = useState("");
  const [impDireccion, setImpDireccion] = useState("");
  const [impCiudadPais, setImpCiudadPais] = useState("");

  // --- DETALLE DE PRODUCTOS ---
  const [productos, setProductos] = useState([
    { cantidad: "", descripcion: "", precioUnitario: "" }
  ]);

  // --- CONDICIONES Y PAGO ---
  const [condicionesPago, setCondicionesPago] = useState("");
  const [incoterm, setIncoterm] = useState("EXW");
  const [ciudadIncoterm, setCiudadIncoterm] = useState("");

  // --- COSTOS LOGÍSTICOS ADICIONALES (INCOTERMS) ---
  const [fleteNacionalOrigen, setFleteNacionalOrigen] = useState("0");
  const [gastosExportacion, setGastosExportacion] = useState("0");
  const [fleteInternacional, setFleteInternacional] = useState("0");
  const [seguro, setSeguro] = useState("0");
  const [movimientoContenedor, setMovimientoContenedor] = useState("0");
  const [fleteNacionalDestino, setFleteNacionalDestino] = useState("0");
  const [gastosImportacion, setGastosImportacion] = useState("0");

  // CARGAR LOS DATOS AL ABRIR LA PÁGINA
  useEffect(() => {
    // Variable de sesión independiente para Exportación
    const borradorGuardado = sessionStorage.getItem("borrador_factura_proforma_expo_v1");
    let profActual = "";

    if (borradorGuardado) {
      const datos = JSON.parse(borradorGuardado);
      profActual = datos.numeroProforma || "";

      setLogoBase64(datos.logoBase64 || ""); 
      
      setNumeroPedido(datos.numeroPedido || "");
      setFechaElaboracion(datos.fechaElaboracion || "");
      
      setExpRazonSocial(datos.expRazonSocial || "Mi Empresa Exportadora S.A.S.");
      setExpEmail(datos.expEmail || "");
      setExpTelefono(datos.expTelefono || "");
      setExpNit(datos.expNit || "");
      setExpDireccion(datos.expDireccion || "");
      setExpCiudadPais(datos.expCiudadPais || "");

      setImpRazonSocial(datos.impRazonSocial || "Cliente Internacional S.A.");
      setImpEmail(datos.impEmail || "");
      setImpTelefono(datos.impTelefono || "");
      setImpNit(datos.impNit || "");
      setImpDireccion(datos.impDireccion || "");
      setImpCiudadPais(datos.impCiudadPais || "");

      if (datos.productos && datos.productos.length > 0) setProductos(datos.productos);
      setCondicionesPago(datos.condicionesPago || "");
      setIncoterm(datos.incoterm || "EXW");
      setCiudadIncoterm(datos.ciudadIncoterm || "");

      setFleteNacionalOrigen(datos.fleteNacionalOrigen || "0");
      setGastosExportacion(datos.gastosExportacion || "0");
      setFleteInternacional(datos.fleteInternacional || "0");
      setSeguro(datos.seguro || "0");
      setMovimientoContenedor(datos.movimientoContenedor || "0");
      setFleteNacionalDestino(datos.fleteNacionalDestino || "0");
      setGastosImportacion(datos.gastosImportacion || "0");
    }

    if (!profActual) {
      const año = new Date().getFullYear();
      profActual = `PROF-EXP-${año}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    setNumeroProforma(profActual);
  }, []);

  // GUARDAR LOS DATOS
  useEffect(() => {
    if (numeroProforma) {
      const borradorActual = {
        numeroProforma, logoBase64, numeroPedido, fechaElaboracion, 
        expRazonSocial, expEmail, expTelefono, expNit, expDireccion, expCiudadPais,
        impRazonSocial, impEmail, impTelefono, impNit, impDireccion, impCiudadPais,
        productos, condicionesPago, incoterm, ciudadIncoterm,
        fleteNacionalOrigen, gastosExportacion, fleteInternacional, seguro, 
        movimientoContenedor, fleteNacionalDestino, gastosImportacion
      };
      sessionStorage.setItem("borrador_factura_proforma_expo_v1", JSON.stringify(borradorActual));
    }
  });

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

  const agregarProducto = () => {
    setProductos([...productos, { cantidad: "", descripcion: "", precioUnitario: "" }]);
  };

  const actualizarProducto = (index: number, campo: string, valor: string) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index] = { ...nuevosProductos[index], [campo]: valor };
    setProductos(nuevosProductos);
  };

  const eliminarProducto = (indexToRemove: number) => {
    if (productos.length === 1) return;
    const nuevosProductos = productos.filter((_, index) => index !== indexToRemove);
    setProductos(nuevosProductos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    const doc = new jsPDF();

    if (logoBase64) {
      doc.addImage(logoBase64, 20, 10, 25, 25);
    }

    // --- ENCABEZADO PRINCIPAL IZQUIERDO ---
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    const empresaY = logoBase64 ? 42 : 20; 
    doc.text(expRazonSocial.toUpperCase() || "NOMBRE DEL EXPORTADOR", 20, empresaY);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(expDireccion || "Dirección del Exportador", 20, empresaY + 6);

    // --- ENCABEZADO PRINCIPAL DERECHO (TITULO Y REFERENCIAS) ---
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.text("FACTURA PROFORMA", 190, 22, { align: "right" });
    
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`N° Factura: ${numeroProforma}`, 190, 30, { align: "right" });
    doc.text(`N° de pedido (PO): ${numeroPedido}`, 190, 36, { align: "right" });
    doc.text(`Fecha elaboración: ${fechaElaboracion}`, 190, 42, { align: "right" });

    // --- LÍNEA DIVISORIA DINÁMICA ---
    const lineY = Math.max(empresaY + 12, 50);
    doc.line(20, lineY, 190, lineY);
    
    // --- BLOQUE DE COLUMNAS (EXPORTADOR E IMPORTADOR) ---
    doc.setFont("helvetica", "bold");
    doc.text("Exportador (Vendedor):", 20, lineY + 7);
    doc.setFont("helvetica", "normal");
    doc.text(`Razón Social: ${expRazonSocial}`, 20, lineY + 13);
    doc.text(`NIT: ${expNit}`, 20, lineY + 19);
    doc.text(`Dirección: ${expDireccion}`, 20, lineY + 25);
    doc.text(`Ciudad/País: ${expCiudadPais}`, 20, lineY + 31);
    doc.text(`Email: ${expEmail}`, 20, lineY + 37);
    doc.text(`Tel: ${expTelefono}`, 20, lineY + 43);

    doc.setFont("helvetica", "bold");
    doc.text("Importador (Cliente):", 105, lineY + 7);
    doc.setFont("helvetica", "normal");
    doc.text(`Razón Social: ${impRazonSocial}`, 105, lineY + 13);
    doc.text(`NIT: ${impNit}`, 105, lineY + 19);
    doc.text(`Dirección: ${impDireccion}`, 105, lineY + 25);
    doc.text(`Ciudad/País: ${impCiudadPais}`, 105, lineY + 31);
    doc.text(`Email: ${impEmail}`, 105, lineY + 37);
    doc.text(`Tel: ${impTelefono}`, 105, lineY + 43);

    // --- TABLA DE PRODUCTOS ---
    const startTablaY = lineY + 52;
    const columnas = ["CANT.", "DESCRIPCIÓN", "PRECIO UNITARIO", "IMPORTE"];
    let subtotalProductos = 0;

    const filas = productos.map((prod) => {
      const importe = Number(prod.cantidad) * Number(prod.precioUnitario);
      subtotalProductos += importe;
      return [
        prod.cantidad,
        prod.descripcion,
        `$${Number(prod.precioUnitario).toFixed(2)}`,
        `$${importe.toFixed(2)}`
      ];
    });

    autoTable(doc, {
      startY: startTablaY, 
      head: [columnas],
      body: filas,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: 255 }, // Indigo 600
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: { 0: { halign: 'center' }, 2: { halign: 'right' }, 3: { halign: 'right' } }
    });

    // --- DESGLOSE DE TOTALES Y COSTOS INCOTERM ---
    let currY = (doc as any).lastAutoTable.finalY + 10;
    let totalExtras = 0;

    const labelX = 160; 
    const valueX = 190; 

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal Productos:", labelX, currY, { align: "right" }); 
    doc.setFont("helvetica", "normal");
    doc.text(`$${subtotalProductos.toFixed(2)}`, valueX, currY, { align: "right" }); 
    currY += 6;

    // Helper para imprimir las filas de costos logísticos
    const agregarFilaCosto = (etiqueta: string, valor: string) => {
      const numValor = Number(valor);
      if (numValor > 0) {
        doc.setFont("helvetica", "bold");
        doc.text(etiqueta, labelX, currY, { align: "right" });
        doc.setFont("helvetica", "normal");
        doc.text(`$${numValor.toFixed(2)}`, valueX, currY, { align: "right" });
        totalExtras += numValor;
        currY += 6;
      }
    };

    // Cascada de Incoterms 
    if (incoterm !== "EXW") {
      agregarFilaCosto("Flete Nac. Origen:", fleteNacionalOrigen);
      agregarFilaCosto("Gastos de Exportación:", gastosExportacion);
    }
    if (["CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"].includes(incoterm)) {
      agregarFilaCosto("Flete Internacional:", fleteInternacional);
    }
    if (["CIF", "CIP", "DAP", "DPU", "DDP"].includes(incoterm)) {
      agregarFilaCosto("Seguro Internacional:", seguro);
    }
    if (["DAP", "DPU", "DDP"].includes(incoterm)) {
      agregarFilaCosto("Movimiento Contenedor:", movimientoContenedor);
      agregarFilaCosto("Flete Nac. Destino:", fleteNacionalDestino);
    }
    if (incoterm === "DDP") {
      agregarFilaCosto("Gastos de Importación:", gastosImportacion);
    }

    // LÍNEA DE TOTAL FINAL
    currY += 2;
    doc.setDrawColor(150, 150, 150);
    doc.line(100, currY - 4, 190, currY - 4);

    const totalFinal = subtotalProductos + totalExtras;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229); // Indigo 600
    
    const textoIncoterm = ciudadIncoterm ? `${incoterm} ${ciudadIncoterm.toUpperCase()}` : incoterm;
    doc.text(`TOTAL ${textoIncoterm}:`, labelX, currY + 2, { align: "right" });
    doc.text(`$${totalFinal.toFixed(2)}`, valueX, currY + 2, { align: "right" });

    // --- CONDICIONES Y FIRMA ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Condiciones y forma de pago", 20, (doc as any).lastAutoTable.finalY + 10);
    doc.setFont("helvetica", "normal");
    const lineasPago = doc.splitTextToSize(condicionesPago, 100);
    doc.text(lineasPago, 20, (doc as any).lastAutoTable.finalY + 15);
    
    doc.setFont("helvetica", "bold");
    doc.text("Incoterm Negociado:", 20, (doc as any).lastAutoTable.finalY + 30);
    doc.setFont("helvetica", "normal");
    doc.text(`${incoterm} ${ciudadIncoterm}`, 55, (doc as any).lastAutoTable.finalY + 30);

    // Firma al final de la página
    const firmaY = Math.max(currY + 25, (doc as any).lastAutoTable.finalY + 45);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.text(expRazonSocial || "Firma Autorizada", 150, firmaY, { align: "center" });
    doc.line(110, firmaY + 2, 190, firmaY + 2);

    doc.save(`Factura_Proforma_Exportacion_${numeroProforma}.pdf`);
    localStorage.setItem('numeroProformaExpo', numeroProforma);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      
      <div className="w-full max-w-5xl mb-4 flex justify-between items-center">
        <button 
          onClick={() => router.back()} 
          type="button"
          className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-sm">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 border-t-8 border-indigo-500">
        
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-8 rounded-r-lg">
          <h3 className="font-bold text-indigo-800 text-lg mb-1">Paso 2: Factura Proforma (Exportación)</h3>
          <p className="text-indigo-700 text-sm">
            <strong>Tu Rol:</strong> Exportador / Vendedor.<br/>
            <strong>Objetivo:</strong> Responder a la Orden de Compra del cliente detallando los costos logísticos según el Incoterm seleccionado para que él apruebe.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Factura Proforma</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-white p-4 rounded-lg border-2 border-dashed border-indigo-300 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <label className="block text-sm font-bold text-indigo-800 mb-2">Añadir Logo de tu Empresa (Opcional)</label>
              <p className="text-xs text-gray-500 mb-3">Dale un toque profesional a tu PDF subiendo el logo de tu empresa exportadora.</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload} 
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer" 
              />
            </div>
            {logoBase64 && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-gray-400 mb-1">Vista Previa</span>
                <img src={logoBase64} alt="Logo Preview" className="h-16 w-16 object-contain border border-gray-200 rounded p-1 shadow-sm" />
                <button type="button" onClick={() => setLogoBase64("")} className="text-xs text-red-500 hover:underline mt-1">Quitar logo</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">N° Factura Proforma</label>
              <input type="text" className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-600 font-bold outline-none cursor-not-allowed" value={numeroProforma} readOnly />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">N° de Pedido (PO del Cliente)</label>
              <input type="text" className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej. PO-2024-4829" value={numeroPedido} onChange={(e) => setNumeroPedido(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Fecha de Elaboración</label>
              <input type="date" className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none" value={fechaElaboracion} onChange={(e) => setFechaElaboracion(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200 shadow-sm">
              <h4 className="font-bold text-indigo-700 mb-4 border-b border-indigo-200 pb-2">Datos del Exportador (Tú)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Razón Social</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" value={expRazonSocial} onChange={(e) => setExpRazonSocial(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">NIT / Tax ID</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" value={expNit} onChange={(e) => setExpNit(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Ciudad y País</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" value={expCiudadPais} onChange={(e) => setExpCiudadPais(e.target.value)} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Dirección Física</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" value={expDireccion} onChange={(e) => setExpDireccion(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Email</label>
                  <input type="email" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" value={expEmail} onChange={(e) => setExpEmail(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Teléfono</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" value={expTelefono} onChange={(e) => setExpTelefono(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2">Datos del Importador (Cliente)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Razón Social</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" value={impRazonSocial} onChange={(e) => setImpRazonSocial(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">NIT</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" value={impNit} onChange={(e) => setImpNit(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Ciudad y País</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" value={impCiudadPais} onChange={(e) => setImpCiudadPais(e.target.value)} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Dirección Física</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" value={impDireccion} onChange={(e) => setImpDireccion(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Email</label>
                  <input type="email" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" value={impEmail} onChange={(e) => setImpEmail(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Teléfono</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" value={impTelefono} onChange={(e) => setImpTelefono(e.target.value)} required />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Detalles de venta (Productos)</h3>
            {productos.map((producto, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 items-end relative bg-gray-50 p-4 rounded-lg border border-gray-200">
                <span className="absolute -top-3 -left-3 bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-md z-10">
                  {index + 1}
                </span>

                {productos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarProducto(index)}
                    className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-md hover:bg-red-600 transition-colors z-10"
                    title="Eliminar este ítem"
                  >
                    X
                  </button>
                )}

                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">CANTIDAD</label>
                  <input type="number" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500" value={producto.cantidad} onChange={(e) => actualizarProducto(index, 'cantidad', e.target.value)} required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">DESCRIPCIÓN</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500" value={producto.descripcion} onChange={(e) => actualizarProducto(index, 'descripcion', e.target.value)} required />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">PRECIO UNITARIO (USD)</label>
                  <input type="number" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500" value={producto.precioUnitario} onChange={(e) => actualizarProducto(index, 'precioUnitario', e.target.value)} required />
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <button type="button" onClick={agregarProducto} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-300 text-sm shadow-sm transition-colors border border-gray-300">
                + Agregar Ítem
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border-2 border-dashed border-indigo-300 shadow-inner">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-indigo-200 pb-3 gap-4">
              <h3 className="text-lg font-bold text-indigo-800">Costos Logísticos (Según Incoterm)</h3>
              
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                <label className="text-sm font-bold text-gray-700 whitespace-nowrap">Incoterm Negociado:</label>
                <select className="border border-gray-400 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white font-bold w-full sm:w-auto" value={incoterm} onChange={(e) => setIncoterm(e.target.value)} required>
                  <option value="EXW">EXW - Ex Works</option>
                  <option value="FCA">FCA - Free Carrier</option>
                  <option value="FAS">FAS - Free Alongside Ship</option>
                  <option value="FOB">FOB - Free On Board</option>
                  <option value="CFR">CFR - Cost and Freight</option>
                  <option value="CIF">CIF - Cost, Insurance and Freight</option>
                  <option value="CPT">CPT - Carriage Paid To</option>
                  <option value="CIP">CIP - Carriage and Insurance Paid To</option>
                  <option value="DAP">DAP - Delivered At Place</option>
                  <option value="DPU">DPU - Delivered at Place Unloaded</option>
                  <option value="DDP">DDP - Delivered Duty Paid</option>
                </select>
                <input 
                  type="text" 
                  className="border border-gray-400 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white w-full sm:w-auto" 
                  placeholder="Ciudad (Ej. Miami)" 
                  value={ciudadIncoterm} 
                  onChange={(e) => setCiudadIncoterm(e.target.value)} 
                  required 
                />
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {incoterm !== "EXW" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Flete Nacional Origen (USD)</label>
                    <input type="number" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500" value={fleteNacionalOrigen} onChange={(e) => setFleteNacionalOrigen(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Gastos Exportación (USD)</label>
                    <input type="number" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500" value={gastosExportacion} onChange={(e) => setGastosExportacion(e.target.value)} />
                  </div>
                </>
              )}

              {["CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"].includes(incoterm) && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Flete Internacional (USD)</label>
                    <input type="number" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500" value={fleteInternacional} onChange={(e) => setFleteInternacional(e.target.value)} />
                  </div>
                </>
              )}
              
              {["CIF", "CIP", "DAP", "DPU", "DDP"].includes(incoterm) && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Seguro Internacional (USD)</label>
                    <input type="number" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500" value={seguro} onChange={(e) => setSeguro(e.target.value)} />
                  </div>
                </>
              )}

              {["DAP", "DPU", "DDP"].includes(incoterm) && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Movimiento Contenedor Destino (USD)</label>
                    <input type="number" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500" value={movimientoContenedor} onChange={(e) => setMovimientoContenedor(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Flete Nac. Destino (USD)</label>
                    <input type="number" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500" value={fleteNacionalDestino} onChange={(e) => setFleteNacionalDestino(e.target.value)} />
                  </div>
                </>
              )}

              {incoterm === "DDP" && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Gastos de Importación (Impuestos) (USD)</label>
                  <input type="number" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500" value={gastosImportacion} onChange={(e) => setGastosImportacion(e.target.value)} />
                </div>
              )}

              {incoterm === "EXW" && (
                <div className="col-span-3 text-center text-gray-500 text-sm italic py-4">
                  El Incoterm EXW no requiere adicionar costos logísticos a la factura por parte del exportador.
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Condiciones y Acuerdos de Pago</label>
            <input type="text" className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej. 30% Anticipo, 70% contra entrega de documentos" value={condicionesPago} onChange={(e) => setCondicionesPago(e.target.value)} required />
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 px-4 rounded-md hover:bg-indigo-700 transition-colors shadow-md mt-6 text-lg">
            Descargar Factura Proforma (PDF)
          </button>

          <Link href="/aprobacion-correo-exportacion" className="w-full block text-center bg-gray-200 text-gray-700 font-bold py-4 px-4 rounded-md hover:bg-gray-300 transition-colors mt-4 text-lg">
            Siguiente Paso: Aprobación por Correo →
          </Link>
        </form>
      </div>
    </main>
  );
}