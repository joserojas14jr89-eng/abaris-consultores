import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Building2, Receipt, Users, LogOut, FileText, 
  UploadCloud, CheckCircle, Shield, ChevronRight, 
  DollarSign, Lock, CalendarDays, Wallet, User, Phone, CreditCard, RefreshCw,
  Camera, Edit2, Clock, Bell, Download, AlertCircle, TrendingUp, PlusCircle
} from 'lucide-react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3GNdBNC52cfPWHdrNFIVgOgBz9pIhafOcK7dJsyXmUSksOVY27DattCK-EIkd0rSz/exec';

const apiCall = async (action, payload = {}) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, payload })
    });
    return await response.json();
  } catch (error) {
    return { status: 'error', message: 'Error de conexión con el servidor.' };
  }
};

const AbarisLogo = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative flex items-center justify-center shrink-0`}>
    <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9E7B3" />
          <stop offset="50%" stopColor="#C5A059" />
          <stop offset="100%" stopColor="#8A6D3B" />
        </linearGradient>
      </defs>
      <path d="M150 40 L250 240 L200 240 L150 140 L100 240 L50 240 Z" fill="url(#goldGrad)" />
      <path d="M150 160 L180 200 L120 200 Z" fill="#6B4C9A" />
      <path d="M90 150 L150 220 L210 150 L180 140 L150 180 L120 140 Z" fill="#4A3073" />
    </svg>
  </div>
);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(Number(amount) || 0);
};

export default function App() {
  const [user, setUser] = useState(null);
  
  const [invoices, setInvoices] = useState([]);
  const [cobranzas, setCobranzas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [abarisGastos, setAbarisGastos] = useState([]);
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [rucInput, setRucInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState({ type: '', text: '' });

  const loadInitialData = async () => {
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const result = await response.json();
      if (result.status === 'success') {
        setInvoices(result.data.invoices || []);
        setCobranzas(result.data.cobranzas || []);
        setClientes((result.data.usersData || []).filter(c => c.email !== 'jose.rojas14.jr89@gmail.com'));
        setAbarisGastos(result.data.abarisGastos || []);
      }
    } catch (e) { console.error(e); }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setAuthMessage({ type: '', text: '' }); setIsLoading(true);
    const response = await apiCall('login', { email: emailInput, password: passwordInput });
    if (response.status === 'success') {
      setUser(response.user);
      loadInitialData();
    } else { setAuthMessage({ type: 'error', text: response.message || 'Error al iniciar sesión.' }); }
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setAuthMessage({ type: '', text: '' }); setIsLoading(true);
    const payload = { email: emailInput, password: passwordInput, razonSocial: nameInput, ruc: rucInput, telefono: phoneInput };
    const response = await apiCall('addUser', payload);
    if (response.status === 'success') {
      setAuthMessage({ type: 'success', text: '¡Cuenta creada! Ingresando...' });
      setTimeout(() => { 
        setUser({ email: emailInput, role: 'client', name: nameInput, ruc: rucInput }); 
        loadInitialData();
      }, 1500);
    } else { setAuthMessage({ type: 'error', text: response.message || 'Error.' }); }
    setIsLoading(false);
  };

  const handleLogout = () => { setUser(null); setEmailInput(''); setPasswordInput(''); setAuthMessage({ type: '', text: '' }); };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A1128] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-4"><AbarisLogo className="w-28 h-28" /></div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-[#D4AF37]">ABARIS CONSULTORES</h2>
          <p className="mt-2 text-center text-sm text-slate-400 uppercase tracking-widest">Soluciones Contables y Financieras</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#121A35]/90 backdrop-blur py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-slate-700/50 mx-4 sm:mx-0">
            <form className="space-y-5" onSubmit={isRegisterMode ? handleRegister : handleLogin}>
              {isRegisterMode && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Nombre o Razón Social *</label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-slate-500" /></div>
                      <input type="text" required value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-600 rounded-md bg-[#0A1128] text-white focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm" placeholder="Tu Nombre o Empresa" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300">RUC *</label>
                      <div className="mt-1 relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><CreditCard className="h-5 w-5 text-slate-500" /></div><input type="text" required value={rucInput} onChange={(e) => setRucInput(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-600 rounded-md bg-[#0A1128] text-white focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm" placeholder="1234567-8" /></div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300">Teléfono</label>
                      <div className="mt-1 relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-slate-500" /></div><input type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-600 rounded-md bg-[#0A1128] text-white focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm" placeholder="09XX XXX XXX" /></div>
                    </div>
                  </div>
                </>
              )}
              <div><label className="block text-sm font-medium text-slate-300">Correo Electrónico {isRegisterMode && '*'}</label><div className="mt-1 relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-500" /></div><input type="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-600 rounded-md bg-[#0A1128] text-white focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm" placeholder="tu@correo.com" /></div></div>
              <div><label className="block text-sm font-medium text-slate-300">Contraseña {isRegisterMode && '*'}</label><div className="mt-1 relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Shield className="h-5 w-5 text-slate-500" /></div><input type="password" required value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-600 rounded-md bg-[#0A1128] text-white focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm" placeholder="••••••••" /></div></div>
              
              {authMessage.text && (<div className={`text-sm text-center p-2 rounded border ${authMessage.type === 'error' ? 'text-red-400 bg-red-900/20 border-red-900/50' : 'text-green-400 bg-green-900/20 border-green-900/50'}`}>{authMessage.text}</div>)}
              
              <div><button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-bold text-[#0A1128] bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#C5A059] disabled:opacity-70 mt-4">{isLoading ? 'Procesando...' : (isRegisterMode ? 'Crear Cuenta Segura' : 'Ingresar al Portal')}</button></div>
            </form>
            <div className="mt-6 text-center border-t border-slate-700 pt-4"><button onClick={() => { setIsRegisterMode(!isRegisterMode); setAuthMessage({type:'', text:''}); }} className="text-sm text-[#D4AF37] hover:text-white font-medium transition-colors">{isRegisterMode ? '¿Ya tienes una cuenta? Inicia sesión aquí' : '¿Eres nuevo cliente? Solicita tu cuenta aquí'}</button></div>
          </div>
        </div>
      </div>
    );
  }

  return user.role === 'admin' ? 
    <AdminPanel user={user} onLogout={handleLogout} clientes={clientes} cobranzas={cobranzas} invoices={invoices} abarisGastos={abarisGastos} refreshData={loadInitialData} /> 
    : 
    <ClientPanel user={user} onLogout={handleLogout} cobranzas={cobranzas.filter(c => c.userEmail === user.email)} invoices={invoices.filter(i => i.userEmail === user.email)} refreshData={loadInitialData} />;
}

// ==========================================
// 3. PANEL DE ADMINISTRADOR
// ==========================================
function AdminPanel({ user, onLogout, clientes, cobranzas, invoices, abarisGastos, refreshData }) {
  const [activeTab, setActiveTab] = useState('facturas_admin');
  
  const [importClient, setImportClient] = useState('');
  const [importPeriod, setImportPeriod] = useState('');
  const [exportClient, setExportClient] = useState('');
  const [exportPeriod, setExportPeriod] = useState('');

  const [cobClient, setCobClient] = useState('');
  const [cobPeriodo, setCobPeriodo] = useState('');
  const [cobMonto, setCobMonto] = useState('');
  const [isBilling, setIsBilling] = useState(false);

  const [gastoFecha, setGastoFecha] = useState('');
  const [gastoConcepto, setGastoConcepto] = useState('');
  const [gastoMonto, setGastoMonto] = useState('');

  const clientesConVencimiento = useMemo(() => {
    return clientes.map(c => {
      if (!c.ruc) return { ...c, diaVencimiento: null, digito: null };
      const match = String(c.ruc).match(/(\d)(?:-\d)?$/);
      if (!match) return { ...c, diaVencimiento: null, digito: null };
      const digito = parseInt(match[1]);
      const dia = (digito * 2) + 7;
      return { ...c, diaVencimiento: dia, digito };
    }).sort((a, b) => (a.diaVencimiento || 99) - (b.diaVencimiento || 99));
  }, [clientes]);

  const ingresosAbaris = useMemo(() => {
    return cobranzas.filter(c => c.estado === 'Pagado').reduce((acc, curr) => acc + Number(curr.monto || 0), 0);
  }, [cobranzas]);

  const egresosAbaris = useMemo(() => {
    return abarisGastos.reduce((acc, curr) => acc + Number(curr.monto || 0), 0);
  }, [abarisGastos]);

  const rentabilidadNeta = ingresosAbaris - egresosAbaris;

  const handleFacturar = async (e) => {
    e.preventDefault(); setIsBilling(true);
    await apiCall('addCobranza', { userEmail: cobClient, periodo: cobPeriodo, monto: cobMonto });
    alert("Honorario generado con éxito.");
    setCobClient(''); setCobPeriodo(''); setCobMonto('');
    setIsBilling(false);
    refreshData();
  };

  const confirmarPago = async (id) => {
    await apiCall('updateCobranza', { id: id, data: { estado: 'Pagado' } });
    refreshData();
  };

  const handleExportSET = (e) => {
    e.preventDefault();
    if (!exportClient || !exportPeriod) return alert("Selecciona cliente y periodo.");
    const facturasFiltradas = invoices.filter(i => i.userEmail === exportClient && String(i.fecha).startsWith(exportPeriod));
    
    let csvContent = "data:text/csv;charset=utf-8,Tipo,RUC,RazonSocial,Fecha,Monto,IVA10,IVA5,CDC\n";
    facturasFiltradas.forEach(f => {
      csvContent += `${f.tipo || 'Gasto'},${f.ruc || ''},${f.razonSocial || ''},${f.fecha || ''},${f.monto || 0},${f.iva10 || 0},${f.iva5 || 0},${f.cdc || ''}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `REG_SET_${exportClient}_${exportPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR ADMIN */}
      <div className="w-64 bg-[#0A1128] text-white flex flex-col border-r border-slate-800 shrink-0 hidden md:flex">
        <div className="p-6 flex flex-col items-center border-b border-slate-800"><AbarisLogo className="w-16 h-16 mb-3" /><h1 className="text-lg font-bold text-[#D4AF37] tracking-wider text-center">ABARIS</h1><p className="text-xs text-slate-400 mt-1 uppercase">Admin Panel</p></div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('facturas_admin')} className={`w-full flex items-center p-3 rounded-lg text-sm transition-colors ${activeTab === 'facturas_admin' ? 'bg-slate-800 text-[#D4AF37]' : 'text-slate-300 hover:bg-slate-800/50'}`}><Receipt size={18} className="mr-3"/> Facturas y SET</button>
          <button onClick={() => setActiveTab('vencimientos')} className={`w-full flex items-center p-3 rounded-lg text-sm transition-colors ${activeTab === 'vencimientos' ? 'bg-slate-800 text-[#D4AF37]' : 'text-slate-300 hover:bg-slate-800/50'}`}><CalendarDays size={18} className="mr-3"/> Vencimientos SET</button>
          <button onClick={() => setActiveTab('clientes')} className={`w-full flex items-center p-3 rounded-lg text-sm transition-colors ${activeTab === 'clientes' ? 'bg-slate-800 text-[#D4AF37]' : 'text-slate-300 hover:bg-slate-800/50'}`}><Users size={18} className="mr-3"/> Directorio Clientes</button>
          <button onClick={() => setActiveTab('cobranzas')} className={`w-full flex items-center p-3 rounded-lg text-sm transition-colors ${activeTab === 'cobranzas' ? 'bg-slate-800 text-[#D4AF37]' : 'text-slate-300 hover:bg-slate-800/50'}`}><DollarSign size={18} className="mr-3"/> Control Cobranzas</button>
          <button onClick={() => setActiveTab('finanzas_estudio')} className={`w-full flex items-center p-3 rounded-lg text-sm transition-colors ${activeTab === 'finanzas_estudio' ? 'bg-slate-800 text-[#D4AF37]' : 'text-slate-300 hover:bg-slate-800/50'}`}><TrendingUp size={18} className="mr-3"/> Finanzas Abaris</button>
        </nav>
        <div className="p-4 border-t border-slate-800"><button onClick={onLogout} className="w-full flex items-center justify-center p-3 bg-red-900/40 text-red-300 rounded-lg text-sm"><LogOut size={18} className="mr-2" /> Cerrar Sesión</button></div>
      </div>

      <div className="flex-1 overflow-auto p-6 md:p-8">
        
        {/* Cabecera Móvil */}
        <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3"><AbarisLogo className="w-10 h-10" /><div><h1 className="text-sm font-bold text-[#0A1128]">{user.name}</h1><p className="text-xs text-slate-500">Administrador</p></div></div>
          <button onClick={onLogout} className="p-2 text-red-500 bg-red-50 rounded-lg"><LogOut className="w-5 h-5" /></button>
        </div>
        
        {/* TAB: FACTURAS Y SET */}
        {activeTab === 'facturas_admin' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-[#0A1128]">Gestión Tributaria y Conexión SET</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center"><Download className="mr-2 text-[#6B4B9A]"/> 1. Importar Facturas Electrónicas (Excel Marangatu)</h3>
              <p className="text-sm text-slate-500 mb-4">Sube el reporte de la SET para cruzar las facturas emitidas/recibidas con el portal del cliente.</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div><label className="text-xs font-bold text-slate-600">Cliente</label><select value={importClient} onChange={e=>setImportClient(e.target.value)} className="w-full border p-2 rounded bg-slate-50 text-sm"><option value="">Seleccionar...</option>{clientes.map(c => <option key={c.email} value={c.email}>{c.razonSocial}</option>)}</select></div>
                <div><label className="text-xs font-bold text-slate-600">Periodo</label><input type="month" value={importPeriod} onChange={e=>setImportPeriod(e.target.value)} className="w-full border p-2 rounded bg-slate-50 text-sm" /></div>
                <div><label className="text-xs font-bold text-slate-600">Archivo Excel</label><input type="file" accept=".xlsx,.xls,.csv" className="w-full border p-1 rounded bg-slate-50 text-sm" /></div>
                <button onClick={() => alert("Función de lectura lista. Selecciona el archivo exportado de Marangatu.")} className="bg-[#6B4B9A] text-white px-4 py-2.5 rounded-lg text-sm font-bold">Procesar Excel</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center"><UploadCloud className="mr-2 text-[#C5A059]"/> 2. Exportar Comprobantes para Presentación (.TXT / .CSV)</h3>
              <p className="text-sm text-slate-500 mb-4">Genera el archivo unificado de comprobantes físicos y electrónicos listos para Marangatu.</p>
              <form onSubmit={handleExportSET} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div><label className="text-xs font-bold text-slate-600">Cliente</label><select required value={exportClient} onChange={e=>setExportClient(e.target.value)} className="w-full border p-2 rounded bg-slate-50 text-sm"><option value="">Seleccionar...</option>{clientes.map(c => <option key={c.email} value={c.email}>{c.razonSocial}</option>)}</select></div>
                <div><label className="text-xs font-bold text-slate-600">Periodo a Presentar</label><input required type="month" value={exportPeriod} onChange={e=>setExportPeriod(e.target.value)} className="w-full border p-2 rounded bg-slate-50 text-sm" /></div>
                <button type="submit" className="bg-[#0A1128] text-[#D4AF37] border border-[#D4AF37] px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center"><Download size={16} className="mr-2" /> Descargar Archivo SET</button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <h3 className="text-lg font-bold p-5 border-b text-slate-800">Registro Global de Comprobantes</h3>
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b"><tr><th className="p-4">Fecha</th><th className="p-4">Cliente</th><th className="p-4">Proveedor / RUC</th><th className="p-4">Origen</th><th className="p-4 text-right">Monto</th></tr></thead>
                  <tbody className="divide-y">
                     {invoices.length === 0 ? <tr><td colSpan="5" className="p-6 text-center text-slate-400">No hay facturas cargadas.</td></tr> : 
                      invoices.map((inv, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                           <td className="p-4 text-slate-600">{inv.fecha}</td>
                           <td className="p-4 font-bold text-slate-900">{inv.userEmail}</td>
                           <td className="p-4"><p className="font-semibold">{inv.razonSocial || 'Desconocido'}</p><p className="text-xs text-slate-500">{inv.ruc}</p></td>
                           <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold bg-slate-100 text-slate-700">{inv.origen || 'App Móvil'}</span></td>
                           <td className="p-4 text-right font-black text-slate-900">{formatCurrency(inv.monto)}</td>
                        </tr>
                      ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* TAB: VENCIMIENTOS SET */}
        {activeTab === 'vencimientos' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-[#0A1128]">Calendario de Vencimientos SET (Mes Actual)</h2>
            <p className="text-sm text-slate-500">Prioridad y fechas límite de liquidación organizadas por el dígito verificador del RUC.</p>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#0A1128] text-white">
                  <tr><th className="p-4">Día Límite</th><th className="p-4">Cliente</th><th className="p-4">RUC</th><th className="p-4 text-right">Prioridad</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {clientesConVencimiento.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-4 font-black text-lg text-[#0A1128]">{c.diaVencimiento ? `Día ${c.diaVencimiento}` : 'Sin RUC'}</td>
                      <td className="p-4 font-bold text-slate-800">{c.razonSocial}<br/><span className="text-xs text-slate-500 font-normal">{c.email}</span></td>
                      <td className="p-4 text-slate-600">{c.ruc || 'Falta cargar'}</td>
                      <td className="p-4 text-right">
                        {!c.diaVencimiento ? <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-bold">Incompleto</span> : 
                         c.diaVencimiento <= 13 ? <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center"><AlertCircle size={12} className="mr-1"/> Próximo</span> : 
                         <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center"><CheckCircle size={12} className="mr-1"/> En Fecha</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: DIRECTORIO CLIENTES */}
        {activeTab === 'clientes' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-[#0A1128]">Directorio de Clientes</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#0A1128] text-white"><tr><th className="p-4">Razón Social</th><th className="p-4">RUC</th><th className="p-4">Teléfono</th><th className="p-4">Estado</th></tr></thead>
                <tbody className="divide-y divide-slate-200">
                  {clientes.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">{c.razonSocial}<br/><span className="text-xs text-slate-500 font-normal">{c.email}</span></td>
                      <td className="p-4">{c.ruc}</td><td className="p-4">{c.telefono}</td>
                      <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold">Activo</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: COBRANZAS */}
        {activeTab === 'cobranzas' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-[#0A1128]">Control de Cobranzas Abaris</h2>
            <form onSubmit={handleFacturar} className="border border-slate-200 p-5 rounded-xl bg-white shadow-sm flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full"><label className="text-xs font-bold text-slate-600">Cliente</label><select required value={cobClient} onChange={e=>setCobClient(e.target.value)} className="w-full border p-2 rounded text-sm bg-slate-50"><option value="">Seleccionar...</option>{clientes.map(c=><option key={c.email} value={c.email}>{c.razonSocial}</option>)}</select></div>
              <div className="flex-1 w-full"><label className="text-xs font-bold text-slate-600">Periodo</label><input required type="text" placeholder="Ej. Nov 2026" value={cobPeriodo} onChange={e=>setCobPeriodo(e.target.value)} className="w-full border p-2 rounded text-sm bg-slate-50" /></div>
              <div className="flex-1 w-full"><label className="text-xs font-bold text-slate-600">Monto Gs.</label><input required type="number" value={cobMonto} onChange={e=>setCobMonto(e.target.value)} className="w-full border p-2 rounded text-sm bg-slate-50" /></div>
              <button disabled={isBilling} type="submit" className="bg-[#C5A059] text-[#0A1128] font-bold px-6 py-2 rounded-lg">{isBilling ? 'Facturando...':'Generar Deuda'}</button>
            </form>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b"><tr><th className="p-4">Periodo</th><th className="p-4">Cliente</th><th className="p-4 text-right">Monto</th><th className="p-4 text-center">Estado</th><th className="p-4 text-center">Acción</th></tr></thead>
                <tbody className="divide-y">
                  {cobranzas.map((cob, i) => (
                    <tr key={i}>
                      <td className="p-4 font-bold text-slate-700">{cob.periodo}</td><td className="p-4">{cob.userEmail}</td><td className="p-4 text-right font-medium">{formatCurrency(cob.monto)}</td>
                      <td className="p-4 text-center">
                        {cob.estado === 'Pagado' ? <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Pagado</span> : 
                         cob.estado === 'En Revisión' ? <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold">Revisión</span> : 
                         <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">Pendiente</span>}
                      </td>
                      <td className="p-4 text-center">
                        {cob.estado === 'En Revisión' && <button onClick={() => confirmarPago(cob.id)} className="text-xs text-green-700 border border-green-600 px-3 py-1 rounded-lg font-bold hover:bg-green-50">Aprobar</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: FINANZAS DE ABARIS */}
        {activeTab === 'finanzas_estudio' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-[#0A1128]">Finanzas Internas de Abaris</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs uppercase font-bold text-slate-500">Clientes Totales</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{clientes.length}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs uppercase font-bold text-slate-500">Ingresos Cobrados</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(ingresosAbaris)}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs uppercase font-bold text-slate-500">Egresos Operativos</p>
                <p className="text-2xl font-black text-red-600 mt-1">{formatCurrency(egresosAbaris)}</p>
              </div>
              <div className="bg-[#0A1128] p-5 rounded-xl text-white shadow-sm">
                <p className="text-xs uppercase font-bold text-[#D4AF37]">Rentabilidad Neta</p>
                <p className="text-2xl font-black mt-1">{formatCurrency(rentabilidadNeta)}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Registrar Egreso del Estudio</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div><label className="text-xs font-bold text-slate-600">Fecha</label><input type="date" value={gastoFecha} onChange={e=>setGastoFecha(e.target.value)} className="w-full border p-2 rounded text-sm bg-slate-50" /></div>
                <div><label className="text-xs font-bold text-slate-600">Concepto</label><input type="text" placeholder="Ej. Software / Papelería" value={gastoConcepto} onChange={e=>setGastoConcepto(e.target.value)} className="w-full border p-2 rounded text-sm bg-slate-50" /></div>
                <div><label className="text-xs font-bold text-slate-600">Monto Gs.</label><input type="number" value={gastoMonto} onChange={e=>setGastoMonto(e.target.value)} className="w-full border p-2 rounded text-sm bg-slate-50" /></div>
                <button onClick={() => alert("Gasto registrado")} className="bg-[#6B4B9A] text-white p-2.5 rounded-lg font-bold text-sm">Guardar Egreso</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ==========================================
// 4. PANEL DEL CLIENTE
// ==========================================
function ClientPanel({ user, onLogout, cobranzas, invoices, refreshData }) {
  const [activeTab, setActiveTab] = useState('gestion_cliente');
  
  const fileInputRef = useRef(null);
  const extractoInputRef = useRef(null);
  
  const [showOcrPreview, setShowOcrPreview] = useState(false);
  const [ocrData, setOcrData] = useState({ ruc: '', razonSocial: '', fecha: '', tipo: 'Gasto', monto: '', iva5: '0', iva10: '', fileBase64: '', fileName: '', mimeType: '' });
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSavingOcr, setIsSavingOcr] = useState(false);
  
  const [uploadMessage, setUploadMessage] = useState({ type: '', text: '', source: '' });

  const filterMonth = new Date().toISOString().slice(0,7);
  const summary = useMemo(() => {
    const currentInvoices = invoices.filter(i => String(i.fecha).startsWith(filterMonth));
    const ventas = currentInvoices.filter(i => i.tipo === 'Ingreso').reduce((a, c) => a + Number(c.monto || 0), 0);
    const compras = currentInvoices.filter(i => i.tipo === 'Gasto' || i.tipo === 'Compra').reduce((a, c) => a + Number(c.monto || 0), 0);
    return { ventas, compras, ivaAPagar: (ventas * 0.1) - (compras * 0.1) };
  }, [invoices, filterMonth]);

  const handleCaptureClick = () => { fileInputRef.current.click(); };

  // ==============================================================
  // COMPRESIÓN Y DIAGNÓSTICO (NUEVO BLOQUE PARA VER ERRORES)
  // ==============================================================
  const resizeAndCompressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("No se pudo leer la foto en el celular."));
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.onerror = () => reject(new Error("El celular bloqueó el renderizado de la imagen."));
        img.src = event.target.result;
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const maxDim = 1200;
            let width = img.width;
            let height = img.height;
            if (width > height && width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(dataUrl.split(',')[1]);
          } catch(e) {
            reject(new Error("Error al comprimir: " + e.message));
          }
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsProcessingFile(true); 
    setUploadMessage({ type: '', text: '', source: '' });
    
    try {
      const base64 = await resizeAndCompressImage(file);
      
      const resOcr = await apiCall('processOCR', { 
        fileBase64: base64,
        mimeType: 'image/jpeg',
        clientRuc: user.ruc || '' 
      });
      
      // DIAGNÓSTICO: Si algo falla, salta una alerta.
      if (resOcr.status === 'error') {
        alert("FALLO DE CONEXIÓN CON APPS SCRIPT:\n" + resOcr.message);
      } else if (resOcr.data && resOcr.data.error) {
        alert("ERROR EN GOOGLE GEMINI:\n" + JSON.stringify(resOcr.data.error).substring(0, 150));
      } else if (resOcr.data && resOcr.data.monto === 0) {
        alert("LA IA LEYÓ PERO NO ENCONTRÓ MONTO.\nDatos extraídos: " + JSON.stringify(resOcr.data));
      }

      if (resOcr && resOcr.status === 'success' && resOcr.data && resOcr.data.monto > 0) {
        const d = resOcr.data;
        setOcrData({
          ruc: d.ruc || '', 
          razonSocial: d.razonSocial || '', 
          fecha: d.fecha || new Date().toISOString().split('T')[0], 
          tipo: 'Gasto', 
          monto: String(d.monto), 
          iva5: String(d.iva5 || '0'), 
          iva10: String(d.iva10 || ''),
          fileBase64: base64, 
          fileName: `${new Date().getTime()}_factura.jpg`, 
          mimeType: 'image/jpeg'
        });
      } else {
        setOcrData({
          ruc: (resOcr?.data?.ruc) || '', 
          razonSocial: (resOcr?.data?.razonSocial) || '', 
          fecha: new Date().toISOString().split('T')[0],
          tipo: 'Gasto', monto: '', iva5: '0', iva10: '',
          fileBase64: base64, fileName: `${new Date().getTime()}_factura.jpg`, mimeType: 'image/jpeg'
        });
      }
    } catch (err) {
      alert("ERROR EN EL CELULAR: " + err.message);
    }

    setIsProcessingFile(false);
    setShowOcrPreview(true);
  };
  // ==============================================================

  const submitOcrForm = async (e) => {
    e.preventDefault(); setIsSavingOcr(true);
    const payload = {
      userEmail: user.email, 
      folderName: `${user.name} - ${user.ruc}`, 
      subFolder: "Costos",
      fileName: ocrData.fileName, 
      fileBase64: ocrData.fileBase64, 
      mimeType: ocrData.mimeType,
      fecha: ocrData.fecha, 
      ruc: ocrData.ruc, 
      razonSocial: ocrData.razonSocial || 'Comprobante Físico', 
      tipo: ocrData.tipo, 
      monto: ocrData.monto, 
      iva5: ocrData.iva5, 
      iva10: ocrData.iva10, 
      origen: 'App Móvil'
    };
    const response = await apiCall('addInvoice', payload);
    if (response.status === 'success') {
      setUploadMessage({ type: 'success', text: '¡Comprobante guardado en tu Drive y registrado en tu balance!', source: 'factura' });
      setShowOcrPreview(false); refreshData();
    } else { alert("Error al guardar comprobante."); }
    setIsSavingOcr(false);
  };

  const handleExtractoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsProcessingFile(true); setUploadMessage({ type: '', text: '', source: '' });

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const payload = {
        userEmail: user.email, folderName: `${user.name} - ${user.ruc}`, subFolder: "Extractos",
        fileName: `EXTRACTO_${new Date().getTime()}_${file.name}`, fileBase64: reader.result.split(',')[1], mimeType: file.type,
        fecha: new Date().toISOString().split('T')[0], ruc: user.ruc, razonSocial: 'Extracto Tarjeta (Servicios Digitales)', tipo: 'Extracto', monto: 0
      };
      const response = await apiCall('addInvoice', payload);
      setUploadMessage({ type: response.status === 'success' ? 'success' : 'error', text: response.status === 'success' ? '¡Extracto subido a tu carpeta de Drive!' : 'Error.', source: 'extracto' });
      setIsProcessingFile(false); refreshData();
    };
  };

  const handlePay = async (cobId) => {
    await apiCall('updateCobranza', { id: cobId, data: { estado: 'En Revisión' } });
    alert("¡Comprobante enviado! Abaris validará el pago en breve.");
    refreshData();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative">
      <header className="w-64 bg-[#0A1128] text-white flex flex-col border-r border-slate-800 shrink-0 hidden md:flex">
         <div className="p-6 flex flex-col items-center border-b border-slate-800"><AbarisLogo className="w-16 h-16 mb-3" /><h1 className="text-lg font-bold text-[#D4AF37] tracking-wider text-center">ABARIS</h1><p className="text-[10px] tracking-widest uppercase text-[#C5A059]">Portal Cliente</p></div>
         <nav className="flex-1 p-4 space-y-2">
            <button onClick={() => setActiveTab('gestion_cliente')} className={`w-full flex items-center p-3 rounded-lg text-sm transition-colors ${activeTab === 'gestion_cliente' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:bg-slate-800/50'}`}><Receipt size={18} className="mr-3"/> Gestión Tributaria</button>
            <button onClick={() => setActiveTab('pagos_cliente')} className={`w-full flex items-center p-3 rounded-lg text-sm transition-colors ${activeTab === 'pagos_cliente' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:bg-slate-800/50'}`}><Wallet size={18} className="mr-3"/> Mis Pagos</button>
            <button onClick={() => setActiveTab('boveda')} className={`w-full flex items-center p-3 rounded-lg text-sm transition-colors ${activeTab === 'boveda' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:bg-slate-800/50'}`}><Shield size={18} className="mr-3"/> Mi Bóveda</button>
         </nav>
         <div className="p-4 border-t border-slate-800"><button onClick={onLogout} className="w-full flex text-red-400 p-2"><LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión</button></div>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-8 pb-24 md:pb-8">
        
        <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3"><AbarisLogo className="w-10 h-10" /><div><h1 className="text-sm font-bold text-[#0A1128] truncate max-w-[150px]">{user.name}</h1><p className="text-xs text-slate-500">Portal Cliente</p></div></div>
          <button onClick={onLogout} className="p-2 text-red-500 bg-red-50 rounded-lg"><LogOut className="w-5 h-5" /></button>
        </div>

        {activeTab === 'gestion_cliente' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-[#0A1128]">Mi Gestión Tributaria</h2>

            <div className="bg-[#0A1128] rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Receipt className="w-32 h-32" /></div>
              <h3 className="text-lg font-medium text-slate-300 mb-1">Resumen de IVA Estimado ({filterMonth})</h3>
              <p className="text-4xl font-bold text-[#D4AF37]">{formatCurrency(Math.abs(summary.ivaAPagar))}</p>
              <p className="text-xs text-slate-400 mt-1">{summary.ivaAPagar > 0 ? 'Monto estimado a pagar' : 'Saldo a favor'}</p>
              <div className="mt-4 flex gap-4 text-sm">
                <div className="bg-white/10 px-3 py-1.5 rounded text-green-300">Ventas: {formatCurrency(summary.ventas)}</div>
                <div className="bg-white/10 px-3 py-1.5 rounded text-red-300">Compras: {formatCurrency(summary.compras)}</div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
               <div>
                 <h4 className="text-blue-800 font-bold">Extractos para IVA (Servicios Digitales)</h4>
                 <p className="text-sm text-blue-600 mt-1">¿Consumos en Netflix, Spotify, Amazon? Sube tu extracto mensual para liquidarlo.</p>
               </div>
               <input type="file" ref={extractoInputRef} onChange={handleExtractoUpload} className="hidden" accept=".pdf,image/*" />
               <button onClick={() => extractoInputRef.current.click()} disabled={isProcessingFile} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md whitespace-nowrap">Subir Extracto</button>
            </div>
            {uploadMessage.source === 'extracto' && <div className="text-sm p-3 rounded-lg font-medium bg-green-100 text-green-800">{uploadMessage.text}</div>}

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><CheckCircle className="w-5 h-5 text-[#D4AF37] mr-2"/> Carga de Comprobante Físico</h3>
               
               {!showOcrPreview ? (
                 <>
                   <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" capture="environment" />
                   <button onClick={handleCaptureClick} disabled={isProcessingFile} className="w-full py-10 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors disabled:opacity-50">
                      {isProcessingFile ? (
                        <><RefreshCw className="w-10 h-10 mb-2 animate-spin text-[#D4AF37]" /><span className="font-medium">Leyendo documento con IA...</span></>
                      ) : (
                        <><Camera className="w-10 h-10 mb-2" /><span className="font-bold text-lg">Tomar foto o subir comprobante</span><span className="text-xs mt-1">Revisa el monto antes de guardar en tu Drive</span></>
                      )}
                   </button>
                   {uploadMessage.source === 'factura' && <div className="mt-4 text-sm p-3 rounded-lg font-medium bg-green-100 text-green-800 text-center">{uploadMessage.text}</div>}
                 </>
               ) : (
                 <div className="border border-[#C5A059] rounded-xl p-5 bg-[#F9E7B3]/10">
                    <h4 className="font-bold text-[#8A6D3B] mb-4 flex items-center"><Edit2 size={18} className="mr-2"/> Validación de Datos del Comprobante</h4>
                    <form onSubmit={submitOcrForm} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="text-xs font-bold text-slate-600">RUC Proveedor</label><input type="text" placeholder="Ej. 80012345-6" value={ocrData.ruc} onChange={e=>setOcrData({...ocrData, ruc: e.target.value})} className="w-full border p-2 rounded-lg bg-white" /></div>
                      <div><label className="text-xs font-bold text-slate-600">Razón Social Proveedor</label><input type="text" placeholder="Ej. Supermercado / Estación" value={ocrData.razonSocial} onChange={e=>setOcrData({...ocrData, razonSocial: e.target.value})} className="w-full border p-2 rounded-lg bg-white" /></div>
                      <div><label className="text-xs font-bold text-slate-600">Fecha de Factura *</label><input type="date" required value={ocrData.fecha} onChange={e=>setOcrData({...ocrData, fecha: e.target.value})} className="w-full border p-2 rounded-lg bg-white" /></div>
                      <div><label className="text-xs font-bold text-slate-600">Tipo de Comprobante</label><select value={ocrData.tipo} onChange={e=>setOcrData({...ocrData, tipo: e.target.value})} className="w-full border p-2 rounded-lg bg-white"><option value="Gasto">Compra / Gasto</option><option value="Ingreso">Venta / Ingreso</option></select></div>
                      <div><label className="text-xs font-bold text-slate-600">IVA 10% (Gs.)</label><input type="number" placeholder="Ej. 10000" value={ocrData.iva10} onChange={e=>setOcrData({...ocrData, iva10: e.target.value})} className="w-full border p-2 rounded-lg bg-white" /></div>
                      <div><label className="text-xs font-bold text-slate-800">MONTO TOTAL (Gs.) *</label><input type="number" required placeholder="Ej. 110000" value={ocrData.monto} onChange={e=>setOcrData({...ocrData, monto: e.target.value})} className="w-full border-2 border-[#0A1128] p-2 rounded-lg bg-white font-bold" /></div>
                      
                      <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                        <button type="button" onClick={() => setShowOcrPreview(false)} className="px-4 py-2 text-slate-500 font-medium">Cancelar</button>
                        <button type="submit" disabled={isSavingOcr} className="bg-[#0A1128] text-white px-6 py-2 rounded-lg font-bold shadow-md">{isSavingOcr ? 'Guardando en Drive...' : 'Confirmar y Guardar'}</button>
                      </div>
                    </form>
                 </div>
               )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <h3 className="text-lg font-bold text-slate-800 p-5 border-b"><FileText className="inline mr-2 text-[#6B4B9A]"/> Comprobantes Registrados ({filterMonth})</h3>
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b"><tr><th className="p-4">Fecha</th><th className="p-4">Proveedor</th><th className="p-4 text-right">Total</th></tr></thead>
                  <tbody className="divide-y">
                    {invoices.filter(i => String(i.fecha).startsWith(filterMonth)).map((inv, idx) => (
                      <tr key={idx}>
                        <td className="p-4">{inv.fecha}</td>
                        <td className="p-4 font-bold text-slate-700">{inv.razonSocial || 'Extracto'} <br/><span className="text-[10px] uppercase font-normal text-slate-500">{inv.tipo}</span></td>
                        <td className="p-4 text-right font-black text-slate-800">{formatCurrency(inv.monto)}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'pagos_cliente' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-[#0A1128]">Mis Pagos y Honorarios</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center text-slate-800"><Building2 className="mr-2 text-[#C5A059]"/> Datos Bancarios para Transferencia</h3>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-6">
                 <div><p className="text-[10px] font-bold text-slate-500 uppercase">Titular de la Cuenta</p><p className="font-black text-slate-800 text-lg">Veronica Cubilla</p></div>
                 <div><p className="text-[10px] font-bold text-slate-500 uppercase">Banco</p><p className="font-bold text-slate-800 text-lg">Banco GNB</p></div>
                 <div><p className="text-[10px] font-bold text-slate-500 uppercase">Cuenta N°</p><p className="font-black text-xl text-[#6B4B9A] font-mono">13351759001</p></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <h3 className="font-bold text-lg p-5 border-b"><Wallet className="inline mr-2 text-[#6B4B9A]"/> Facturación de Honorarios</h3>
               {cobranzas.length === 0 ? (
                 <div className="p-8 text-center text-slate-500 font-medium">Estás al día. No hay honorarios pendientes.</div>
               ) : (
                 <div className="divide-y">
                   {cobranzas.map((cob, idx) => (
                     <div key={idx} className="p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                          <span className="text-[10px] font-black uppercase text-[#C5A059]">{cob.periodo}</span>
                          <h4 className="text-2xl font-black text-slate-800">{formatCurrency(cob.monto)}</h4>
                        </div>
                        <div>
                          {cob.estado === 'Pendiente' ? <button onClick={() => handlePay(cob.id)} className="bg-[#0A1128] text-white px-6 py-2.5 rounded-xl font-bold flex items-center shadow-md"><UploadCloud size={18} className="mr-2" /> Reportar Pago</button> : 
                           cob.estado === 'En Revisión' ? <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-bold text-sm border border-amber-200">Verificando Pago...</span> : 
                           <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-bold text-sm border border-emerald-200">Pago Confirmado</span>}
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'boveda' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-[#0A1128]">Mi Bóveda de Documentos</h2>
            <p className="text-slate-600 text-sm">Documentos fijos de tu empresa. Actualizados tras la presentación mensual a la SET.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[ { title: 'Constancia de RUC', status: 'Actualizado este mes' }, { title: 'Certificado de Cumplimiento', status: 'Vigente' }, { title: 'Cédula Tributaria', status: 'Versión Final' }, { title: 'Cuenta Corriente DNIT', status: 'Último Cierre' }].map((doc) => (
                 <div key={doc.title} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <div className="bg-[#D4AF37]/20 p-3 rounded-lg text-[#8A6D3B]"><Shield className="w-6 h-6" /></div>
                       <div><span className="font-bold text-slate-800 text-sm block">{doc.title}</span><span className="text-xs text-emerald-600 font-bold uppercase">{doc.status}</span></div>
                    </div>
                    <button className="text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold">Ver</button>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A1128] border-t border-slate-700 flex justify-around items-center py-2 px-2 z-50 pb-safe">
        <button onClick={() => setActiveTab('gestion_cliente')} className={`flex flex-col items-center p-2 w-1/3 ${activeTab === 'gestion_cliente' ? 'text-[#D4AF37]' : 'text-slate-400'}`}><Receipt className="w-6 h-6" /><span className="text-[10px] mt-1 font-medium">Inicio</span></button>
        <button onClick={() => setActiveTab('pagos_cliente')} className={`flex flex-col items-center p-2 w-1/3 ${activeTab === 'pagos_cliente' ? 'text-[#D4AF37]' : 'text-slate-400'}`}><Wallet className="w-6 h-6" /><span className="text-[10px] mt-1 font-medium">Pagos</span></button>
        <button onClick={() => setActiveTab('boveda')} className={`flex flex-col items-center p-2 w-1/3 ${activeTab === 'boveda' ? 'text-[#D4AF37]' : 'text-slate-400'}`}><Shield className="w-6 h-6" /><span className="text-[10px] mt-1 font-medium">Bóveda</span></button>
      </div>
    </div>
  );
}
