import React, { useState, useMemo } from 'react';
import {
  Building2, Receipt, Users, LogOut, FileText,
  PlusCircle, TrendingUp, UploadCloud, Edit2, Camera,
  CalendarDays, CreditCard, Phone, Wallet, FileCheck, Download,
  CheckCircle, Clock, Shield, AlertCircle, Bell, ChevronRight, DollarSign,
  Smartphone, Laptop, Eye, Lock, Mail, Search, CheckCircle2, ArrowRight
} from 'lucide-react';

// Formateador de moneda en Guaraníes (Gs.)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(Number(amount) || 0);
};

// Componente del Isologotipo Geométrico Oficial de ABARIS
const AbarisLogo = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative flex items-center justify-center shrink-0`}>
    <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl">
      <defs>
        <linearGradient id="goldGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9E7B3" />
          <stop offset="50%" stopColor="#C5A059" />
          <stop offset="100%" stopColor="#8A6D3B" />
        </linearGradient>
        <linearGradient id="goldGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EED28D" />
          <stop offset="100%" stopColor="#A37E3E" />
        </linearGradient>
        <linearGradient id="purpleGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9C73D1" />
          <stop offset="100%" stopColor="#4D2E78" />
        </linearGradient>
        <linearGradient id="purpleGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6B4B9A" />
          <stop offset="100%" stopColor="#351B5A" />
        </linearGradient>
      </defs>

      {/* Brazo Izquierdo Dorado */}
      <polygon points="150,35 125,90 90,205 60,225 120,90" fill="url(#goldGradLeft)" />
      {/* Brazo Derecho Dorado */}
      <polygon points="150,35 175,90 210,205 240,225 180,90" fill="url(#goldGradRight)" />

      {/* Cumbre Facetada */}
      <polygon points="150,35 135,105 150,135 165,105" fill="#D4AF37" />
      <polygon points="150,35 135,105 150,135" fill="#FFF4C2" opacity="0.4" />

      {/* Chevrón Morado Intersecado */}
      <polygon points="150,225 75,140 100,118 150,170" fill="url(#purpleGradLeft)" />
      <polygon points="150,225 225,140 200,118 150,170" fill="url(#purpleGradRight)" />
      <polygon points="150,170 100,118 122,118 150,148" fill="#B38DE3" />
      <polygon points="150,170 200,118 178,118 150,148" fill="#583587" />

      {/* Patas Base Doradas */}
      <polygon points="90,205 60,225 105,225" fill="url(#goldGradLeft)" />
      <polygon points="210,205 240,225 195,225" fill="url(#goldGradRight)" />
    </svg>
  </div>
);

export default function App() {
  const [mockEmail, setMockEmail] = useState('jose.rojas14.jr89@gmail.com');
  const [loginInput, setLoginInput] = useState('jose.rojas14.jr89@gmail.com');
  const [passwordInput, setPasswordInput] = useState('613101Joseed*');
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'desktop'
  const [isLoggedOutState, setIsLoggedOutState] = useState(false);

  // Base de datos local interactiva
  const [invoices, setInvoices] = useState([
    { id: '1', userEmail: 'cliente1@empresa.com', fecha: '2026-11-05', ruc: '80012345-6', razonSocial: 'Servicios Generales S.A.', tipo: 'Gasto', monto: 1200000, iva5: 0, iva10: 109091, cdc: '0123456789' },
    { id: '2', userEmail: 'cliente1@empresa.com', fecha: '2026-11-08', ruc: '80099988-1', razonSocial: 'Supermercado Central S.A.', tipo: 'Gasto', monto: 450000, iva5: 0, iva10: 40909, cdc: '' }
  ]);

  const [usersData, setUsersData] = useState([
    { id: '1', email: 'cliente1@empresa.com', razonSocial: 'Empresa de Prueba S.A.', ruc: '80012345-6', telefono: '0981123456', honorarios: 350000 }
  ]);

  const [rucsDirectory, setRucsDirectory] = useState({ 
    '80012345-6': 'Empresa de Prueba S.A.',
    '80099988-1': 'Supermercado Central S.A.'
  });

  const [cobranzas, setCobranzas] = useState([
    { id: '1', userEmail: 'cliente1@empresa.com', periodo: 'Noviembre 2026', monto: 350000, estado: 'Pendiente' }
  ]);

  const [liquidaciones, setLiquidaciones] = useState([
    { id: '1', userEmail: 'cliente1@empresa.com', periodo: 'Octubre 2026', archivo: 'IVA_120_OCT2026.pdf' }
  ]);

  const [abarisGastos, setAbarisGastos] = useState([
    { id: '1', fecha: '2026-11-02', concepto: 'Servidor y Hosting PWA', categoria: 'Software/Servidores', monto: 150000 }
  ]);

  const [mesesEstados, setMesesEstados] = useState({
    'cliente1@empresa.com-2026-11': 'Pendiente'
  });

  const mockDb = {
    addInvoice: (data) => setInvoices(prev => [...prev, { id: Date.now().toString(), ...data }]),
    addCobranza: (data) => setCobranzas(prev => [...prev, { id: Date.now().toString(), ...data }]),
    updateCobranza: (id, data) => setCobranzas(prev => prev.map(c => c.id === id ? { ...c, ...data } : c)),
    addLiquidacion: (data) => setLiquidaciones(prev => [...prev, { id: Date.now().toString(), ...data }]),
    updateUser: (id, data) => setUsersData(prev => prev.map(u => u.id === id ? { ...u, ...data } : u)),
    addUser: (data) => setUsersData(prev => [...prev, { id: Date.now().toString(), ...data }]),
    addRuc: (ruc, data) => setRucsDirectory(prev => ({ ...prev, [ruc]: data.razonSocial })),
    addAbarisGasto: (data) => setAbarisGastos(prev => [...prev, { id: Date.now().toString(), ...data }]),
    setMesEstado: (email, mes, estado) => setMesesEstados(prev => ({ ...prev, [`${email}-${mes}`]: estado }))
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginInput) return;
    setMockEmail(loginInput);
    setIsLoggedOutState(false);
  };

  const switchToAdmin = () => {
    setLoginInput('jose.rojas14.jr89@gmail.com');
    setPasswordInput('613101Joseed*');
    setMockEmail('jose.rojas14.jr89@gmail.com');
    setIsLoggedOutState(false);
  };

  const switchToClient = () => {
    setLoginInput('cliente1@empresa.com');
    setPasswordInput('cliente123');
    setMockEmail('cliente1@empresa.com');
    setIsLoggedOutState(false);
  };

  const switchToLogin = () => {
    setIsLoggedOutState(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-between selection:bg-[#C5A059] selection:text-[#0B132B]">
      
      {/* TOOLBAR SUPERIOR INTERACTIVA PARA PRUEBAS RÁPIDAS */}
      <div className="bg-[#111C44] border-b border-[#C5A059]/40 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-slate-100 tracking-wide text-[11px] sm:text-xs">PANEL DE CONTROL DE PRUEBAS</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={switchToAdmin}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              !isLoggedOutState && mockEmail === 'jose.rojas14.jr89@gmail.com' 
                ? 'bg-[#C5A059] text-[#0B132B] shadow' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Vista Administrador
          </button>

          <button
            onClick={switchToClient}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              !isLoggedOutState && mockEmail === 'cliente1@empresa.com' 
                ? 'bg-[#6B4B9A] text-white shadow' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Vista Cliente
          </button>

          <button
            onClick={switchToLogin}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              isLoggedOutState 
                ? 'bg-amber-500 text-slate-950 shadow' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Pantalla Login
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'mobile' ? 'desktop' : 'mobile')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded flex items-center gap-1 text-[11px]"
          >
            {viewMode === 'mobile' ? <Smartphone className="w-3 h-3 text-[#C5A059]" /> : <Laptop className="w-3 h-3 text-[#C5A059]" />}
            <span className="hidden sm:inline">{viewMode === 'mobile' ? 'Celular (PWA)' : 'Escritorio'}</span>
          </button>
        </div>
      </div>

      {/* MARCO SIMULADOR CELULAR / ESCRITORIO */}
      <div className={`flex-1 flex justify-center items-center ${viewMode === 'mobile' ? 'py-4 md:py-6 bg-slate-900' : ''}`}>
        
        <div className={`w-full flex flex-col bg-slate-50 text-slate-800 transition-all duration-300 ${
          viewMode === 'mobile' 
            ? 'max-w-[420px] min-h-[760px] h-[88vh] rounded-[38px] border-[10px] border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative' 
            : 'min-h-[88vh]'
        }`}>

          {isLoggedOutState ? (
            /* PANTALLA DE INICIO DE SESIÓN CORREGIDA Y LIMPIA */
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0B132B] text-slate-100 relative overflow-y-auto">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#6B4B9A]/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="w-full flex flex-col items-center z-10 my-auto">
                <AbarisLogo className="w-32 h-32" />

                <h1 className="text-lg md:text-xl font-serif font-bold tracking-[0.25em] text-[#C5A059] text-center mt-2 mb-8 uppercase drop-shadow">
                  ABARIS CONSULTORES
                </h1>

                <form onSubmit={handleLogin} className="w-full space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#C5A059]" /> Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      placeholder="ingreso@ejemplo.com"
                      className="w-full px-4 py-3 bg-[#111C44] border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-[#C5A059]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#C5A059]" /> Contraseña
                    </label>
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 bg-[#111C44] border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-[#C5A059]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#C5A059] hover:brightness-110 text-[#0B132B] font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Ingresar al Portal</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>

                <p className="text-[10px] text-slate-500 mt-8 text-center font-medium">
                  Portal Seguro PWA &copy; {new Date().getFullYear()} Abaris Consultores S.A.
                </p>
              </div>
            </div>
          ) : mockEmail === 'jose.rojas14.jr89@gmail.com' ? (
            /* VISTA COMPLETA ADMINISTRADOR (TU PANEL MAESTRO) */
            <AdminDashboard
              invoices={invoices}
              usersData={usersData}
              cobranzas={cobranzas}
              liquidaciones={liquidaciones}
              abarisGastos={abarisGastos}
              mesesEstados={mesesEstados}
              onLogout={() => setIsLoggedOutState(true)}
              mockDb={mockDb}
              isMobileFrame={viewMode === 'mobile'}
            />
          ) : (
            /* VISTA COMPLETA CLIENTE (PORTAL MÓVIL) */
            <ClientDashboard
              mockEmail={mockEmail}
              invoices={invoices.filter(i => i.userEmail === mockEmail)}
              cobranzas={cobranzas.filter(c => c.userEmail === mockEmail)}
              liquidaciones={liquidaciones.filter(l => l.userEmail === mockEmail)}
              rucsDirectory={rucsDirectory}
              userData={usersData.find(u => u.email === mockEmail)}
              mesesEstados={mesesEstados}
              onLogout={() => setIsLoggedOutState(true)}
              mockDb={mockDb}
            />
          )}

        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// COMPONENTE: PANEL DE ADMINISTRADOR COMPLETO
// ----------------------------------------------------------------------
function AdminDashboard({ invoices, usersData, cobranzas, liquidaciones, abarisGastos, mesesEstados, onLogout, mockDb, isMobileFrame }) {
  const [activeTab, setActiveTab] = useState('facturas');
  const clients = usersData.filter(u => u.email !== 'jose.rojas14.jr89@gmail.com');

  return (
    <div className="flex-1 bg-slate-50 flex flex-col md:flex-row overflow-y-auto relative text-slate-800">
      
      {/* Sidebar Corporativo Admin */}
      <div className="w-full md:w-64 text-white flex flex-col shadow-xl z-20 bg-[#0B132B] shrink-0">
        <div className="p-4 text-center border-b border-slate-800 flex flex-col items-center">
          <AbarisLogo className="w-12 h-12 mb-1" />
          <h2 className="font-serif font-bold text-sm tracking-widest text-[#C5A059]">ABARIS</h2>
          <span className="text-[10px] text-slate-400 tracking-widest uppercase font-semibold">Back-Office Admin</span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1">
          <button 
            onClick={() => setActiveTab('facturas')} 
            className={`w-full flex items-center p-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'facturas' ? 'bg-[#111C44] text-[#C5A059] border-l-4 border-[#C5A059]' : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <Receipt size={16} className="mr-2 text-[#C5A059]" /> Facturas y SET
          </button>

          <button 
            onClick={() => setActiveTab('vencimientos')} 
            className={`w-full flex items-center p-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'vencimientos' ? 'bg-[#111C44] text-[#C5A059] border-l-4 border-[#C5A059]' : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <CalendarDays size={16} className="mr-2 text-[#C5A059]" /> Vencimientos
          </button>

          <button 
            onClick={() => setActiveTab('clientes')} 
            className={`w-full flex items-center p-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'clientes' ? 'bg-[#111C44] text-[#C5A059] border-l-4 border-[#C5A059]' : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <Users size={16} className="mr-2 text-[#C5A059]" /> Directorio
          </button>

          <button 
            onClick={() => setActiveTab('cobranzas')} 
            className={`w-full flex items-center p-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'cobranzas' ? 'bg-[#111C44] text-[#C5A059] border-l-4 border-[#C5A059]' : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <Wallet size={16} className="mr-2 text-[#C5A059]" /> Cobranzas
          </button>

          <button 
            onClick={() => setActiveTab('liquidaciones')} 
            className={`w-full flex items-center p-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'liquidaciones' ? 'bg-[#111C44] text-[#C5A059] border-l-4 border-[#C5A059]' : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <FileCheck size={16} className="mr-2 text-[#C5A059]" /> Liquidaciones
          </button>

          <button 
            onClick={() => setActiveTab('finanzas')} 
            className={`w-full flex items-center p-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'finanzas' ? 'bg-[#111C44] text-[#C5A059] border-l-4 border-[#C5A059]' : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp size={16} className="mr-2 text-[#C5A059]" /> Mi Estudio
          </button>
        </nav>

        <div className="p-3 border-t border-slate-800 hidden md:block">
          <button onClick={onLogout} className="w-full flex items-center justify-center p-2 bg-red-900/30 text-red-300 rounded-lg text-xs font-semibold hover:bg-red-900/50 transition-colors">
            <LogOut size={16} className="mr-2" /> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido Principal de Admin */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
        {activeTab === 'facturas' && <AdminFacturas invoices={invoices} clients={clients} mockDb={mockDb} mesesEstados={mesesEstados} />}
        {activeTab === 'clientes' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <h3 className="text-base font-bold flex items-center text-[#0B132B]">
              <Users className="mr-2 text-[#6B4B9A]" size={20} /> Directorio de Clientes
            </h3>
            <div className="grid gap-3">
              {clients.map(client => <ClientEditCard key={client.id} client={client} mockDb={mockDb} />)}
            </div>
          </div>
        )}
        {activeTab === 'cobranzas' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-5">
            <h3 className="text-base font-bold flex items-center text-[#0B132B]">
              <Wallet className="mr-2 text-[#6B4B9A]" size={20} /> Control de Cobranzas
            </h3>
            <AdminCobranzaForm clients={clients} mockDb={mockDb} />
            <AdminCobranzaList cobranzas={cobranzas} mockDb={mockDb} />
          </div>
        )}
        {activeTab === 'liquidaciones' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-5">
            <h3 className="text-base font-bold flex items-center text-[#0B132B]">
              <FileCheck className="mr-2 text-[#6B4B9A]" size={20} /> Liquidaciones y Declaraciones
            </h3>
            <AdminLiquidacionForm clients={clients} mockDb={mockDb} />
            <AdminLiquidacionList liquidaciones={liquidaciones} />
          </div>
        )}
        {activeTab === 'finanzas' && <AdminFinanzas cobranzas={cobranzas} abarisGastos={abarisGastos} mockDb={mockDb} />}
        {activeTab === 'vencimientos' && <AdminVencimientos clients={clients} />}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// SUB-TAB: FACTURAS Y SET (IMPORTADOR DE MARANGATU Y EXPORTADOR SET)
// ----------------------------------------------------------------------
function AdminFacturas({ invoices, clients, mockDb, mesesEstados }) {
  const [importClient, setImportClient] = useState('');
  const [importPeriod, setImportPeriod] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [exportClient, setExportClient] = useState('');
  const [exportPeriod, setExportPeriod] = useState('');

  const handleImportMarangatu = (e) => {
    e.preventDefault();
    if (!importClient || !importPeriod) return alert('Selecciona cliente y periodo.');
    setIsImporting(true);
    setTimeout(() => {
      mockDb.addInvoice({
        userEmail: importClient,
        fecha: `${importPeriod}-15`,
        ruc: '80000000-5',
        razonSocial: 'Proveedor Electrónico S.A. (Excel SET)',
        tipo: 'Gasto',
        monto: 850000,
        iva5: 0,
        iva10: 77272,
        cdc: '01234567890123456789012345678901234567890123'
      });
      mockDb.setMesEstado(importClient, importPeriod, 'Pendiente');
      setIsImporting(false);
      alert('¡Excel procesado! Las facturas electrónicas se sumaron al balance y el cliente debe aprobarlo.');
    }, 1200);
  };

  const handleExportMarangatu = (e) => {
    e.preventDefault();
    if (!exportClient || !exportPeriod) return alert('Selecciona cliente y periodo.');
    const estado = mesesEstados[`${exportClient}-${exportPeriod}`];
    if (estado !== 'Aprobado') {
      alert('⚠️ No puedes exportar: El cliente aún no ha dado su Aprobación (OK) para este periodo.');
      return;
    }
    alert(`Generando archivo RUC_REG_${exportPeriod.replace('-', '')}_V0001.csv según formato técnico de la SET. Listo para subir a Marangatu.`);
  };

  return (
    <div className="space-y-5">
      {/* 1. Importador Marangatu */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#6B4B9A]"></div>
        <h3 className="text-sm font-bold mb-1 flex items-center text-slate-800 pl-2">
          <Download className="mr-2 text-[#6B4B9A]" size={18} /> 1. Importar Facturas Electrónicas (Excel Marangatu)
        </h3>
        <p className="text-xs text-slate-500 mb-4 pl-2">Sube el Excel descargado de Marangatu para actualizar el balance del cliente.</p>
        <form onSubmit={handleImportMarangatu} className="pl-2 flex flex-col md:flex-row gap-3 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cliente</label>
            <select required className="w-full border border-slate-300 p-2.5 rounded-xl bg-slate-50 text-xs" value={importClient} onChange={e => setImportClient(e.target.value)}>
              <option value="">Seleccionar...</option>
              {clients.map(c => <option key={c.id} value={c.email}>{c.razonSocial || c.email}</option>)}
            </select>
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Periodo (Ej. 2026-11)</label>
            <input required type="month" className="w-full border border-slate-300 p-2 rounded-xl bg-slate-50 text-xs" value={importPeriod} onChange={e => setImportPeriod(e.target.value)} />
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Archivo Excel SET</label>
            <input required type="file" accept=".xlsx, .xls, .csv" className="w-full text-xs border border-slate-300 p-1.5 rounded-xl bg-slate-50" />
          </div>
          <button type="submit" disabled={isImporting} className="w-full md:w-auto text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center shadow bg-[#6B4B9A] hover:bg-purple-900 transition-all">
            {isImporting ? 'Procesando...' : 'Importar Excel'}
          </button>
        </form>
      </div>

      {/* 2. Exportador SET */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#C5A059]"></div>
        <h3 className="text-sm font-bold mb-1 flex items-center text-slate-800 pl-2">
          <UploadCloud className="mr-2 text-[#C5A059]" size={18} /> 2. Exportar para Presentación (Formato Oficial SET)
        </h3>
        <p className="text-xs text-slate-500 mb-4 pl-2">Genera el archivo .TXT / CSV para la SET (Solo meses aprobados por el cliente).</p>
        <form onSubmit={handleExportMarangatu} className="pl-2 flex flex-col md:flex-row gap-3 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cliente</label>
            <select required className="w-full border border-slate-300 p-2.5 rounded-xl bg-slate-50 text-xs" value={exportClient} onChange={e => setExportClient(e.target.value)}>
              <option value="">Seleccionar...</option>
              {clients.map(c => <option key={c.id} value={c.email}>{c.razonSocial || c.email}</option>)}
            </select>
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Periodo a Exportar</label>
            <input required type="month" className="w-full border border-slate-300 p-2 rounded-xl bg-slate-50 text-xs" value={exportPeriod} onChange={e => setExportPeriod(e.target.value)} />
          </div>
          <button type="submit" className="w-full md:w-auto text-white px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0B132B] hover:bg-slate-900 transition-all shadow">
            Descargar .TXT / .CSV
          </button>
        </form>
      </div>

      {/* Registro de Facturas */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
        <h3 className="text-sm font-bold flex items-center text-slate-800"><Receipt className="mr-2 text-[#6B4B9A]" size={18} /> Registro Global de Facturas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b">
              <tr>
                <th className="p-2.5">Fecha</th>
                <th className="p-2.5">Cliente</th>
                <th className="p-2.5">Proveedor / RUC</th>
                <th className="p-2.5">Origen</th>
                <th className="p-2.5 text-right">Monto Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="p-2.5 text-slate-600">{inv.fecha}</td>
                  <td className="p-2.5 font-medium text-slate-700">{inv.userEmail}</td>
                  <td className="p-2.5">
                    <p className="font-bold text-slate-800">{inv.razonSocial}</p>
                    <p className="text-[10px] text-slate-400">{inv.ruc}</p>
                  </td>
                  <td className="p-2.5">
                    {inv.cdc ? (
                      <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold">Excel SET</span>
                    ) : (
                      <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">Física (Foto)</span>
                    )}
                  </td>
                  <td className="p-2.5 text-right font-bold text-slate-800">{formatCurrency(inv.monto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// SUB-COMPONENTES DEL PANEL DE ADMIN
// ----------------------------------------------------------------------
function ClientEditCard({ client, mockDb }) {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(client);

  const handleSave = () => {
    mockDb.updateUser(client.id, data);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 gap-2">
        <div>
          <h4 className="font-bold text-slate-800 text-sm">{client.razonSocial || 'Sin Nombre'}</h4>
          <p className="text-xs text-slate-500">{client.email}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-600">
            <span>RUC: <strong>{client.ruc || 'N/A'}</strong></span>
            <span>Tel: <strong>{client.telefono || 'N/A'}</strong></span>
            <span className="font-bold text-[#C5A059]">Honorarios: {formatCurrency(client.honorarios)}</span>
          </div>
        </div>
        <button onClick={() => setIsEditing(true)} className="text-xs border px-3 py-1.5 rounded-lg bg-white shadow-sm hover:bg-slate-100 font-semibold text-slate-700">
          Editar Datos
        </button>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-xl bg-white border-[#C5A059] space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <input type="text" placeholder="Razón Social" className="border p-2 rounded-lg bg-slate-50" value={data.razonSocial} onChange={e => setData({...data, razonSocial: e.target.value})} />
        <input type="text" placeholder="RUC" className="border p-2 rounded-lg bg-slate-50" value={data.ruc} onChange={e => setData({...data, ruc: e.target.value})} />
        <input type="text" placeholder="Teléfono" className="border p-2 rounded-lg bg-slate-50" value={data.telefono} onChange={e => setData({...data, telefono: e.target.value})} />
        <input type="number" placeholder="Honorarios Gs." className="border p-2 rounded-lg bg-slate-50" value={data.honorarios} onChange={e => setData({...data, honorarios: e.target.value})} />
      </div>
      <div className="flex justify-end gap-2 text-xs">
        <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-slate-500">Cancelar</button>
        <button onClick={handleSave} className="px-4 py-1.5 bg-[#0B132B] text-white rounded-lg font-bold">Guardar</button>
      </div>
    </div>
  );
}

function AdminCobranzaForm({ clients, mockDb }) {
  const [form, setForm] = useState({ userEmail: '', periodo: '', monto: '' });
  const handleSubmit = (e) => {
    e.preventDefault();
    mockDb.addCobranza({ ...form, monto: Number(form.monto), estado: 'Pendiente' });
    setForm({ userEmail: '', periodo: '', monto: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-3">
      <h4 className="font-semibold text-xs text-slate-700">Generar Cobro de Honorarios</h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <select required className="border p-2 rounded-lg bg-white" value={form.userEmail} onChange={e => setForm({...form, userEmail: e.target.value})}>
          <option value="">Seleccionar Cliente...</option>
          {clients.map(c => <option key={c.id} value={c.email}>{c.razonSocial || c.email}</option>)}
        </select>
        <input required type="text" placeholder="Periodo (Ej. Noviembre 2026)" className="border p-2 rounded-lg bg-white" value={form.periodo} onChange={e => setForm({...form, periodo: e.target.value})} />
        <input required type="number" placeholder="Monto Gs." className="border p-2 rounded-lg bg-white" value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} />
        <button type="submit" className="bg-[#C5A059] text-[#0B132B] font-bold p-2 rounded-lg shadow hover:brightness-105 flex items-center justify-center gap-1">
          <PlusCircle size={14} /> Generar Deuda
        </button>
      </div>
    </form>
  );
}

function AdminCobranzaList({ cobranzas, mockDb }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="p-2.5">Periodo</th>
            <th className="p-2.5">Cliente</th>
            <th className="p-2.5 text-right">Monto</th>
            <th className="p-2.5 text-center">Estado</th>
            <th className="p-2.5 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {cobranzas.map(cob => (
            <tr key={cob.id}>
              <td className="p-2.5 font-bold text-slate-700">{cob.periodo}</td>
              <td className="p-2.5 text-slate-600">{cob.userEmail}</td>
              <td className="p-2.5 text-right font-bold text-slate-800">{formatCurrency(cob.monto)}</td>
              <td className="p-2.5 text-center">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  cob.estado === 'Pagado' ? 'bg-green-100 text-green-800' : cob.estado === 'En Revisión' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {cob.estado}
                </span>
              </td>
              <td className="p-2.5 text-center">
                {cob.estado !== 'Pagado' && (
                  <button onClick={() => mockDb.updateCobranza(cob.id, { estado: 'Pagado' })} className="text-green-700 border border-green-600 px-2 py-1 rounded text-[10px] font-bold hover:bg-green-50">
                    Confirmar Pago
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminLiquidacionForm({ clients, mockDb }) {
  const [form, setForm] = useState({ userEmail: '', periodo: '' });
  const handleSubmit = (e) => {
    e.preventDefault();
    mockDb.addLiquidacion({ ...form, archivo: 'Formulario_SET.pdf' });
    setForm({ userEmail: '', periodo: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-3">
      <h4 className="font-semibold text-xs text-slate-700">Subir Formulario de Liquidación (PDF)</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <select required className="border p-2 rounded-lg bg-white" value={form.userEmail} onChange={e => setForm({...form, userEmail: e.target.value})}>
          <option value="">Seleccionar Cliente...</option>
          {clients.map(c => <option key={c.id} value={c.email}>{c.razonSocial || c.email}</option>)}
        </select>
        <input required type="text" placeholder="Periodo (Ej. Octubre 2026)" className="border p-2 rounded-lg bg-white" value={form.periodo} onChange={e => setForm({...form, periodo: e.target.value})} />
        <button type="submit" className="bg-[#6B4B9A] text-white font-bold p-2 rounded-lg shadow flex items-center justify-center gap-1">
          <UploadCloud size={14} /> Subir Documento
        </button>
      </div>
    </form>
  );
}

function AdminLiquidacionList({ liquidaciones }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
      {liquidaciones.map(liq => (
        <div key={liq.id} className="border p-3 rounded-xl flex justify-between items-center bg-slate-50 shadow-sm">
          <div>
            <p className="font-bold text-slate-800">{liq.periodo}</p>
            <p className="text-[10px] text-slate-500">{liq.userEmail}</p>
          </div>
          <FileText size={20} className="text-[#6B4B9A]" />
        </div>
      ))}
    </div>
  );
}

function AdminVencimientos({ clients }) {
  const calcularVencimiento = (ruc) => {
    if (!ruc) return { dia: null };
    const match = ruc.match(/(\d)(?:-\d)?$/);
    if (!match) return { dia: null };
    const dia = (parseInt(match[1]) * 2) + 7;
    return { dia };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
      <h3 className="text-base font-bold flex items-center text-[#0B132B]">
        <CalendarDays className="mr-2 text-[#C5A059]" size={20} /> Calendario de Vencimientos SET
      </h3>
      <p className="text-xs text-slate-500">Vencimientos ordenados según el dígito verificador del RUC.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-2.5">Día Vencimiento</th>
              <th className="p-2.5">Cliente</th>
              <th className="p-2.5">RUC</th>
              <th className="p-2.5 text-right">Estado / Prioridad</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {clients.map(c => {
              const v = calcularVencimiento(c.ruc);
              return (
                <tr key={c.id}>
                  <td className="p-2.5 font-black text-sm text-[#0B132B]">{v.dia ? `Día ${v.dia}` : 'N/A'}</td>
                  <td className="p-2.5 font-bold text-slate-800">{c.razonSocial || c.email}</td>
                  <td className="p-2.5 text-slate-500">{c.ruc || 'Falta cargar'}</td>
                  <td className="p-2.5 text-right">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">Con Tiempo</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminFinanzas({ cobranzas, abarisGastos, mockDb }) {
  const [form, setForm] = useState({ concepto: '', monto: '', fecha: '' });
  const ingresos = cobranzas.filter(c => c.estado === 'Pagado').reduce((acc, curr) => acc + Number(curr.monto), 0);
  const egresos = abarisGastos.reduce((acc, curr) => acc + Number(curr.monto), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    mockDb.addAbarisGasto({ ...form, monto: Number(form.monto) });
    setForm({ concepto: '', monto: '', fecha: '' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-5">
      <h3 className="text-base font-bold flex items-center text-[#0B132B]">
        <TrendingUp className="mr-2 text-[#6B4B9A]" size={20} /> Finanzas Internas del Estudio
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Ingresos Cobrados</p>
          <p className="text-lg font-black text-slate-800 mt-0.5">{formatCurrency(ingresos)}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Egresos Operativos</p>
          <p className="text-lg font-black text-slate-800 mt-0.5">{formatCurrency(egresos)}</p>
        </div>
        <div className="p-4 bg-[#0B132B] text-white rounded-xl">
          <p className="text-[10px] font-bold text-[#C5A059] uppercase">Rentabilidad Neta</p>
          <p className="text-lg font-black mt-0.5">{formatCurrency(ingresos - egresos)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border p-4 rounded-xl bg-slate-50 flex flex-col md:flex-row gap-2 text-xs">
        <input required type="date" className="border p-2 rounded-lg bg-white" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
        <input required type="text" placeholder="Concepto (Ej. Hosting PWA)" className="border p-2 rounded-lg bg-white flex-1" value={form.concepto} onChange={e => setForm({...form, concepto: e.target.value})} />
        <input required type="number" placeholder="Monto Gs." className="border p-2 rounded-lg bg-white w-32" value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} />
        <button type="submit" className="bg-[#6B4B9A] text-white px-4 py-2 rounded-lg font-bold">Registrar Egreso</button>
      </form>
    </div>
  );
}

// ----------------------------------------------------------------------
// COMPONENTE: PORTAL DEL CLIENTE MÓVIL (PWA)
// ----------------------------------------------------------------------
function ClientDashboard({ mockEmail, invoices, cobranzas, liquidaciones, rucsDirectory, userData, mesesEstados, onLogout, mockDb }) {
  const [activeTab, setActiveTab] = useState('tributaria');

  return (
    <div className="flex-1 bg-slate-100 text-slate-800 flex flex-col justify-between overflow-y-auto relative pb-16 md:pb-0">
      
      {/* Header Corporativo del Cliente */}
      <header className="bg-[#0B132B] text-white px-4 py-3 flex justify-between items-center shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <AbarisLogo className="w-8 h-8" />
          <div>
            <h1 className="font-serif font-bold text-xs tracking-widest text-[#C5A059]">ABARIS CONSULTORES</h1>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">{userData?.razonSocial || mockEmail}</p>
          </div>
        </div>
        <button onClick={onLogout} className="text-xs text-red-400 font-medium hover:underline">Salir</button>
      </header>

      {/* Contenido Dinámico del Cliente */}
      <main className="flex-1 p-4 max-w-5xl mx-auto space-y-4 w-full">
        {activeTab === 'tributaria' && <ClientTributaria invoices={invoices} mockEmail={mockEmail} mesesEstados={mesesEstados} mockDb={mockDb} />}
        {activeTab === 'pagos' && <ClientPagos cobranzas={cobranzas} mockDb={mockDb} />}
        {activeTab === 'declaraciones' && <ClientDeclaraciones liquidaciones={liquidaciones} />}
        {activeTab === 'boveda' && <ClientBoveda />}
      </main>

      {/* Barra Fija Inferior PWA Móvil */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0B132B] border-t border-slate-800 flex justify-around py-2.5 z-40">
        <button
          onClick={() => setActiveTab('tributaria')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${activeTab === 'tributaria' ? 'text-[#C5A059]' : 'text-slate-400'}`}
        >
          <Receipt size={18} />
          <span>Gestión</span>
        </button>
        <button
          onClick={() => setActiveTab('pagos')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${activeTab === 'pagos' ? 'text-[#C5A059]' : 'text-slate-400'}`}
        >
          <CreditCard size={18} />
          <span>Mis Pagos</span>
        </button>
        <button
          onClick={() => setActiveTab('declaraciones')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${activeTab === 'declaraciones' ? 'text-[#C5A059]' : 'text-slate-400'}`}
        >
          <FileCheck size={18} />
          <span>SET</span>
        </button>
        <button
          onClick={() => setActiveTab('boveda')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${activeTab === 'boveda' ? 'text-[#C5A059]' : 'text-slate-400'}`}
        >
          <Shield size={18} />
          <span>Bóveda</span>
        </button>
      </div>

    </div>
  );
}

// ----------------------------------------------------------------------
// SUB-TAB CLIENTE: GESTIÓN TRIBUTARIA
// ----------------------------------------------------------------------
function ClientTributaria({ invoices, mockEmail, mesesEstados, mockDb }) {
  const [filterMonth, setFilterMonth] = useState('2026-11');
  const [isSimulatingOCR, setIsSimulatingOCR] = useState(false);
  const [formData, setFormData] = useState({ ruc: '', razonSocial: '', fecha: '', tipo: 'Gasto', monto: '' });

  const estadoMes = mesesEstados[`${mockEmail}-${filterMonth}`];

  const handleSaveInvoice = (e) => {
    e.preventDefault();
    mockDb.addInvoice({
      ...formData,
      userEmail: mockEmail,
      monto: Number(formData.monto),
      iva10: Math.round(Number(formData.monto) / 11)
    });
    setFormData({ ruc: '', razonSocial: '', fecha: '', tipo: 'Gasto', monto: '' });
  };

  const handleAprobarMes = () => {
    mockDb.setMesEstado(mockEmail, filterMonth, 'Aprobado');
    alert('¡Gracias! El mes ha sido aprobado para su liquidación por Abaris Consultores.');
  };

  return (
    <div className="space-y-4">
      {/* Banner Notificación de Importación SET */}
      {estadoMes === 'Pendiente' && (
        <div className="p-4 rounded-2xl bg-[#C5A059] text-[#0B132B] shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Bell size={24} className="animate-bounce shrink-0" />
            <div>
              <h4 className="font-bold text-xs">¡Facturas electrónicas procesadas!</h4>
              <p className="text-[11px]">Abaris Consultores ha importado tus datos de la SET para {filterMonth}.</p>
            </div>
          </div>
          <button onClick={handleAprobarMes} className="w-full sm:w-auto bg-[#0B132B] text-white px-4 py-2 rounded-xl text-xs font-bold shadow shrink-0">
            Aprobar Mes
          </button>
        </div>
      )}

      {estadoMes === 'Aprobado' && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle size={18} className="text-emerald-700" />
          <span className="font-bold">Mes Aprobado. Abaris Consultores está procesando tu liquidación.</span>
        </div>
      )}

      {/* Tarjetas Balance */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase font-semibold">Total Ingresos</p>
          <p className="text-base font-bold text-slate-800 mt-0.5">Gs. 0</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase font-semibold">Total Gastos</p>
          <p className="text-base font-bold text-slate-800 mt-0.5">{formatCurrency(1650000)}</p>
        </div>
        <div className="bg-[#111C44] p-3.5 rounded-2xl border border-slate-800 text-white">
          <p className="text-[10px] text-[#C5A059] uppercase font-semibold">IVA Crédito</p>
          <p className="text-base font-bold text-[#C5A059] mt-0.5">{formatCurrency(150000)}</p>
        </div>
        <div className="bg-[#6B4B9A] p-3.5 rounded-2xl border border-purple-400/20 text-white">
          <p className="text-[10px] text-purple-200 uppercase font-semibold">Saldo a Favor</p>
          <p className="text-base font-bold mt-0.5">{formatCurrency(150000)}</p>
        </div>
      </div>

      {/* Escanear / Cargar Factura */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
          <Camera size={16} className="text-[#6B4B9A]" /> Subir Factura Física
        </h3>

        <div
          onClick={() => {
            setIsSimulatingOCR(true);
            setTimeout(() => {
              setFormData({ ruc: '8000000-1', razonSocial: 'Supermercado de Prueba SA', fecha: '2026-11-09', tipo: 'Gasto', monto: 150000 });
              setIsSimulatingOCR(false);
            }, 1200);
          }}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isSimulatingOCR ? 'border-[#C5A059] bg-amber-50' : 'border-slate-300 hover:border-[#6B4B9A] bg-slate-50'
          }`}
        >
          {isSimulatingOCR ? (
            <p className="text-xs font-bold text-[#C5A059] animate-pulse">Extrayendo datos de la foto...</p>
          ) : (
            <div className="flex flex-col items-center">
              <UploadCloud size={24} className="text-[#C5A059] mb-1" />
              <p className="text-xs font-bold text-slate-700">Toca para escanear</p>
              <p className="text-[9px] text-slate-400">FOTO O PDF</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveInvoice} className="space-y-2 pt-1 text-xs">
          <input
            type="text"
            placeholder="RUC PROVEEDOR"
            value={formData.ruc}
            onChange={e => setFormData({ ...formData, ruc: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="RAZÓN SOCIAL"
            value={formData.razonSocial}
            onChange={e => setFormData({ ...formData, razonSocial: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
          />
          <input
            type="number"
            placeholder="MONTO TOTAL Gs."
            value={formData.monto}
            onChange={e => setFormData({ ...formData, monto: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border rounded-lg font-bold"
            required
          />
          <button type="submit" className="w-full py-2 bg-[#0B132B] text-white font-bold rounded-lg shadow">
            Guardar Factura
          </button>
        </form>
      </div>

    </div>
  );
}

// ----------------------------------------------------------------------
// SUB-TAB CLIENTE: MIS PAGOS (DATOS BANCO GNB)
// ----------------------------------------------------------------------
function ClientPagos({ cobranzas, mockDb }) {
  const handlePay = (cobId) => {
    mockDb.updateCobranza(cobId, { estado: 'En Revisión' });
    alert("¡Comprobante enviado! Abaris validará el pago en breve.");
  };

  return (
    <div className="space-y-4">
      {/* Datos Bancarios Corporativos */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
          <Building2 size={16} className="text-[#C5A059]" /> Datos Bancarios para Transferencia
        </h3>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-2">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Titular de la Cuenta</p>
            <p className="font-bold text-slate-800">Veronica Cubilla</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Banco</p>
            <p className="font-bold text-slate-800">Banco GNB</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Cuenta N°</p>
            <p className="font-mono font-bold text-base text-[#6B4B9A]">13351759001</p>
          </div>
        </div>
      </div>

      {/* Honorarios Pendientes */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
          <CreditCard size={16} className="text-[#6B4B9A]" /> Honorarios Abaris Consultores
        </h3>
        <div className="space-y-2">
          {cobranzas.map(cob => (
            <div key={cob.id} className="p-3 border rounded-xl flex justify-between items-center bg-slate-50 text-xs">
              <div>
                <p className="font-bold text-slate-800">{cob.periodo}</p>
                <p className="font-black text-[#0B132B]">{formatCurrency(cob.monto)}</p>
              </div>
              {cob.estado === 'Pendiente' ? (
                <button onClick={() => handlePay(cob.id)} className="px-3 py-1.5 bg-[#0B132B] text-white rounded-lg font-bold">
                  Subir Transferencia
                </button>
              ) : (
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg font-bold text-[10px]">
                  {cob.estado}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// SUB-TAB CLIENTE: DECLARACIONES Y BÓVEDA
// ----------------------------------------------------------------------
function ClientDeclaraciones({ liquidaciones }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
      <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
        <FileCheck size={16} className="text-[#6B4B9A]" /> Liquidaciones Presentadas (SET)
      </h3>
      <div className="space-y-2">
        {liquidaciones.map(liq => (
          <div key={liq.id} className="p-3 border rounded-xl flex justify-between items-center bg-slate-50">
            <div>
              <p className="font-bold text-slate-800">{liq.periodo}</p>
              <p className="text-[10px] text-slate-400">Formulario IVA / IRE</p>
            </div>
            <button className="px-3 py-1 bg-[#0B132B] text-white rounded-lg font-bold flex items-center gap-1">
              <Download size={12} /> Descargar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientBoveda() {
  const docs = [
    { title: "Constancia de RUC", desc: "Documento Oficial SET" },
    { title: "Certificado CCT", desc: "Aval de Cumplimiento" },
    { title: "Cédula Tributaria", desc: "Para Facturación" }
  ];

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
      <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
        <Shield size={16} className="text-[#C5A059]" /> Archivo Fijo (Bóveda)
      </h3>
      <div className="space-y-2">
        {docs.map((doc, idx) => (
          <div key={idx} className="p-3 border rounded-xl flex justify-between items-center bg-slate-50">
            <div>
              <p className="font-bold text-slate-800">{doc.title}</p>
              <p className="text-[10px] text-slate-400">{doc.desc}</p>
            </div>
            <button className="px-3 py-1 bg-[#0B132B] text-white rounded-lg font-bold flex items-center gap-1">
              <Download size={12} /> Descargar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
