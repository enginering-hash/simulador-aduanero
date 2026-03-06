"use client";

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function FormatoReserva() {
  const router = useRouter(); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LOGO ---
  const [logoBase64, setLogoBase64] = useState<string>("");

  const [bookingRef, setBookingRef] = useState("");

  // --- 1. RUTA Y TRANSPORTE ---
  const [fechaElaboracion, setFechaElaboracion] = useState(""); 
  const [buqueViaje, setBuqueViaje] = useState("");
  const [origen, setOrigen] = useState("");
  const [puertoCargue, setPuertoCargue] = useState("");
  const [puertoDescargue, setPuertoDescargue] = useState("");
  const [destino, setDestino] = useState("");
  const [lugarEmisionBl, setLugarEmisionBl] = useState("Origen"); 
  const [tipoServicio, setTipoServicio] = useState("FCL");

  // --- 2. ACTORES ---
  const [shipperNombre, setShipperNombre] = useState("");
  const [shipperDireccion, setShipperDireccion] = useState("");
  const [shipperEmail, setShipperEmail] = useState(""); // Cambiado de Contacto a Email
  const [shipperTelefono, setShipperTelefono] = useState("");
  const [shipperFax, setShipperFax] = useState("");
  
  const [siaNombre, setSiaNombre] = useState("");
  const [siaDireccion, setSiaDireccion] = useState("");
  const [siaEmail, setSiaEmail] = useState(""); // Cambiado de Contacto a Email
  const [siaTelefono, setSiaTelefono] = useState("");
  
  const [consignatarioNombre, setConsignatarioNombre] = useState("");
  const [consignatarioDireccion, setConsignatarioDireccion] = useState("");
  const [consignatarioEmail, setConsignatarioEmail] = useState(""); // Cambiado de Contacto a Email
  const [consignatarioTelefono, setConsignatarioTelefono] = useState("");

  // --- 3. CONDICIONES Y FLETES ---
  const [tarifa, setTarifa] = useState("");
  const [serviceContract, setServiceContract] = useState("");
  const [formaPagoFletes, setFormaPagoFletes] = useState("Prepagado");

  // --- 4. CONTENEDORES Y CARGA ---
  const [cantidadContenedores, setCantidadContenedores] = useState("");
  const [tamanoContenedor, setTamanoContenedor] = useState("20'");
  const [tipoContenedor, setTipoContenedor] = useState("Dry");
  const [pesoBruto, setPesoBruto] = useState("");
  const [mercancia, setMercancia] = useState("");
  const [lugarSuministro, setLugarSuministro] = useState("");
  const [empresaTransportadora, setEmpresaTransportadora] = useState("");

  // --- 5. REQUERIMIENTOS ESPECIALES ---
  const [esPeligrosa, setEsPeligrosa] = useState("No");
  const [unNa, setUnNa] = useState("");
  const [imo, setImo] = useState("");
  const [pg, setPg] = useState("");
  const [flashpoint, setFlashpoint] = useState("");
  
  const [esRefrigerada, setEsRefrigerada] = useState("No");
  const [temperatura, setTemperatura] = useState("");
  const [vent, setVent] = useState("");
  const [cmh, setCmh] = useState("");
  
  const [observaciones, setObservaciones] = useState("");

  // CARGAR DATOS AL ABRIR LA PÁGINA
  useEffect(() => {
    const borradorGuardado = sessionStorage.getItem("borrador_formato_reserva_v3");
    let bookingActual = "";

    if (borradorGuardado) {
      const datos = JSON.parse(borradorGuardado);
      bookingActual = datos.bookingRef || "";
      
      setLogoBase64(datos.logoBase64 || "");

      setFechaElaboracion(datos.fechaElaboracion || ""); 
      setBuqueViaje(datos.buqueViaje || "");
      setOrigen(datos.origen || "");
      setPuertoCargue(datos.puertoCargue || "");
      setPuertoDescargue(datos.puertoDescargue || "");
      setDestino(datos.destino || "");
      setLugarEmisionBl(datos.lugarEmisionBl || "Origen");
      setTipoServicio(datos.tipoServicio || "FCL");
      
      setShipperNombre(datos.shipperNombre || "");
      setShipperDireccion(datos.shipperDireccion || "");
      setShipperEmail(datos.shipperEmail || "");
      setShipperTelefono(datos.shipperTelefono || "");
      setShipperFax(datos.shipperFax || "");
      
      setSiaNombre(datos.siaNombre || "");
      setSiaDireccion(datos.siaDireccion || "");
      setSiaEmail(datos.siaEmail || "");
      setSiaTelefono(datos.siaTelefono || "");
      
      setConsignatarioNombre(datos.consignatarioNombre || "");
      setConsignatarioDireccion(datos.consignatarioDireccion || "");
      setConsignatarioEmail(datos.consignatarioEmail || "");
      setConsignatarioTelefono(datos.consignatarioTelefono || "");
      
      setTarifa(datos.tarifa || "");
      setServiceContract(datos.serviceContract || "");
      setFormaPagoFletes(datos.formaPagoFletes || "Prepagado");
      
      setCantidadContenedores(datos.cantidadContenedores || "");
      setTamanoContenedor(datos.tamanoContenedor || "20'");
      setTipoContenedor(datos.tipoContenedor || "Dry");
      setPesoBruto(datos.pesoBruto || "");
      setMercancia(datos.mercancia || "");
      setLugarSuministro(datos.lugarSuministro || "");
      setEmpresaTransportadora(datos.empresaTransportadora || "");
      
      setEsPeligrosa(datos.esPeligrosa || "No");
      setUnNa(datos.unNa || "");
      setImo(datos.imo || "");
      setPg(datos.pg || "");
      setFlashpoint(datos.flashpoint || "");
      
      setEsRefrigerada(datos.esRefrigerada || "No");
      setTemperatura(datos.temperatura || "");
      setVent(datos.vent || "");
      setCmh(datos.cmh || "");
      
      setObservaciones(datos.observaciones || "");
    } 

    if (!bookingActual) {
      const num = Math.floor(100000 + Math.random() * 900000);
      bookingActual = `BKG-${num}`;
    }
    
    setBookingRef(bookingActual);
  }, []);

  // GUARDAR LOS DATOS 
  useEffect(() => {
    if (bookingRef) {
      const borradorActual = {
        bookingRef, logoBase64, fechaElaboracion, buqueViaje, origen, puertoCargue, puertoDescargue, destino,
        lugarEmisionBl, tipoServicio,
        shipperNombre, shipperDireccion, shipperEmail, shipperTelefono, shipperFax,
        siaNombre, siaDireccion, siaEmail, siaTelefono,
        consignatarioNombre, consignatarioDireccion, consignatarioEmail, consignatarioTelefono,
        tarifa, serviceContract, formaPagoFletes,
        cantidadContenedores, tamanoContenedor, tipoContenedor, pesoBruto, mercancia,
        lugarSuministro, empresaTransportadora,
        esPeligrosa, unNa, imo, pg, flashpoint,
        esRefrigerada, temperatura, vent, cmh, observaciones
      };
      sessionStorage.setItem("borrador_formato_reserva_v3", JSON.stringify(borradorActual));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const resumenReserva = {
      bookingRef, shipperNombre, consignatarioNombre, 
      puertoCargue, destino, mercancia, 
      contenedores: `${cantidadContenedores}X${tamanoContenedor} ${tipoContenedor}`,
      tipoServicio,
      pesoBruto, incoterm: "FOB" 
    };
    localStorage.setItem('datosReserva', JSON.stringify(resumenReserva));
    
    const doc = new jsPDF();

    if (logoBase64) {
      doc.addImage(logoBase64, 15, 10, 20, 20); // Logo cuadrado
    }

    doc.setFontSize(16);
    doc.setTextColor(124, 58, 237); // Púrpura
    doc.text("FORMATO DE RESERVA (BOOKING REQUEST)", 105, 15, { align: "center" });
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.text(`Ref: ${bookingRef}  |  Fecha de Elaboración: ${fechaElaboracion}`, 105, 20, { align: "center" });

    // 1. Ruta y Transporte
    autoTable(doc, {
      startY: 30, // Ajustado para dar espacio al logo
      head: [[{ content: "RUTA Y TRANSPORTE", colSpan: 4 }]],
      body: [
        ["Buque Viaje:", buqueViaje, "Origen:", origen],
        ["Puerto de Cargue:", puertoCargue, "Puerto de Descargue:", puertoDescargue],
        ["Destino:", destino, "Lugar Emisión B/Ls:", lugarEmisionBl],
        ["Tipo de Servicio:", tipoServicio, "", ""]
      ],
      theme: 'plain',
      headStyles: { fillColor: [243, 232, 255], textColor: [109, 40, 217], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2, lineWidth: 0.1, lineColor: [200, 200, 200] },
    });

    // 2. Actores (Modificado Contacto a Email)
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 5,
      head: [["EXPORTADOR", "AGENTE DE ADUANA (SIA)", "CONSIGNATARIO"]],
      body: [
        [shipperNombre, siaNombre, consignatarioNombre],
        [`Dir: ${shipperDireccion}`, `Dir: ${siaDireccion}`, `Dir: ${consignatarioDireccion}`],
        [`Email: ${shipperEmail}`, `Email: ${siaEmail}`, `Email: ${consignatarioEmail}`],
        [`Tel: ${shipperTelefono} | Fax: ${shipperFax}`, `Tel: ${siaTelefono}`, `Tel: ${consignatarioTelefono}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [124, 58, 237], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 2 },
    });

    // 3. Fletes y Condiciones
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 5,
      head: [[{ content: "CONDICIONES Y FLETES", colSpan: 2 }]],
      body: [
        ["Tarifa:", tarifa],
        ["Service Contract/SQ:", serviceContract],
        ["Forma de Pago de Fletes:", formaPagoFletes]
      ],
      theme: 'plain',
      headStyles: { fillColor: [243, 232, 255], textColor: [109, 40, 217], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2, lineWidth: 0.1, lineColor: [200, 200, 200] },
    });

    // 4. Contenedores y Carga
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 5,
      head: [[{ content: "DETALLE DE CONTENEDORES Y CARGA", colSpan: 4 }]],
      body: [
        ["Cant. Contenedores:", cantidadContenedores, "Tipo/Tamaño:", `${tamanoContenedor} - ${tipoContenedor}`],
        ["Peso Bruto:", pesoBruto, "Mercancía:", mercancia],
        ["Lugar Suministro:", lugarSuministro, "Empresa Transportadora:", empresaTransportadora]
      ],
      theme: 'grid',
      headStyles: { fillColor: [124, 58, 237], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 2 },
    });

    // 5. Carga Especial y Observaciones
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 5,
      head: [["CARGA PELIGROSA E IMO", "CARGA REFRIGERADA"]],
      body: [
        [
          `Peligrosa: ${esPeligrosa}\nUN/NA: ${unNa || 'N/A'}\nIMO: ${imo || 'N/A'}\nPG: ${pg || 'N/A'}\nFlashpoint: ${flashpoint || 'N/A'}`,
          `Refrigerada: ${esRefrigerada}\nTemp: ${temperatura || 'N/A'}\nVent: ${vent || 'N/A'}\nCMH: ${cmh || 'N/A'}`
        ],
        [{ content: `OBSERVACIONES:\n${observaciones}`, colSpan: 2 }]
      ],
      theme: 'grid',
      headStyles: { fillColor: [109, 40, 217], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 3 },
    });

    doc.save(`Formato_Reserva_${bookingRef}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      
      <div className="w-full max-w-5xl mb-4 flex justify-between items-center">
        <button 
          onClick={() => router.back()} 
          type="button"
          className="bg-white text-purple-600 border border-purple-600 px-4 py-2 rounded font-bold hover:bg-purple-50 transition-colors flex items-center gap-2 shadow-sm">
          ← Devolverme al Paso Anterior
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 flex items-center gap-2">
          🏠 Menú Principal
        </Link>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 border-t-8 border-purple-500">
        
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-8 rounded-r-lg">
          <h3 className="font-bold text-purple-800 text-lg mb-1">Paso 4: Formato de Reserva (Booking Request)</h3>
          <p className="text-purple-700 text-sm">
            Diligencia el formato oficial con la naviera o agente de carga para solicitar tu espacio en el buque.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center text-purple-600 mb-8 uppercase tracking-wide">Formato de Reserva</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-white p-4 rounded-lg border-2 border-dashed border-purple-300 flex flex-col md:flex-row items-center gap-6 justify-between mb-6">
            <div>
              <label className="block text-sm font-bold text-purple-800 mb-2">Añadir Logo de Naviera / Agente (Opcional)</label>
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*" 
                onChange={handleLogoUpload} 
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer" 
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

          {/* SECCIÓN 1: RUTA */}
          <section className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-sm font-bold text-purple-700 mb-4 border-b pb-2">1. INFORMACIÓN DEL VIAJE Y RUTA</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div><label className="block text-xs font-bold text-gray-700 mb-1">FECHA DE ELABORACIÓN:</label><input type="date" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500" value={fechaElaboracion} onChange={(e)=>setFechaElaboracion(e.target.value)} required/></div>
              
              <div><label className="block text-xs font-bold text-gray-700 mb-1">BUQUE VIAJE:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500" value={buqueViaje} onChange={(e)=>setBuqueViaje(e.target.value)} required/></div>
              <div><label className="block text-xs font-bold text-gray-700 mb-1">ORIGEN:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500" value={origen} onChange={(e)=>setOrigen(e.target.value)} required/></div>
              <div><label className="block text-xs font-bold text-gray-700 mb-1">PUERTO DE CARGUE:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500" value={puertoCargue} onChange={(e)=>setPuertoCargue(e.target.value)} required/></div>
              <div><label className="block text-xs font-bold text-gray-700 mb-1">PUERTO DE DESCARGUE:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500" value={puertoDescargue} onChange={(e)=>setPuertoDescargue(e.target.value)} required/></div>
              <div><label className="block text-xs font-bold text-gray-700 mb-1">DESTINO:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500" value={destino} onChange={(e)=>setDestino(e.target.value)} required/></div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Lugar Emisión B/Ls Originales:</label>
                <select className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500 bg-white" value={lugarEmisionBl} onChange={(e)=>setLugarEmisionBl(e.target.value)} required>
                  <option value="Origen">Origen</option>
                  <option value="Destino">Destino</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">TIPO DE SERVICIO:</label>
                <select className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500 bg-white" value={tipoServicio} onChange={(e)=>setTipoServicio(e.target.value)} required>
                  <option value="FCL">FCL (Contenedor Completo)</option>
                  <option value="LCL">LCL (Carga Consolidada / Suelta)</option>
                </select>
              </div>
              
            </div>
          </section>

          {/* SECCIÓN 2: ACTORES */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 p-4 rounded-lg">
              <h3 className="text-sm font-bold text-purple-700 mb-3 border-b pb-1">EXPORTADOR</h3>
              <div className="space-y-2">
                <input type="text" placeholder="Nombre/Razón Social" className="w-full border p-2 text-xs rounded" value={shipperNombre} onChange={(e)=>setShipperNombre(e.target.value)} required/>
                <input type="text" placeholder="Dirección" className="w-full border p-2 text-xs rounded" value={shipperDireccion} onChange={(e)=>setShipperDireccion(e.target.value)} required/>
                <input type="email" placeholder="Email" className="w-full border p-2 text-xs rounded" value={shipperEmail} onChange={(e)=>setShipperEmail(e.target.value)} required/>
                <input type="text" placeholder="Teléfono" className="w-full border p-2 text-xs rounded" value={shipperTelefono} onChange={(e)=>setShipperTelefono(e.target.value)} required/>
                <input type="text" placeholder="Fax" className="w-full border p-2 text-xs rounded" value={shipperFax} onChange={(e)=>setShipperFax(e.target.value)}/>
              </div>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-lg">
              <h3 className="text-sm font-bold text-purple-700 mb-3 border-b pb-1">AGENTE ADUANA (SIA)</h3>
              <div className="space-y-2">
                <input type="text" placeholder="Nombre del SIA" className="w-full border p-2 text-xs rounded" value={siaNombre} onChange={(e)=>setSiaNombre(e.target.value)} required/>
                <input type="text" placeholder="Dirección" className="w-full border p-2 text-xs rounded" value={siaDireccion} onChange={(e)=>setSiaDireccion(e.target.value)} required/>
                <input type="email" placeholder="Email" className="w-full border p-2 text-xs rounded outline-none focus:ring-1 focus:ring-purple-500" value={siaEmail} onChange={(e)=>setSiaEmail(e.target.value)} required/>
                <input type="text" placeholder="Teléfono" className="w-full border p-2 text-xs rounded" value={siaTelefono} onChange={(e)=>setSiaTelefono(e.target.value)} required/>
              </div>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-lg">
              <h3 className="text-sm font-bold text-purple-700 mb-3 border-b pb-1">CONSIGNATARIO</h3>
              <div className="space-y-2">
                <input type="text" placeholder="Nombre/Razón Social" className="w-full border p-2 text-xs rounded" value={consignatarioNombre} onChange={(e)=>setConsignatarioNombre(e.target.value)} required/>
                <input type="text" placeholder="Dirección" className="w-full border p-2 text-xs rounded" value={consignatarioDireccion} onChange={(e)=>setConsignatarioDireccion(e.target.value)} required/>
                <input type="email" placeholder="Email" className="w-full border p-2 text-xs rounded" value={consignatarioEmail} onChange={(e)=>setConsignatarioEmail(e.target.value)} required/>
                <input type="text" placeholder="Teléfono" className="w-full border p-2 text-xs rounded" value={consignatarioTelefono} onChange={(e)=>setConsignatarioTelefono(e.target.value)} required/>
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: FLETES */}
          <section className="bg-gray-50 p-5 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-xs font-bold text-gray-700 mb-1">TARIFA:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500" value={tarifa} onChange={(e)=>setTarifa(e.target.value)}/></div>
              <div><label className="block text-xs font-bold text-gray-700 mb-1">SERVICE CONTRACT/SQ:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500" value={serviceContract} onChange={(e)=>setServiceContract(e.target.value)}/></div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Forma Pago Fletes:</label>
                <select className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500 bg-white" value={formaPagoFletes} onChange={(e)=>setFormaPagoFletes(e.target.value)} required>
                  <option value="Prepagado">Prepagado (Prepaid)</option>
                  <option value="Al cobro">Al cobro (Collect)</option>
                </select>
              </div>
          </section>

          {/* SECCIÓN 4: CONTENEDOR Y CARGA */}
          <section className="border border-gray-200 p-5 rounded-lg">
            <h3 className="text-sm font-bold text-purple-700 mb-4 border-b pb-2">CONTENEDORES Y LOGÍSTICA</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div><label className="block text-xs font-bold text-gray-700 mb-1">CANT. CONTENEDORES:</label><input type="number" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500" value={cantidadContenedores} onChange={(e)=>setCantidadContenedores(e.target.value)} required/></div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">TAMAÑO (20' / 40'):</label>
                <select className="w-full border p-2 text-sm rounded bg-white outline-none focus:ring-1 focus:ring-purple-500" value={tamanoContenedor} onChange={(e)=>setTamanoContenedor(e.target.value)}>
                  <option value="20'">20 Pies</option>
                  <option value="40'">40 Pies</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">TIPO (Dry/Reefer/High Cube):</label>
                <select className="w-full border p-2 text-sm rounded bg-white outline-none focus:ring-1 focus:ring-purple-500" value={tipoContenedor} onChange={(e)=>setTipoContenedor(e.target.value)}>
                  <option value="Dry">Dry Cargo (Estándar)</option>
                  <option value="Reefer">Reefer (Refrigerado)</option>
                  <option value="High Cube">High Cube (Extragrande)</option>
                  <option value="Open Top">Open Top</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div><label className="block text-xs font-bold text-gray-700 mb-1">PESO BRUTO:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500" value={pesoBruto} onChange={(e)=>setPesoBruto(e.target.value)} required/></div>
              <div><label className="block text-xs font-bold text-gray-700 mb-1">MERCANCÍA:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500" value={mercancia} onChange={(e)=>setMercancia(e.target.value)} required/></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-gray-700 mb-1">LUGAR SUMINISTRO CONTENEDORES:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500" value={lugarSuministro} onChange={(e)=>setLugarSuministro(e.target.value)}/></div>
              <div><label className="block text-xs font-bold text-gray-700 mb-1">EMPRESA TRANSPORTADORA QUE RETIRA:</label><input type="text" className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500" value={empresaTransportadora} onChange={(e)=>setEmpresaTransportadora(e.target.value)}/></div>
            </div>
          </section>

          {/* SECCIÓN 5: CARGA PELIGROSA Y REFRIGERADA */}
          <section className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-sm font-bold text-purple-700 mb-4 border-b pb-2">ESPECIFICACIONES DE CARGA (Opcional)</h3>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <label className="text-xs font-bold text-gray-700 w-full md:w-auto">CARGA PELIGROSA (Yes/No):</label>
              <select className="border p-2 text-sm rounded bg-white outline-none focus:ring-1 focus:ring-purple-500" value={esPeligrosa} onChange={(e)=>setEsPeligrosa(e.target.value)}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
              {esPeligrosa === "Yes" && (
                <>
                  <input type="text" placeholder="UN/NA #" className="border p-2 text-sm rounded w-24 outline-none focus:ring-1 focus:ring-purple-500" value={unNa} onChange={(e)=>setUnNa(e.target.value)}/>
                  <input type="text" placeholder="IMO #" className="border p-2 text-sm rounded w-24 outline-none focus:ring-1 focus:ring-purple-500" value={imo} onChange={(e)=>setImo(e.target.value)}/>
                  <input type="text" placeholder="PG #" className="border p-2 text-sm rounded w-24 outline-none focus:ring-1 focus:ring-purple-500" value={pg} onChange={(e)=>setPg(e.target.value)}/>
                  <input type="text" placeholder="Flashpoint #" className="border p-2 text-sm rounded w-32 outline-none focus:ring-1 focus:ring-purple-500" value={flashpoint} onChange={(e)=>setFlashpoint(e.target.value)}/>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <label className="text-xs font-bold text-gray-700 w-full md:w-auto">CARGA REFRIGERADA (Yes/No):</label>
              <select className="border p-2 text-sm rounded bg-white outline-none focus:ring-1 focus:ring-purple-500" value={esRefrigerada} onChange={(e)=>setEsRefrigerada(e.target.value)}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
              {esRefrigerada === "Yes" && (
                <>
                  <input type="text" placeholder="Temp #" className="border p-2 text-sm rounded w-24 outline-none focus:ring-1 focus:ring-purple-500" value={temperatura} onChange={(e)=>setTemperatura(e.target.value)}/>
                  
                  <select className="border p-2 text-sm rounded w-32 outline-none focus:ring-1 focus:ring-purple-500 bg-white" value={vent} onChange={(e)=>setVent(e.target.value)}>
                    <option value="" disabled>Ventilación</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>

                  <input type="text" placeholder="CMH #" className="border p-2 text-sm rounded w-24 outline-none focus:ring-1 focus:ring-purple-500" value={cmh} onChange={(e)=>setCmh(e.target.value)}/>
                </>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">OBSERVACIONES:</label>
              <textarea className="w-full border p-2 text-sm rounded outline-none focus:ring-1 focus:ring-purple-500" rows={2} value={observaciones} onChange={(e)=>setObservaciones(e.target.value)}></textarea>
            </div>
          </section>

          <button type="submit" className="w-full bg-purple-600 text-white font-bold py-4 px-4 rounded-md hover:bg-purple-700 transition-colors shadow-md mt-6 text-lg">
            Generar Formato de Reserva (PDF)
          </button>

          <Link href="/aprobacion-reserva" className="w-full block text-center bg-purple-100 text-purple-700 font-bold py-4 px-4 rounded-md hover:bg-purple-200 transition-colors mt-4 text-lg">
            Siguiente Paso: Aprobación de la Reserva →
          </Link>
        </form>
      </div>
    </main>
  );
}