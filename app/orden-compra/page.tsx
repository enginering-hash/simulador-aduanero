"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrdenDeCompra() {
  const router = useRouter(); 

  // --- LOGO DE LA EMPRESA ---
  const [logoBase64, setLogoBase64] = useState<string>("");

  // --- DATOS DE IDENTIFICACIÓN: IMPORTADOR ---
  const [numeroOrden, setNumeroOrden] = useState("");
  const [impRazonSocial, setImpRazonSocial] = useState("Estudiante de Comercio Exterior S.A.");
  const [impEmail, setImpEmail] = useState("");
  const [impTelefono, setImpTelefono] = useState("");
  const [impNit, setImpNit] = useState("");
  const [impDireccion, setImpDireccion] = useState("");
  const [impCiudadPais, setImpCiudadPais] = useState("");

  // --- DATOS DE IDENTIFICACIÓN: EXPORTADOR ---
  const [expRazonSocial, setExpRazonSocial] = useState("");
  const [expEmail, setExpEmail] = useState("");
  const [expTelefono, setExpTelefono] = useState("");
  const [expNit, setExpNit] = useState("");
  const [expDireccion, setExpDireccion] = useState("");
  const [expCiudadPais, setExpCiudadPais] = useState("");

  // --- LOGÍSTICA Y TÉRMINOS ---
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [lugarEntrega, setLugarEntrega] = useState("");
  const [condicionesPago, setCondicionesPago] = useState("");
  const [incoterm, setIncoterm] = useState("");
  const [lugarIncoterm, setLugarIncoterm] = useState(""); 

  // --- DETALLE DE LA COMPRA ---
  const [productos, setProductos] = useState([
    { descripcion: "", cantidad: "", precioUnitario: "" }
  ]);

  // CARGAR DATOS AL ABRIR LA PÁGINA
  useEffect(() => {
    const borradorGuardado = sessionStorage.getItem("borrador_orden_compra");
    let poActual = "";

    if (borradorGuardado) {
      const datos = JSON.parse(borradorGuardado);
      poActual = datos.numeroOrden || "";
      
      setLogoBase64(datos.logoBase64 || ""); // Cargar Logo
      
      setImpRazonSocial(datos.impRazonSocial || "Estudiante de Comercio Exterior S.A.");
      setImpEmail(datos.impEmail || "");
      setImpTelefono(datos.impTelefono || "");
      setImpNit(datos.impNit || "");
      setImpDireccion(datos.impDireccion || "");
      setImpCiudadPais(datos.impCiudadPais || "");

      setExpRazonSocial(datos.expRazonSocial || "");
      setExpEmail(datos.expEmail || "");
      setExpTelefono(datos.expTelefono || "");
      setExpNit(datos.expNit || "");
      setExpDireccion(datos.expDireccion || "");
      setExpCiudadPais(datos.expCiudadPais || "");

      setFechaEntrega(datos.fechaEntrega || "");
      setLugarEntrega(datos.lugarEntrega || "");
      setCondicionesPago(datos.condicionesPago || "");
      setIncoterm(datos.incoterm || "");
      setLugarIncoterm(datos.lugarIncoterm || ""); 
      if (datos.productos && datos.productos.length > 0) setProductos(datos.productos);
    } 

    if (!poActual) {
      const año = new Date().getFullYear();
      const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
      poActual = `PO-${año}-${numeroAleatorio}`;
    }
    
    setNumeroOrden(poActual);
  }, []);

  // GUARDAR LOS DATOS (Borrador temporal)
  useEffect(() => {
    if (numeroOrden) {
      const borradorActual = {
        numeroOrden, logoBase64,
        impRazonSocial, impEmail, impTelefono, impNit, impDireccion, impCiudadPais,
        expRazonSocial, expEmail, expTelefono, expNit, expDireccion, expCiudadPais,
        fechaEntrega, lugarEntrega, condicionesPago, incoterm, lugarIncoterm, productos 
      };
      sessionStorage.setItem("borrador_orden_compra", JSON.stringify(borradorActual));
    }
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

  const agregarProducto = () => {
    setProductos([...productos, { descripcion: "", cantidad: "", precioUnitario: "" }]);
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

    // --- LOGO (SI EXISTE) ---
    if (logoBase64) {
      doc.addImage(logoBase64, 20, 10, 25, 25);
    }

    // --- ENCABEZADO DE LA ORDEN DE COMPRA ---
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129); // Verde esmeralda
    doc.text("ORDEN DE COMPRA (PO)", 190, 25, { align: "right" });

    // --- FECHAS Y REFERENCIAS ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(`N° de Orden: ${numeroOrden}`, 190, 33, { align: "right" });
    
    doc.text(`Fecha de Elaboración: ${fechaEntrega}`, 20, 43);
    doc.text(`Lugar de Entrega: ${lugarEntrega}`, 20, 49);
    
    // --- DATOS DE IDENTIFICACIÓN ---
    doc.line(20, 55, 190, 55); 
    
    const yDatos = 63;

    // Columna Izquierda: Importador
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Importador:", 20, yDatos);
    doc.setFont("helvetica", "normal");
    doc.text(`Razón Social: ${impRazonSocial}`, 20, yDatos + 6);
    doc.text(`NIT: ${impNit}`, 20, yDatos + 12);
    doc.text(`Dirección: ${impDireccion}`, 20, yDatos + 18);
    doc.text(`Ciudad/País: ${impCiudadPais}`, 20, yDatos + 24);
    doc.text(`Email: ${impEmail}`, 20, yDatos + 30);
    doc.text(`Tel: ${impTelefono}`, 20, yDatos + 36);

    // Columna Derecha: Exportador
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Exportador:", 110, yDatos);
    doc.setFont("helvetica", "normal");
    doc.text(`Razón Social: ${expRazonSocial}`, 110, yDatos + 6);
    doc.text(`NIT: ${expNit}`, 110, yDatos + 12);
    doc.text(`Dirección: ${expDireccion}`, 110, yDatos + 18);
    doc.text(`Ciudad/País: ${expCiudadPais}`, 110, yDatos + 24);
    doc.text(`Email: ${expEmail}`, 110, yDatos + 30);
    doc.text(`Tel: ${expTelefono}`, 110, yDatos + 36);

    // --- TÉRMINOS COMERCIALES ---
    const yTerminos = yDatos + 42;
    doc.line(20, yTerminos, 190, yTerminos);
    doc.setFont("helvetica", "bold");
    doc.text(`Condiciones de Pago:`, 20, yTerminos + 6);
    doc.setFont("helvetica", "normal");
    doc.text(condicionesPago, 60, yTerminos + 6);

    doc.setFont("helvetica", "bold");
    doc.text(`Incoterm:`, 120, yTerminos + 6);
    doc.setFont("helvetica", "normal");
    
    const textoIncotermFinal = lugarIncoterm ? `${incoterm} ${lugarIncoterm.toUpperCase()}` : incoterm;
    doc.text(textoIncotermFinal, 140, yTerminos + 6);

    // --- TABLA DE PRODUCTOS (DETALLE DE LA COMPRA) ---
    const columnas = ["Ítem", "Descripción del Producto", "Cantidad", "Precio Unit. (USD)", "Total (USD)"];
    
    const filas = productos.map((prod, index) => {
      const subtotal = Number(prod.cantidad) * Number(prod.precioUnitario);
      return [
        index + 1,
        prod.descripcion,
        prod.cantidad,
        `$${Number(prod.precioUnitario).toFixed(2)}`,
        `$${subtotal.toFixed(2)}`
      ];
    });

    const totalPO = productos.reduce((sum, prod) => sum + (Number(prod.cantidad) * Number(prod.precioUnitario)), 0);

    autoTable(doc, {
      startY: yTerminos + 12,
      head: [columnas],
      body: filas,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] }, 
      styles: { fontSize: 9, cellPadding: 3 },
    });

    // --- TOTAL DE LA ORDEN ---
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.line(120, finalY - 5, 190, finalY - 5); 
    doc.setFont("helvetica", "bold");
    
    doc.text(`TOTAL ORDEN DE COMPRA:`, 150, finalY, { align: "right" });
    doc.text(`$${totalPO.toFixed(2)} USD`, 190, finalY, { align: "right" });

    // --- AUTORIZACIÓN (FIRMA) ---
    doc.line(20, finalY + 30, 80, finalY + 30); 
    doc.setFont("helvetica", "bold");
    doc.text("Firma Autorizada Importador", 20, finalY + 36);
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text("Esta es una solicitud formal de compra. Por favor confirmar recepción enviando la Factura Proforma.", 105, finalY + 50, { align: "center" });

    doc.save(`Orden_Compra_${numeroOrden || 'Simulador'}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      
      <div className="w-full max-w-5xl mb-4 flex justify-between items-center">
        <button 
          onClick={() => router.back()} 
          type="button"
          className="bg-white text-emerald-700 border border-emerald-700 px-4 py-2 rounded font-bold hover:bg-emerald-50 transition-colors flex items-center gap-2 shadow-sm">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-8 rounded-r-lg">
          <h3 className="font-bold text-emerald-800 text-lg mb-1">Paso 1: Orden de Compra (PO)</h3>
          <p className="text-emerald-700 text-sm">
            <strong>Tu Rol:</strong> Analista de Compras.<br/>
            <strong>Objetivo:</strong> Emitir el documento formal detallando las cantidades, fechas, lugares y condiciones financieras requeridas.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-center text-emerald-600 mb-8">Orden de Compra</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-white p-4 rounded-lg border-2 border-dashed border-emerald-300 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <label className="block text-sm font-bold text-emerald-800 mb-2">Añadir Logo de la Empresa (Opcional)</label>
              <p className="text-xs text-gray-500 mb-3">Dale un toque profesional a tu PDF subiendo el logo de tu empresa importadora.</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload} 
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 cursor-pointer" 
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

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">1. Datos de Identificación</h3>
            
            {/* NUEVO CAMPO DE ORDEN DE COMPRA EDITABLE */}
            <div className="mb-6 bg-emerald-50 p-4 rounded-lg border border-emerald-200 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
               <label className="font-bold text-emerald-800 whitespace-nowrap">N° ÚNICO DE ORDEN (PO):</label>
               <input type="text" className="w-full sm:w-1/2 border border-emerald-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-800" value={numeroOrden} onChange={(e) => setNumeroOrden(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-bold text-emerald-700 mb-4 border-b border-emerald-200 pb-2">Datos del Importador</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Razón Social</label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none" value={impRazonSocial} onChange={(e) => setImpRazonSocial(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">NIT</label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Ej. 900.123.456-7" value={impNit} onChange={(e) => setImpNit(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Ciudad y País</label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Ej. Bogotá, Colombia" value={impCiudadPais} onChange={(e) => setImpCiudadPais(e.target.value)} required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Dirección Física</label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Ej. Calle 100 # 15-20" value={impDireccion} onChange={(e) => setImpDireccion(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Email</label>
                    <input type="email" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="compras@empresa.com" value={impEmail} onChange={(e) => setImpEmail(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Teléfono</label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="+57 300 000 0000" value={impTelefono} onChange={(e) => setImpTelefono(e.target.value)} required />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-bold text-emerald-700 mb-4 border-b border-emerald-200 pb-2">Datos del Exportador</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Razón Social</label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Shenzhen Tech Co." value={expRazonSocial} onChange={(e) => setExpRazonSocial(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">NIT / Tax ID</label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Ej. CN-123456" value={expNit} onChange={(e) => setExpNit(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Ciudad y País</label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Ej. Shenzhen, China" value={expCiudadPais} onChange={(e) => setExpCiudadPais(e.target.value)} required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Dirección Física</label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Ej. 123 Tech Park Road" value={expDireccion} onChange={(e) => setExpDireccion(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Email</label>
                    <input type="email" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="sales@proveedor.cn" value={expEmail} onChange={(e) => setExpEmail(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Teléfono</label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="+86 10 000 0000" value={expTelefono} onChange={(e) => setExpTelefono(e.target.value)} required />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">2. Términos de Compra</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Fecha de Elaboración</label>
                <input type="date" className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-emerald-500 outline-none" value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Lugar de Entrega Físico (Bodega)</label>
                <input type="text" className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ej. Bodega Principal Bogotá" value={lugarEntrega} onChange={(e) => setLugarEntrega(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Condiciones de Pago</label>
                <input type="text" className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ej. 30% Anticipo, 70% contra BL" value={condicionesPago} onChange={(e) => setCondicionesPago(e.target.value)} required />
              </div>
              
              <div className="flex gap-2">
                <div className="w-1/2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Incoterm Negociado</label>
                    <select className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-emerald-500 outline-none bg-white" value={incoterm} onChange={(e) => setIncoterm(e.target.value)} required>
                      <option value="" disabled>Selecciona...</option>
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
                </div>
                <div className="w-1/2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Responsabilidad Incoterm</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ej. Callao" value={lugarIncoterm} onChange={(e) => setLugarIncoterm(e.target.value)} required />
                </div>
              </div>

            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">3. Detalle de la Compra</h3>
            
            {productos.map((producto, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-lg mb-4 bg-gray-50 relative">
                
                <span className="absolute -top-3 -left-3 bg-emerald-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-md z-10">
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Descripción Detallada</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ej. Laptops Dell Latitude 5420" value={producto.descripcion} onChange={(e) => actualizarProducto(index, 'descripcion', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Cantidad</label>
                    <input type="number" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="100" value={producto.cantidad} onChange={(e) => actualizarProducto(index, 'cantidad', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Precio Unitario (USD)</label>
                    <input type="number" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="500" value={producto.precioUnitario} onChange={(e) => actualizarProducto(index, 'precioUnitario', e.target.value)} required />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" onClick={agregarProducto} className="w-full md:w-auto bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors border border-gray-300 shadow-sm">
              + Solicitar otro ítem
            </button>
          </div>

          <hr className="my-6" />

          <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 px-4 rounded-md hover:bg-emerald-700 transition-colors shadow-md mt-6 text-lg">
            Descargar Orden de Compra (PDF)
          </button>

          <Link href="/factura-proforma" className="w-full block text-center bg-blue-100 text-blue-700 font-bold py-4 px-4 rounded-md hover:bg-blue-200 transition-colors mt-4 text-lg">
            Siguiente Paso →
          </Link>
        </form>
      </div>
    </main>
  );
}