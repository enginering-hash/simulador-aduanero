"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import Link from "next/link";
import { useRouter } from "next/navigation";

// COMPONENTE AFUERA PARA EVITAR PÉRDIDA DE FOCO AL ESCRIBIR
const Field = ({ num, label, value, onChange, colSpan = 1, width = "w-full" }: any) => {
  return (
    <div 
      className="border border-green-600 p-1 flex flex-col justify-between bg-white"
      style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }}
    >
      <div className="flex gap-1 text-[9px] text-green-800 leading-tight mb-1">
        {num && <strong>{num}.</strong>}
        <span className="leading-tight">{label}</span>
      </div>
      <input type="text" className={`${width} text-xs font-bold text-black outline-none bg-transparent`} value={value || ""} onChange={onChange} />
    </div>
  );
};

export default function DeclaracionImportacion() {
  const router = useRouter();

  // --- 1. CABECERA ---
  const [anio, setAnio] = useState(new Date().getFullYear().toString());
  const [numFormulario, setNumFormulario] = useState("");

  // --- 2. IMPORTADOR ---
  const [impNit, setImpNit] = useState("");
  const [impDv, setImpDv] = useState("");
  const [impRazonSocial, setImpRazonSocial] = useState("");
  const [impDireccion, setImpDireccion] = useState("");
  const [impTelefono, setImpTelefono] = useState("");
  const [impCodAdmon, setImpCodAdmon] = useState("");
  const [impCodDpto, setImpCodDpto] = useState("");
  const [impCodCiudad, setImpCodCiudad] = useState("");

  // --- 3. DECLARANTE ---
  const [decNit, setDecNit] = useState("");
  const [decDv, setDecDv] = useState("");
  const [decRazonSocial, setDecRazonSocial] = useState("");
  const [decTipoUsu, setDecTipoUsu] = useState("");
  const [decCodUsu, setDecCodUsu] = useState("");
  const [decNumId, setDecNumId] = useState("");
  const [decNombres, setDecNombres] = useState("");

  // --- 4. TRANSPORTE Y MERCANCÍA ---
  const [codLugarIngreso, setCodLugarIngreso] = useState("");
  const [codDeposito, setCodDeposito] = useState("");
  const [manifiesto, setManifiesto] = useState("");
  const [fechaManifiesto, setFechaManifiesto] = useState("");
  const [docTransporte, setDocTransporte] = useState("");
  const [fechaDocTransporte, setFechaDocTransporte] = useState("");

  const [exportadorNombre, setExportadorNombre] = useState("");
  const [exportadorCiudad, setExportadorCiudad] = useState("");
  const [exportadorCodPais, setExportadorCodPais] = useState("");
  const [exportadorDireccion, setExportadorDireccion] = useState("");
  const [exportadorEmail, setExportadorEmail] = useState("");

  const [numFactura, setNumFactura] = useState("");
  const [fechaFactura, setFechaFactura] = useState("");
  const [paisProcedencia, setPaisProcedencia] = useState("");
  const [modoTransporte, setModoTransporte] = useState("");
  const [bandera, setBandera] = useState("");
  const [dptoDestino, setDptoDestino] = useState("");
  const [empresaTransportadora, setEmpresaTransportadora] = useState("");
  const [tasaCambio, setTasaCambio] = useState("");

  const [subpartida, setSubpartida] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [paisOrigen, setPaisOrigen] = useState("");
  const [pesoBruto, setPesoBruto] = useState("");
  const [pesoNeto, setPesoNeto] = useState("");
  const [embalaje, setEmbalaje] = useState("");
  const [bultos, setBultos] = useState("");
  const [cantidad, setCantidad] = useState("");

  const [fobUsd, setFobUsd] = useState("");
  const [fletesUsd, setFletesUsd] = useState("");
  const [segurosUsd, setSegurosUsd] = useState("");
  const [otrosUsd, setOtrosUsd] = useState("");
  const [sumatoriaUsd, setSumatoriaUsd] = useState("");
  const [valorAduanaUsd, setValorAduanaUsd] = useState("");

  // --- 5. AUTOLIQUIDACIÓN (MANUAL) ---
  const [arancelPorc, setArancelPorc] = useState("");
  const [arancelBase, setArancelBase] = useState("");
  const [arancelLiquidado, setArancelLiquidado] = useState("");
  const [arancelPagar, setArancelPagar] = useState("");

  const [ivaPorc, setIvaPorc] = useState("");
  const [ivaBase, setIvaBase] = useState("");
  const [ivaLiquidado, setIvaLiquidado] = useState("");
  const [ivaPagar, setIvaPagar] = useState("");

  const [sancionesPorc, setSancionesPorc] = useState("");
  const [sancionesBase, setSancionesBase] = useState("");
  const [sancionesLiquidado, setSancionesLiquidado] = useState("");
  const [sancionesPagar, setSancionesPagar] = useState("");

  const [otrosPorc, setOtrosPorc] = useState("");
  const [otrosBase, setOtrosBase] = useState("");
  const [otrosLiquidado, setOtrosLiquidado] = useState("");
  const [otrosPagar, setOtrosPagar] = useState("");

  const [totalLiquidado, setTotalLiquidado] = useState("");

  // --- 6. DESCRIPCIÓN ---
  const [descripcion, setDescripcion] = useState("");

  // --- 7. PIE DE PÁGINA (LEVANTE Y PAGOS) ---
  const [valorPagosAnteriores, setValorPagosAnteriores] = useState("");
  const [reciboPagoAnterior, setReciboPagoAnterior] = useState("");
  const [fechaPagoAnterior, setFechaPagoAnterior] = useState("");
  
  const [actuacionAduanera, setActuacionAduanera] = useState("");
  const [minRelaciones, setMinRelaciones] = useState("");
  
  const [numAceptacion, setNumAceptacion] = useState("");
  const [fechaAceptacion, setFechaAceptacion] = useState("");
  
  const [numLevante, setNumLevante] = useState("");
  const [fechaLevante, setFechaLevante] = useState("");
  
  const [funcionarioNombre, setFuncionarioNombre] = useState("");
  const [funcionarioCC, setFuncionarioCC] = useState("");
  
  const [pagoTotal, setPagoTotal] = useState("");

  // CARGAR DATOS PREVIOS AL ABRIR LA PÁGINA
  useEffect(() => {
    const borradorGuardado = sessionStorage.getItem("borrador_dec_importacion_v5");
    
    if (borradorGuardado) {
      const d = JSON.parse(borradorGuardado);
      setAnio(d.anio || new Date().getFullYear().toString());
      setNumFormulario(d.numFormulario || `500${Math.floor(10000000000 + Math.random() * 90000000000)}`);
      
      setImpNit(d.impNit || ""); setImpDv(d.impDv || ""); setImpRazonSocial(d.impRazonSocial || "");
      setImpDireccion(d.impDireccion || ""); setImpTelefono(d.impTelefono || ""); setImpCodAdmon(d.impCodAdmon || "");
      setImpCodDpto(d.impCodDpto || ""); setImpCodCiudad(d.impCodCiudad || "");
      
      setDecNit(d.decNit || ""); setDecDv(d.decDv || ""); setDecRazonSocial(d.decRazonSocial || "");
      setDecTipoUsu(d.decTipoUsu || ""); setDecCodUsu(d.decCodUsu || ""); setDecNumId(d.decNumId || ""); setDecNombres(d.decNombres || "");
      
      setCodLugarIngreso(d.codLugarIngreso || ""); setCodDeposito(d.codDeposito || ""); setManifiesto(d.manifiesto || "");
      setFechaManifiesto(d.fechaManifiesto || ""); setDocTransporte(d.docTransporte || ""); setFechaDocTransporte(d.fechaDocTransporte || "");
      
      setExportadorNombre(d.exportadorNombre || ""); setExportadorCiudad(d.exportadorCiudad || ""); setExportadorCodPais(d.exportadorCodPais || "");
      setExportadorDireccion(d.exportadorDireccion || ""); setExportadorEmail(d.exportadorEmail || "");
      
      setNumFactura(d.numFactura || ""); setFechaFactura(d.fechaFactura || ""); setPaisProcedencia(d.paisProcedencia || "");
      setModoTransporte(d.modoTransporte || ""); setBandera(d.bandera || ""); setDptoDestino(d.dptoDestino || "");
      setEmpresaTransportadora(d.empresaTransportadora || ""); setTasaCambio(d.tasaCambio || "");
      
      setSubpartida(d.subpartida || ""); setModalidad(d.modalidad || ""); setPaisOrigen(d.paisOrigen || "");
      setPesoBruto(d.pesoBruto || ""); setPesoNeto(d.pesoNeto || ""); setEmbalaje(d.embalaje || "");
      setBultos(d.bultos || ""); setCantidad(d.cantidad || "");
      
      setFobUsd(d.fobUsd || ""); setFletesUsd(d.fletesUsd || ""); setSegurosUsd(d.segurosUsd || "");
      setOtrosUsd(d.otrosUsd || ""); setSumatoriaUsd(d.sumatoriaUsd || ""); setValorAduanaUsd(d.valorAduanaUsd || "");
      
      setArancelPorc(d.arancelPorc || ""); setArancelBase(d.arancelBase || ""); setArancelLiquidado(d.arancelLiquidado || ""); setArancelPagar(d.arancelPagar || "");
      setIvaPorc(d.ivaPorc || ""); setIvaBase(d.ivaBase || ""); setIvaLiquidado(d.ivaLiquidado || ""); setIvaPagar(d.ivaPagar || "");
      setSancionesPorc(d.sancionesPorc || ""); setSancionesBase(d.sancionesBase || ""); setSancionesLiquidado(d.sancionesLiquidado || ""); setSancionesPagar(d.sancionesPagar || "");
      setOtrosPorc(d.otrosPorc || ""); setOtrosBase(d.otrosBase || ""); setOtrosLiquidado(d.otrosLiquidado || ""); setOtrosPagar(d.otrosPagar || "");
      
      setTotalLiquidado(d.totalLiquidado || ""); setDescripcion(d.descripcion || "");

      // PIE DE PÁGINA
      setValorPagosAnteriores(d.valorPagosAnteriores || ""); setReciboPagoAnterior(d.reciboPagoAnterior || ""); setFechaPagoAnterior(d.fechaPagoAnterior || "");
      setActuacionAduanera(d.actuacionAduanera || ""); setMinRelaciones(d.minRelaciones || "");
      setNumAceptacion(d.numAceptacion || ""); setFechaAceptacion(d.fechaAceptacion || "");
      setNumLevante(d.numLevante || ""); setFechaLevante(d.fechaLevante || "");
      setFuncionarioNombre(d.funcionarioNombre || ""); setFuncionarioCC(d.funcionarioCC || "");
      setPagoTotal(d.pagoTotal || "");
    } else {
      setNumFormulario(`500${Math.floor(10000000000 + Math.random() * 90000000000)}`);
      
      const datosReservaStr = localStorage.getItem('datosReserva');
      if (datosReservaStr) {
        const datosReserva = JSON.parse(datosReservaStr);
        setImpRazonSocial(datosReserva.consignatarioNombre || "");
        setExportadorNombre(datosReserva.shipperNombre || "");
        setDescripcion(datosReserva.mercancia || "");
      }
    }
  }, []);

  // GUARDAR BORRADOR CONTINUAMENTE
  useEffect(() => {
    const d = {
      anio, numFormulario, impNit, impDv, impRazonSocial, impDireccion, impTelefono, impCodAdmon, impCodDpto, impCodCiudad,
      decNit, decDv, decRazonSocial, decTipoUsu, decCodUsu, decNumId, decNombres,
      codLugarIngreso, codDeposito, manifiesto, fechaManifiesto, docTransporte, fechaDocTransporte,
      exportadorNombre, exportadorCiudad, exportadorCodPais, exportadorDireccion, exportadorEmail,
      numFactura, fechaFactura, paisProcedencia, modoTransporte, bandera, dptoDestino, empresaTransportadora, tasaCambio,
      subpartida, modalidad, paisOrigen, pesoBruto, pesoNeto, embalaje, bultos, cantidad,
      fobUsd, fletesUsd, segurosUsd, otrosUsd, sumatoriaUsd, valorAduanaUsd,
      arancelPorc, arancelBase, arancelLiquidado, arancelPagar,
      ivaPorc, ivaBase, ivaLiquidado, ivaPagar,
      sancionesPorc, sancionesBase, sancionesLiquidado, sancionesPagar,
      otrosPorc, otrosBase, otrosLiquidado, otrosPagar,
      totalLiquidado, descripcion,
      valorPagosAnteriores, reciboPagoAnterior, fechaPagoAnterior, actuacionAduanera, minRelaciones,
      numAceptacion, fechaAceptacion, numLevante, fechaLevante, funcionarioNombre, funcionarioCC, pagoTotal
    };
    sessionStorage.setItem("borrador_dec_importacion_v5", JSON.stringify(d));
  });

  const generarPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    const doc = new jsPDF("portrait", "mm", "a4");

    doc.setDrawColor(0, 138, 59); // Verde DIAN
    doc.setLineWidth(0.5);

    // Intentar cargar el logo de la DIAN desde public
    try {
      const response = await fetch("/logo_dian2.png");
      if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          generarContenidoPDF(doc, base64data);
        };
        reader.readAsDataURL(blob);
      } else {
        generarContenidoPDF(doc, null);
      }
    } catch (error) {
      generarContenidoPDF(doc, null);
    }
  };

  const generarContenidoPDF = (doc: jsPDF, logoBase64: string | null) => {
    const drawBox = (x: number, y: number, w: number, h: number, num: string, title: string, value: string, valSize = 7, valAlign = "left") => {
      doc.rect(x, y, w, h);
      if (num) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(5);
        doc.setTextColor(0, 138, 59);
        doc.text(`${num}.`, x + 1, y + 2.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(title, x + 4, y + 2.5);
      } else if (title) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(5);
        doc.setTextColor(0, 0, 0);
        doc.text(title, x + 1, y + 2.5);
      }
      
      if (value) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(valSize);
        doc.setTextColor(0, 0, 0);
        
        let textX = x + 2;
        if (valAlign === "center") textX = x + (w / 2);
        if (valAlign === "right") textX = x + w - 2;

        const opciones: any = {};
        if (valAlign !== "left") opciones.align = valAlign;

        doc.text(String(value), textX, y + h - 2, opciones);
      }
    };

    // --- MARCO EXTERIOR ---
    doc.rect(10, 10, 190, 277);

    // --- CABECERA ---
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', 11, 11, 45, 14); 
    } else {
      doc.setFillColor(0, 0, 0);
      doc.circle(20, 18, 5, 'F');
      doc.circle(24, 18, 5, 'F');
      doc.setFillColor(255, 255, 255);
      doc.circle(22, 18, 4, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("DIAN", 32, 20);
      doc.setFontSize(5);
      doc.text("Dirección de Impuestos y Aduanas Nacionales", 12, 26);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Declaración de Importación", 75, 20);

    // Caja MUISCA y 500
    doc.setDrawColor(0, 138, 59);
    doc.rect(145, 10, 35, 10);
    doc.setFontSize(8);
    doc.setTextColor(0, 138, 59);
    doc.text("M U I S C A", 150, 16);
    
    doc.setFillColor(0, 138, 59);
    doc.rect(180, 10, 20, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("500", 182, 21);

    drawBox(140, 25, 60, 15, "", "", "");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(0, 0, 0);
    doc.text("4. Número de formulario", 142, 28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(numFormulario, 142, 33);
    doc.setFont("courier", "bold");
    doc.text("|| |||| | ||| ||||| ||| ||| |||", 142, 37);

    // --- SECCIÓN IMPORTADOR ---
    doc.setFillColor(240, 255, 240);
    doc.rect(10, 40, 5, 20, 'F');
    doc.setFontSize(6);
    doc.text("Imp.", 11, 55, { angle: 90 });

    drawBox(15, 40, 55, 10, "5", "NIT", impNit, 9);
    drawBox(70, 40, 10, 10, "6", "DV", impDv, 9, "center");
    drawBox(80, 40, 120, 10, "11", "Apellidos y nombres o razón social", impRazonSocial, 8);
    
    drawBox(15, 50, 105, 10, "13", "Dirección", impDireccion, 7);
    drawBox(120, 50, 40, 10, "15", "Teléfono", impTelefono, 8);
    drawBox(160, 50, 10, 10, "12", "Ad", impCodAdmon, 7, "center");
    drawBox(170, 50, 10, 10, "16", "Dp", impCodDpto, 7, "center");
    drawBox(180, 50, 20, 10, "17", "Ciudad", impCodCiudad, 7, "center");

    // --- SECCIÓN DECLARANTE ---
    doc.setFillColor(240, 255, 240);
    doc.rect(10, 60, 5, 20, 'F');
    doc.setFontSize(6);
    doc.text("Decl.", 11, 75, { angle: 90 });

    drawBox(15, 60, 55, 10, "24", "NIT", decNit, 9);
    drawBox(70, 60, 10, 10, "25", "DV", decDv, 9, "center");
    drawBox(80, 60, 90, 10, "26", "Razón social declarante", decRazonSocial, 7);
    drawBox(170, 60, 10, 10, "27", "T.U", decTipoUsu, 8, "center");
    drawBox(180, 60, 20, 10, "28", "Cod.Usu", decCodUsu, 8, "center");

    drawBox(15, 70, 55, 10, "29", "No. Identificación", decNumId, 8);
    drawBox(70, 70, 130, 10, "30", "Apellidos y nombres", decNombres, 8);

    // --- DATOS LUGAR Y DOCUMENTOS ---
    drawBox(10, 80, 30, 10, "41", "Lugar Ingreso", codLugarIngreso, 8, "center");
    drawBox(40, 80, 25, 10, "42", "Depósito", codDeposito, 8);
    drawBox(65, 80, 45, 10, "43", "Manifiesto de carga", manifiesto, 8);
    drawBox(110, 80, 20, 10, "44", "Fecha", fechaManifiesto, 7);
    drawBox(130, 80, 45, 10, "45", "Doc. de transporte", docTransporte, 8);
    drawBox(175, 80, 25, 10, "46", "Fecha", fechaDocTransporte, 7, "center");

    drawBox(10, 90, 130, 10, "47", "Nombre exportador o proveedor exterior", exportadorNombre, 8);
    drawBox(140, 90, 40, 10, "48", "Ciudad", exportadorCiudad, 8);
    drawBox(180, 90, 20, 10, "49", "Cod Pais", exportadorCodPais, 8, "center");

    drawBox(10, 100, 120, 10, "50", "Dirección exportador", exportadorDireccion, 8);
    drawBox(130, 100, 70, 10, "51", "E-mail", exportadorEmail, 8);

    drawBox(10, 110, 40, 10, "52", "No. Factura", numFactura, 8);
    drawBox(50, 110, 20, 10, "53", "Fecha", fechaFactura, 7);
    drawBox(70, 110, 15, 10, "54", "País P.", paisProcedencia, 8, "center");
    drawBox(85, 110, 15, 10, "55", "Modo", modoTransporte, 8, "center");
    drawBox(100, 110, 15, 10, "56", "Bandera", bandera, 8, "center");
    drawBox(115, 110, 15, 10, "57", "Dpto", dptoDestino, 8, "center");
    drawBox(130, 110, 45, 10, "58", "Empresa transp.", empresaTransportadora, 7);
    drawBox(175, 110, 25, 10, "59", "Tasa $", tasaCambio, 8, "center");

    // --- CARGA Y VALORES USD ---
    drawBox(10, 120, 40, 10, "60", "Subpartida", subpartida, 9);
    drawBox(50, 120, 15, 10, "61", "Modalidad", modalidad, 8, "center");
    drawBox(65, 120, 15, 10, "65", "P. Origen", paisOrigen, 8, "center");
    drawBox(80, 120, 25, 10, "70", "Peso Bruto", pesoBruto, 8, "center");
    drawBox(105, 120, 25, 10, "71", "Peso Neto", pesoNeto, 8, "center");
    drawBox(130, 120, 20, 10, "72", "Embalaje", embalaje, 8, "center");
    drawBox(150, 120, 20, 10, "73", "Bultos", bultos, 8, "center");
    drawBox(170, 120, 30, 10, "76", "Cantidad", cantidad, 8, "center");

    drawBox(10, 130, 45, 10, "77", "Valor FOB USD", fobUsd, 9, "right");
    drawBox(55, 130, 45, 10, "78", "Valor Fletes USD", fletesUsd, 9, "right");
    drawBox(100, 130, 45, 10, "79", "Valor Seguros USD", segurosUsd, 9, "right");
    drawBox(145, 130, 55, 10, "80", "Valor Otros Gastos USD", otrosUsd, 9, "right");

    drawBox(10, 140, 90, 10, "81", "Sumatoria fletes, seguros y otros", sumatoriaUsd, 9, "right");
    drawBox(100, 140, 100, 10, "83", "VALOR ADUANA USD", valorAduanaUsd, 10, "center");

    // --- AUTOLIQUIDACIÓN MANUAL DIAN ---
    doc.setFillColor(0, 138, 59);
    doc.rect(10, 155, 5, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.text("Liquidación", 11, 175, { angle: 90 });

    doc.setFillColor(240, 255, 240);
    doc.rect(15, 155, 185, 5, 'F');
    doc.setTextColor(0, 138, 59);
    doc.text("Concepto", 17, 158);
    doc.text("%", 45, 158);
    doc.text("Base $", 80, 158);
    doc.text("Total liquidado $", 130, 158);
    doc.text("Total a pagar $", 170, 158);

    // Arancel
    drawBox(15, 160, 25, 6, "", "Arancel", "");
    drawBox(40, 160, 15, 6, "91", "", arancelPorc, 7, "center");
    drawBox(55, 160, 45, 6, "92", "", arancelBase, 8, "right");
    drawBox(100, 160, 50, 6, "93", "", arancelLiquidado, 8, "right");
    drawBox(150, 160, 50, 6, "94", "", arancelPagar, 8, "right");

    // IVA
    drawBox(15, 166, 25, 6, "", "I. V. A.", "");
    drawBox(40, 166, 15, 6, "95", "", ivaPorc, 7, "center");
    drawBox(55, 166, 45, 6, "96", "", ivaBase, 8, "right");
    drawBox(100, 166, 50, 6, "97", "", ivaLiquidado, 8, "right");
    drawBox(150, 166, 50, 6, "98", "", ivaPagar, 8, "right");

    // Sanciones 
    drawBox(15, 172, 25, 6, "", "Sanciones", "");
    drawBox(40, 172, 15, 6, "99", "", sancionesPorc, 7, "center");
    drawBox(55, 172, 45, 6, "100", "", sancionesBase, 8, "right");
    drawBox(100, 172, 50, 6, "101", "", sancionesLiquidado, 8, "right");
    drawBox(150, 172, 50, 6, "102", "", sancionesPagar, 8, "right");

    // Otros 
    drawBox(15, 178, 25, 6, "", "Otros", "");
    drawBox(40, 178, 15, 6, "103", "", otrosPorc, 7, "center");
    drawBox(55, 178, 45, 6, "104", "", otrosBase, 8, "right");
    drawBox(100, 178, 50, 6, "105", "", otrosLiquidado, 8, "right");
    drawBox(150, 178, 50, 6, "106", "", otrosPagar, 8, "right");

    // Total
    drawBox(100, 184, 50, 6, "107", "Total", totalLiquidado, 8, "right");

    // --- DESCRIPCIÓN ---
    doc.rect(10, 195, 190, 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(0, 138, 59);
    doc.text("90. Descripción de las mercancías (No inicie con lo señalado en el arancel. Incluya marcas, seriales y otros).", 12, 198);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    const lineasDesc = doc.splitTextToSize(descripcion.toUpperCase(), 185);
    doc.text(lineasDesc, 12, 203);

    // --- PIE DE PÁGINA (LEVANTE Y PAGOS EXACTO A LA IMAGEN) ---
    let botY = 222;
    
    // Fila 1
    drawBox(10, botY, 65, 8, "108", "Valor pagos anteriores:", valorPagosAnteriores, 8);
    drawBox(75, botY, 80, 8, "109", "Recibo oficial de pago anterior No.", reciboPagoAnterior, 8);
    drawBox(155, botY, 45, 8, "110", "Fecha:", fechaPagoAnterior, 8, "center");

    // Fila 2
    botY += 8;
    drawBox(10, botY, 90, 14, "111", "Espacio reservado DIAN - Actuación aduanera", actuacionAduanera, 7);
    drawBox(100, botY, 55, 14, "112", "Espacio reservado uso exclusivo Min. Relaciones Ext.", minRelaciones, 7);
    
    // Cajas 113 y 114
    doc.rect(155, botY, 45, 14);
    doc.setFont("helvetica", "bold"); doc.setFontSize(5); doc.setTextColor(0, 138, 59);
    doc.text("113.", 156, botY + 2.5);
    doc.setFont("helvetica", "normal"); doc.setTextColor(0,0,0);
    doc.text("No. Aceptación declaración", 160, botY + 2.5);
    doc.setFontSize(8); doc.text(numAceptacion, 157, botY + 8);
    
    doc.line(155, botY + 9, 200, botY + 9);
    doc.setFont("helvetica", "bold"); doc.setFontSize(5); doc.setTextColor(0, 138, 59);
    doc.text("114.", 156, botY + 11.5);
    doc.setFont("helvetica", "normal"); doc.setTextColor(0,0,0);
    doc.text("Fecha", 160, botY + 11.5);
    doc.setFontSize(7); doc.text(fechaAceptacion, 175, botY + 13);

    // Fila 3
    botY += 14;
    drawBox(10, botY, 65, 10, "115", "Levante No.", numLevante, 8);
    drawBox(75, botY, 30, 10, "116", "Fecha", fechaLevante, 8, "center");
    drawBox(105, botY, 50, 10, "", "Firma funcionario responsable", "", 8);
    
    // Cajas 117 y 118
    doc.rect(155, botY, 45, 10);
    doc.setFont("helvetica", "bold"); doc.setFontSize(5); doc.setTextColor(0, 138, 59);
    doc.text("117.", 156, botY + 2.5);
    doc.setFont("helvetica", "normal"); doc.setTextColor(0,0,0);
    doc.text("Nombre", 160, botY + 2.5);
    doc.setFontSize(7); doc.text(funcionarioNombre, 160, botY + 5);
    
    doc.setFont("helvetica", "bold"); doc.setFontSize(5); doc.setTextColor(0, 138, 59);
    doc.text("118.", 156, botY + 7.5);
    doc.setFont("helvetica", "normal"); doc.setTextColor(0,0,0);
    doc.text("C.C. No.", 160, botY + 7.5);
    doc.setFontSize(7); doc.text(funcionarioCC, 170, botY + 9);

    // Fila 4 (Firmas, Sellos, Pago Total)
    botY += 10;
    drawBox(10, botY, 65, 30, "", "Firma declarante", "");
    
    doc.rect(75, botY, 80, 30);
    doc.setFont("helvetica", "bold"); doc.setFontSize(7);
    doc.text("997. Espacio exclusivo para el sello", 115, botY + 4, {align: "center"});
    doc.text("de la entidad recaudadora", 115, botY + 7, {align: "center"});
    doc.setFontSize(6); doc.setTextColor(150,150,150);
    doc.text("(Fecha efectiva de la transacción)", 115, botY + 10, {align: "center"});
    doc.setTextColor(0,138,59);
    doc.text("Coloque el timbre de la máquina", 115, botY + 26, {align: "center"});
    doc.text("registradora al dorso de este formulario", 115, botY + 29, {align: "center"});

    // Caja 980 (Pago Total y Precio)
    doc.setLineWidth(1);
    doc.rect(155, botY, 45, 30);
    doc.setLineWidth(0.5);
    doc.line(155, botY + 8, 200, botY + 8);
    
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(0,0,0);
    doc.text("980. Pago total   $", 157, botY + 5);
    doc.rect(180, botY + 1.5, 18, 5.5);
    doc.setFontSize(9);
    doc.text(pagoTotal, 197, botY + 6, { align: "right" });

    doc.setFontSize(5); doc.setTextColor(0, 138, 59);
    doc.text("996. Espacio para el adhesivo de la entidad recaudadora", 177.5, botY + 11, {align: "center"});
    doc.text("(Número del adhesivo)", 177.5, botY + 13, {align: "center"});
    
    doc.setFontSize(10); doc.setFont("helvetica", "bold");
    doc.text("PRECIO MAXIMO DE", 177.5, botY + 22, { align: "center" });
    doc.text("VENTA AL PUBLICO", 177.5, botY + 25, { align: "center" });
    doc.text("$6.000", 177.5, botY + 28, { align: "center" });

    doc.setTextColor(220, 0, 0);
    doc.setFontSize(8);
    doc.text("Original: Dirección de Impuestos\ny Aduanas Nacionales", 10, botY + 34);
    
    doc.setFontSize(16); doc.setTextColor(0,0,0);
    doc.text("20064090000001", 115, botY + 36, {align: "center"});

    doc.save(`Declaracion_Importacion_500_${numFormulario}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      
      <div className="w-full max-w-5xl mb-4 flex justify-between items-center">
        <button onClick={() => router.back()} type="button" className="bg-white text-green-700 border border-green-700 px-4 py-2 rounded font-bold hover:bg-green-50 transition-colors flex shadow-sm">
          ← Atrás
        </button>
        <Link href="/" className="text-gray-500 font-bold hover:text-gray-800">🏠 Menú</Link>
      </div>

      <div className="w-full max-w-5xl bg-white shadow-2xl p-4 md:p-8">
        
        <h2 className="font-black text-xl text-center text-green-800 mb-6 uppercase">Simulador Formulario 500 DIAN</h2>
        
        <form onSubmit={generarPDF} className="border-4 border-green-700 p-2">
          
          {/* HEADER FORMULARIO REDISEÑADO TIPO DIAN OFICIAL */}
          <div className="border-b-2 border-green-700 flex flex-col mb-2">
            
            {/* Fila 1: Logos y Título */}
            <div className="flex border-b-2 border-green-700 items-stretch min-h-[60px]">
              <div className="w-1/4 p-2 flex items-center justify-center border-r-2 border-green-700">
                <img 
                  src="/logo_dian2.png" 
                  alt="DIAN" 
                  className="h-10 object-contain" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextSibling) nextSibling.style.display = 'flex';
                  }} 
                />
                <div className="hidden bg-black text-white rounded-full w-12 h-12 items-center justify-center font-bold text-xs text-center leading-tight">Logo<br/>DIAN</div>
              </div>
              <div className="w-2/4 p-2 flex items-center justify-center border-r-2 border-green-700">
                <h1 className="text-2xl font-bold text-black text-center leading-tight">Declaración de Importación</h1>
              </div>
              <div className="w-1/4 flex items-stretch">
                <div className="flex-1 flex flex-col items-center justify-center p-1 border-r-2 border-green-700">
                  <div className="text-[10px] text-green-700 font-bold uppercase tracking-widest text-center">M U I S C A</div>
                  <div className="text-[5px] text-gray-500 text-center leading-none mt-1 hidden md:block">Modelo Único de Ingresos, Servicio y Control Automatizado</div>
                </div>
                <div className="bg-green-700 text-white flex items-center justify-center text-4xl font-bold w-20 shrink-0">
                  500
                </div>
              </div>
            </div>

            {/* Fila 2: Espacio Reservado, Año y Formulario */}
            <div className="flex">
              <div className="w-[60%] p-2 border-r-2 border-green-700 min-h-[80px]">
                <span className="text-[10px] text-gray-500">Espacio reservado para la DIAN</span>
              </div>
              <div className="w-[40%] flex flex-col">
                <div className="flex border-b-2 border-green-700">
                  <div className="w-1/2 p-1 flex items-center gap-2 border-r-2 border-green-700 bg-green-50/30">
                    <span className="text-[10px] text-green-800 font-bold ml-1">1. Año</span>
                    <input type="text" className="w-12 border border-green-700 text-sm font-bold text-center outline-none tracking-widest bg-white" value={anio} onChange={(e)=>setAnio(e.target.value)} maxLength={4} />
                  </div>
                  <div className="w-1/2 bg-green-50/30"></div>
                </div>
                <div className="p-2 flex flex-col flex-1 bg-green-50/30 items-center justify-center">
                  <div className="w-full text-[10px] text-green-800 font-bold mb-1">4. Número de formulario</div>
                  <input type="text" className="w-full text-xl md:text-2xl font-bold outline-none bg-transparent text-center" value={numFormulario} onChange={(e)=>setNumFormulario(e.target.value)} />
                  <div className="w-full mt-1">
                    <svg width="100%" height="30" preserveAspectRatio="none">
                      <pattern id="barcode" patternUnits="userSpaceOnUse" width="16" height="30">
                        <rect x="0" y="0" width="2" height="30" fill="black" />
                        <rect x="3" y="0" width="1" height="30" fill="black" />
                        <rect x="5" y="0" width="3" height="30" fill="black" />
                        <rect x="10" y="0" width="2" height="30" fill="black" />
                        <rect x="14" y="0" width="1" height="30" fill="black" />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#barcode)" />
                    </svg>
                    <div className="text-[7px] text-gray-600 mt-1 text-center font-mono">(415)7707212489984(8020)0500600000000 0</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* IMPORTADOR */}
          <div className="flex border-b-2 border-green-700 mb-2">
            <div className="w-6 bg-green-700 text-white flex items-center justify-center text-xs font-bold [writing-mode:vertical-rl] rotate-180 p-1">Importador</div>
            <div className="flex-1 grid grid-cols-12 gap-1 p-1">
               <Field num="5" label="NIT" value={impNit} onChange={(e:any)=>setImpNit(e.target.value)} colSpan={3} />
               <Field num="6" label="DV" value={impDv} onChange={(e:any)=>setImpDv(e.target.value)} colSpan={1} />
               <Field num="11" label="Apellidos y nombres o razón social" value={impRazonSocial} onChange={(e:any)=>setImpRazonSocial(e.target.value)} colSpan={8} />
               <Field num="13" label="Dirección" value={impDireccion} onChange={(e:any)=>setImpDireccion(e.target.value)} colSpan={6} />
               <Field num="15" label="Teléfono" value={impTelefono} onChange={(e:any)=>setImpTelefono(e.target.value)} colSpan={3} />
               <Field num="12" label="Ad." value={impCodAdmon} onChange={(e:any)=>setImpCodAdmon(e.target.value)} colSpan={1} />
               <Field num="16" label="Dp." value={impCodDpto} onChange={(e:any)=>setImpCodDpto(e.target.value)} colSpan={1} />
               <Field num="17" label="C. Mun" value={impCodCiudad} onChange={(e:any)=>setImpCodCiudad(e.target.value)} colSpan={1} />
            </div>
          </div>

          {/* DECLARANTE */}
          <div className="flex border-b-2 border-green-700 mb-2">
            <div className="w-6 bg-green-700 text-white flex items-center justify-center text-xs font-bold [writing-mode:vertical-rl] rotate-180 p-1">Declarante</div>
            <div className="flex-1 grid grid-cols-12 gap-1 p-1">
               <Field num="24" label="NIT" value={decNit} onChange={(e:any)=>setDecNit(e.target.value)} colSpan={3} />
               <Field num="25" label="DV" value={decDv} onChange={(e:any)=>setDecDv(e.target.value)} colSpan={1} />
               <Field num="26" label="Razón social declarante" value={decRazonSocial} onChange={(e:any)=>setDecRazonSocial(e.target.value)} colSpan={6} />
               <Field num="27" label="T.U." value={decTipoUsu} onChange={(e:any)=>setDecTipoUsu(e.target.value)} colSpan={1} />
               <Field num="28" label="Cód" value={decCodUsu} onChange={(e:any)=>setDecCodUsu(e.target.value)} colSpan={1} />
               <Field num="29" label="Número doc. identificación" value={decNumId} onChange={(e:any)=>setDecNumId(e.target.value)} colSpan={4} />
               <Field num="30" label="Apellidos y nombres" value={decNombres} onChange={(e:any)=>setDecNombres(e.target.value)} colSpan={8} />
            </div>
          </div>

          {/* DATOS LOGÍSTICOS */}
          <div className="grid grid-cols-12 gap-1 mb-2 border-b-2 border-green-700 pb-2">
            <Field num="41" label="Lugar Ingre." value={codLugarIngreso} onChange={(e:any)=>setCodLugarIngreso(e.target.value)} colSpan={2} />
            <Field num="42" label="Depósito" value={codDeposito} onChange={(e:any)=>setCodDeposito(e.target.value)} colSpan={2} />
            <Field num="43" label="Manifiesto" value={manifiesto} onChange={(e:any)=>setManifiesto(e.target.value)} colSpan={3} />
            <Field num="44" label="Fecha M." value={fechaManifiesto} onChange={(e:any)=>setFechaManifiesto(e.target.value)} colSpan={1} />
            <Field num="45" label="Doc. Transporte" value={docTransporte} onChange={(e:any)=>setDocTransporte(e.target.value)} colSpan={3} />
            <Field num="46" label="Fecha Doc" value={fechaDocTransporte} onChange={(e:any)=>setFechaDocTransporte(e.target.value)} colSpan={1} />
            
            <Field num="47" label="Nombre exportador o proveedor" value={exportadorNombre} onChange={(e:any)=>setExportadorNombre(e.target.value)} colSpan={8} />
            <Field num="48" label="Ciudad" value={exportadorCiudad} onChange={(e:any)=>setExportadorCiudad(e.target.value)} colSpan={3} />
            <Field num="49" label="C. País" value={exportadorCodPais} onChange={(e:any)=>setExportadorCodPais(e.target.value)} colSpan={1} />

            <Field num="50" label="Dirección exportador" value={exportadorDireccion} onChange={(e:any)=>setExportadorDireccion(e.target.value)} colSpan={7} />
            <Field num="51" label="E-mail" value={exportadorEmail} onChange={(e:any)=>setExportadorEmail(e.target.value)} colSpan={5} />

            <Field num="52" label="No. Factura" value={numFactura} onChange={(e:any)=>setNumFactura(e.target.value)} colSpan={3} />
            <Field num="53" label="F. Fac" value={fechaFactura} onChange={(e:any)=>setFechaFactura(e.target.value)} colSpan={1} />
            <Field num="54" label="P. Proc" value={paisProcedencia} onChange={(e:any)=>setPaisProcedencia(e.target.value)} colSpan={1} />
            <Field num="55" label="Modo" value={modoTransporte} onChange={(e:any)=>setModoTransporte(e.target.value)} colSpan={1} />
            <Field num="56" label="Bandera" value={bandera} onChange={(e:any)=>setBandera(e.target.value)} colSpan={1} />
            <Field num="57" label="Dpto D." value={dptoDestino} onChange={(e:any)=>setDptoDestino(e.target.value)} colSpan={1} />
            <Field num="58" label="Empresa transportadora" value={empresaTransportadora} onChange={(e:any)=>setEmpresaTransportadora(e.target.value)} colSpan={3} />
            <Field num="59" label="Tasa Cambio $" value={tasaCambio} onChange={(e:any)=>setTasaCambio(e.target.value)} colSpan={1} />
          </div>

          {/* DATOS CARGA */}
          <div className="grid grid-cols-12 gap-1 mb-2 border-b-2 border-green-700 pb-2">
            <Field num="60" label="Subpartida" value={subpartida} onChange={(e:any)=>setSubpartida(e.target.value)} colSpan={3} />
            <Field num="61" label="Modalidad" value={modalidad} onChange={(e:any)=>setModalidad(e.target.value)} colSpan={1} />
            <Field num="65" label="P. Origen" value={paisOrigen} onChange={(e:any)=>setPaisOrigen(e.target.value)} colSpan={1} />
            <Field num="70" label="Peso Bruto kgs" value={pesoBruto} onChange={(e:any)=>setPesoBruto(e.target.value)} colSpan={2} />
            <Field num="71" label="Peso Neto kgs" value={pesoNeto} onChange={(e:any)=>setPesoNeto(e.target.value)} colSpan={2} />
            <Field num="72" label="Embalaje" value={embalaje} onChange={(e:any)=>setEmbalaje(e.target.value)} colSpan={1} />
            <Field num="73" label="Bultos" value={bultos} onChange={(e:any)=>setBultos(e.target.value)} colSpan={1} />
            <Field num="76" label="Cantidad" value={cantidad} onChange={(e:any)=>setCantidad(e.target.value)} colSpan={1} />

            <Field num="77" label="Valor FOB USD" value={fobUsd} onChange={(e:any)=>setFobUsd(e.target.value)} colSpan={3} />
            <Field num="78" label="Valor Fletes USD" value={fletesUsd} onChange={(e:any)=>setFletesUsd(e.target.value)} colSpan={3} />
            <Field num="79" label="Valor Seguros USD" value={segurosUsd} onChange={(e:any)=>setSegurosUsd(e.target.value)} colSpan={3} />
            <Field num="80" label="Otros Gastos USD" value={otrosUsd} onChange={(e:any)=>setOtrosUsd(e.target.value)} colSpan={3} />

            <Field num="81" label="Sumatoria (Fletes+Seg+Otros)" value={sumatoriaUsd} onChange={(e:any)=>setSumatoriaUsd(e.target.value)} colSpan={6} />
            <Field num="83" label="VALOR ADUANA USD" value={valorAduanaUsd} onChange={(e:any)=>setValorAduanaUsd(e.target.value)} colSpan={6} />
          </div>

          {/* AUTOLIQUIDACIÓN MANUAL */}
          <div className="flex border-b-2 border-green-700 mb-2 bg-green-50">
            <div className="w-6 bg-green-700 text-white flex items-center justify-center text-xs font-bold [writing-mode:vertical-rl] rotate-180 p-1">Autoliquidación</div>
            <div className="flex-1 p-2 grid grid-cols-12 gap-x-2 gap-y-1 text-xs">
               <div className="col-span-2 font-bold text-green-800 text-center">Concepto</div>
               <div className="col-span-1 font-bold text-green-800 text-center">%</div>
               <div className="col-span-3 font-bold text-green-800 text-center">Base $</div>
               <div className="col-span-3 font-bold text-green-800 text-center">Total liquidado $</div>
               <div className="col-span-3 font-bold text-green-800 text-center">Total a pagar $</div>

               {/* Arancel */}
               <div className="col-span-2 flex items-center font-bold">Arancel</div>
               <Field num="91" label="" value={arancelPorc} onChange={(e:any)=>setArancelPorc(e.target.value)} colSpan={1} />
               <Field num="92" label="" value={arancelBase} onChange={(e:any)=>setArancelBase(e.target.value)} colSpan={3} />
               <Field num="93" label="" value={arancelLiquidado} onChange={(e:any)=>setArancelLiquidado(e.target.value)} colSpan={3} />
               <Field num="94" label="" value={arancelPagar} onChange={(e:any)=>setArancelPagar(e.target.value)} colSpan={3} />

               {/* IVA */}
               <div className="col-span-2 flex items-center font-bold">I. V. A.</div>
               <Field num="95" label="" value={ivaPorc} onChange={(e:any)=>setIvaPorc(e.target.value)} colSpan={1} />
               <Field num="96" label="" value={ivaBase} onChange={(e:any)=>setIvaBase(e.target.value)} colSpan={3} />
               <Field num="97" label="" value={ivaLiquidado} onChange={(e:any)=>setIvaLiquidado(e.target.value)} colSpan={3} />
               <Field num="98" label="" value={ivaPagar} onChange={(e:any)=>setIvaPagar(e.target.value)} colSpan={3} />

               {/* Sanciones */}
               <div className="col-span-2 flex items-center font-bold">Sanciones</div>
               <Field num="99" label="" value={sancionesPorc} onChange={(e:any)=>setSancionesPorc(e.target.value)} colSpan={1} />
               <Field num="100" label="" value={sancionesBase} onChange={(e:any)=>setSancionesBase(e.target.value)} colSpan={3} />
               <Field num="101" label="" value={sancionesLiquidado} onChange={(e:any)=>setSancionesLiquidado(e.target.value)} colSpan={3} />
               <Field num="102" label="" value={sancionesPagar} onChange={(e:any)=>setSancionesPagar(e.target.value)} colSpan={3} />

               {/* Otros */}
               <div className="col-span-2 flex items-center font-bold">Otros</div>
               <Field num="103" label="" value={otrosPorc} onChange={(e:any)=>setOtrosPorc(e.target.value)} colSpan={1} />
               <Field num="104" label="" value={otrosBase} onChange={(e:any)=>setOtrosBase(e.target.value)} colSpan={3} />
               <Field num="105" label="" value={otrosLiquidado} onChange={(e:any)=>setOtrosLiquidado(e.target.value)} colSpan={3} />
               <Field num="106" label="" value={otrosPagar} onChange={(e:any)=>setOtrosPagar(e.target.value)} colSpan={3} />

               {/* Total */}
               <div className="col-span-6 flex justify-end items-center font-bold text-green-800 pr-2">Total</div>
               <Field num="107" label="" value={totalLiquidado} onChange={(e:any)=>setTotalLiquidado(e.target.value)} colSpan={3} />
            </div>
          </div>

          <div className="mb-2">
             <div className="text-[10px] text-green-800 font-bold mb-1">90. Descripción de las mercancías</div>
             <textarea className="w-full border border-green-600 p-2 text-xs outline-none uppercase min-h-[60px]" value={descripcion} onChange={(e)=>setDescripcion(e.target.value)}></textarea>
          </div>

          {/* PIE DE PÁGINA (LEVANTE Y PAGOS) */}
          <div className="grid grid-cols-12 gap-1 mb-2 border-b-2 border-green-700 pb-2">
            <Field num="108" label="Valor pagos anteriores:" value={valorPagosAnteriores} onChange={(e:any)=>setValorPagosAnteriores(e.target.value)} colSpan={4} />
            <Field num="109" label="Recibo oficial de pago anterior No." value={reciboPagoAnterior} onChange={(e:any)=>setReciboPagoAnterior(e.target.value)} colSpan={5} />
            <Field num="110" label="Fecha:" value={fechaPagoAnterior} onChange={(e:any)=>setFechaPagoAnterior(e.target.value)} colSpan={3} />

            <Field num="111" label="Espacio reservado DIAN - Actuación aduanera" value={actuacionAduanera} onChange={(e:any)=>setActuacionAduanera(e.target.value)} colSpan={5} />
            <Field num="112" label="Uso exclusivo Min. Relaciones Exteriores" value={minRelaciones} onChange={(e:any)=>setMinRelaciones(e.target.value)} colSpan={4} />
            <div className="col-span-3 grid grid-rows-2 gap-1">
               <Field num="113" label="No. Aceptación" value={numAceptacion} onChange={(e:any)=>setNumAceptacion(e.target.value)} />
               <Field num="114" label="Fecha" value={fechaAceptacion} onChange={(e:any)=>setFechaAceptacion(e.target.value)} />
            </div>

            <Field num="115" label="Levante No." value={numLevante} onChange={(e:any)=>setNumLevante(e.target.value)} colSpan={3} />
            <Field num="116" label="Fecha" value={fechaLevante} onChange={(e:any)=>setFechaLevante(e.target.value)} colSpan={2} />
            <div className="col-span-4 border border-green-600 bg-white p-1 flex flex-col justify-end">
                <span className="text-[9px] text-green-800 font-bold leading-tight">Firma funcionario responsable</span>
            </div>
            <div className="col-span-3 grid grid-rows-2 gap-1">
               <Field num="117" label="Nombre" value={funcionarioNombre} onChange={(e:any)=>setFuncionarioNombre(e.target.value)} />
               <Field num="118" label="C.C. No." value={funcionarioCC} onChange={(e:any)=>setFuncionarioCC(e.target.value)} />
            </div>

            <div className="col-span-4 border border-green-600 bg-white p-1 h-24 flex flex-col">
                <span className="text-[9px] text-green-800 font-bold leading-tight mb-1">Firma declarante</span>
            </div>
            <div className="col-span-5 border border-green-600 bg-white p-1 h-24 flex flex-col items-center justify-center">
                <div className="text-[10px] font-bold text-green-800 leading-tight">997. Espacio exclusivo para el sello</div>
                <div className="text-[10px] font-bold text-green-800 leading-tight">de la entidad recaudadora</div>
                <div className="text-[8px] text-gray-500 mt-1">(Fecha efectiva de la transacción)</div>
            </div>
            <div className="col-span-3 flex flex-col gap-1">
                <Field num="980" label="Pago total $" value={pagoTotal} onChange={(e:any)=>setPagoTotal(e.target.value)} />
                <div className="border border-green-600 bg-white p-1 flex-1 flex flex-col items-center justify-center text-center">
                    <span className="text-[8px] text-green-700">996. Espacio para el adhesivo de la entidad recaudadora</span>
                    <span className="text-[10px] font-black text-green-700 mt-2">PRECIO MÁXIMO DE<br/>VENTA AL PUBLICO<br/>$6.000</span>
                </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-green-700 text-white font-black py-5 rounded shadow-xl hover:bg-green-800 transition-all text-xl mt-6 uppercase border-b-4 border-green-900">
            📥 Descargar Declaración de Importación
          </button>
          
          {/* NUEVO BOTÓN PARA AVANZAR A LA FACTURA COMERCIAL */}
          <Link href="/factura" className="w-full block text-center bg-green-100 text-green-800 font-bold py-4 px-4 rounded shadow hover:bg-green-200 transition-colors mt-4 text-lg uppercase border-b-4 border-green-300">
            Siguiente Paso: Factura Comercial →
          </Link>
        </form>

      </div>
    </main>
  );
}