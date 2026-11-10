import React, { useState, useEffect } from 'react';
import { 
  Building2, Receipt, Users, LogOut, FileText, 
  UploadCloud, CheckCircle, Shield, ChevronRight, 
  DollarSign, Lock, Search, CalendarDays, Wallet, User, Phone, CreditCard, RefreshCw
} from 'lucide-react';

// ==========================================
// 1. CONFIGURACIÓN DEL BACKEND
// ==========================================
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
    console.error("Error en apiCall:", error);
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
  const [activeTab, setActiveTab] = useState('inicio');
  
  // Estados de Auth
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [rucInput, setRucInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState({ type: '', text: '' });

  // Estados de Datos (Admin)
  const [clientes, setClientes] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);

  // Cargar datos al entrar como admin
  const cargarDatosAdmin = async () => {
    setIsFetchingData(true);
    try {
      // Tu doGet en Apps Script devuelve todo al hacer un fetch GET simple
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const result = await response.json();
      if (result.status === 'success') {
        // Guardamos solo los clientes (excluyendo la cuenta admin)
        const listaClientes = result.data.usersData.filter(c => c.email !== 'jose.rojas14.jr89@gmail.com');
        setClientes(listaClientes);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
    setIsFetchingData(false);
  };

  useEffect(() => {
    if (user && user.role === 'admin' && activeTab === 'clientes') {
      cargarDatosAdmin();
    }
  }, [user, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthMessage({ type: '', text: '' });
    setIsLoading(true);

    const response = await apiCall('login', { email: emailInput, password: passwordInput });
    if (response.status === 'success') {
      setUser(response.user);
      setActiveTab(response.user.role === 'admin' ? 'facturas_admin' : 'gestion_cliente');
    } else {
      setAuthMessage({ type: 'error', text: response.message || 'Error al iniciar sesión.' });
    }
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthMessage({ type: '', text: '' });
    setIsLoading(true);

    const payload = { email: emailInput, password: passwordInput, razonSocial: nameInput, ruc: rucInput, telefono: phoneInput };
    const response = await apiCall('addUser', payload);

    if (response.status === 'success') {
      setAuthMessage({ type: 'success', text: '¡Cuenta creada! Ingresando al portal...' });
      setTimeout(() => {
        setUser({ email: emailInput, role: 'client', name: nameInput, ruc: rucInput });
        setActiveTab('gestion_cliente');
      }, 1500);
    } else {
      setAuthMessage({ type: 'error', text: response.message || 'Error al crear la cuenta.' });
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setEmailInput('');
    setPasswordInput('');
    setAuthMessage({ type: '', text: '' });
    setClientes([]);
  };

  // --- PANTALLA DE INICIO DE SESIÓN ---
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
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><CreditCard className="h-5 w-5 text-slate-500" /></div>
                        <input type="text" required value={rucInput} onChange={(e) => setRucInput(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-600 rounded-md bg-[#0A1128] text-white focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm" placeholder="1234567-8" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300">Teléfono</label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-slate-500" /></div>
                        <input type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-600 rounded-md bg-[#0A1128] text-white focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm" placeholder="09XX XXX XXX" />
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300">Correo Electrónico {isRegisterMode && '*'}</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-500" /></div>
                  <input type="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-600 rounded-md bg-[#0A1128] text-white focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm" placeholder="tu@correo.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Contraseña {isRegisterMode && '*'}</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Shield className="h-5 w-5 text-slate-500" /></div>
                  <input type="password" required value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-600 rounded-md bg-[#0A1128] text-white focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm" placeholder="••••••••" />
                </div>
              </div>
              {authMessage.text && (
                <div className={`text-sm text-center p-2 rounded border ${authMessage.type === 'error' ? 'text-red-400 bg-red-900/20 border-red-900/50' : 'text-green-400 bg-green-900/20 border-green-900/50'}`}>{authMessage.text}</div>
              )}
              <div>
                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-bold text-[#0A1128] bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#C5A059] hover:to-[#8A6D3B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all disabled:opacity-70 mt-4">
                  {isLoading ? 'Procesando...' : (isRegisterMode ? 'Crear Cuenta Segura' : 'Ingresar al Portal')}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center border-t border-slate-700 pt-4">
              <button onClick={() => { setIsRegisterMode(!isRegisterMode); setAuthMessage({type:'', text:''}); }} className="text-sm text-[#D4AF37] hover:text-white font-medium transition-colors">
                {isRegisterMode ? '¿Ya tienes una cuenta? Inicia sesión aquí' : '¿Eres nuevo cliente? Solicita tu cuenta aquí'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- PANTALLA PRINCIPAL ---
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#0A1128] text-white flex flex-col border-r border-slate-800 hidden md:flex shrink-0">
        <div className="p-6 flex flex-col items-center border-b border-slate-800">
          <AbarisLogo className="w-16 h-16 mb-3" />
          <h1 className="text-lg font-bold text-[#D4AF37] tracking-wider text-center">ABARIS</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase">Portal de Gestión</p>
        </div>
        <div className="p-4 border-b border-slate-800 bg-[#121A35]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0A1128] font-bold text-lg">{user.name.charAt(0).toUpperCase()}</div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {user.role === 'admin' ? (
            <>
              <button onClick={() => setActiveTab('facturas_admin')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'facturas_admin' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}><Receipt className="w-5 h-5" /> <span>Gestión de Facturas</span></button>
              <button onClick={() => setActiveTab('clientes')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'clientes' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}><Users className="w-5 h-5" /> <span>Directorio Clientes</span></button>
              <button onClick={() => setActiveTab('cobranzas')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'cobranzas' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}><DollarSign className="w-5 h-5" /> <span>Cobranzas Abaris</span></button>
            </>
          ) : (
            <>
              <button onClick={() => setActiveTab('gestion_cliente')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'gestion_cliente' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}><Receipt className="w-5 h-5" /> <span>Gestión Tributaria</span></button>
              <button onClick={() => setActiveTab('boveda')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'boveda' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}><Shield className="w-5 h-5" /> <span>Mi Bóveda</span></button>
            </>
          )}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"><LogOut className="w-4 h-4" /> <span>Cerrar Sesión</span></button>
        </div>
      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 overflow-auto bg-slate-50 p-4 md:p-8">
        
        {/* Cabecera Móvil */}
        <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3">
             <AbarisLogo className="w-10 h-10" />
             <div><h1 className="text-sm font-bold text-[#0A1128]">{user.name}</h1><p className="text-xs text-slate-500">{user.role === 'admin' ? 'Administrador' : 'Portal Cliente'}</p></div>
          </div>
          <button onClick={handleLogout} className="p-2 text-red-500 bg-red-50 rounded-lg"><LogOut className="w-5 h-5" /></button>
        </div>

        {/* --- PANEL ADMIN: DIRECTORIO DE CLIENTES --- */}
        {user.role === 'admin' && activeTab === 'clientes' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#0A1128]">Directorio de Clientes</h2>
              <button onClick={cargarDatosAdmin} disabled={isFetchingData} className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 text-slate-700 font-medium disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${isFetchingData ? 'animate-spin' : ''}`} /> <span>Actualizar</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-[#0A1128] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Cliente / Razón Social</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">RUC</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Contacto</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {isFetchingData ? (
                      <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">Cargando directorio...</td></tr>
                    ) : clientes.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No hay clientes registrados aún.</td></tr>
                    ) : (
                      clientes.map((c, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-slate-900">{c.razonSocial || 'Sin nombre'}</div>
                            <div className="text-xs text-slate-500">{c.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{c.ruc || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{c.telefono || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {c.estado || 'Activo'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- PANEL ADMIN: FACTURAS --- */}
        {user.role === 'admin' && activeTab === 'facturas_admin' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-[#0A1128]">Gestión de Facturas</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="border-l-4 border-[#D4AF37] pl-4 mb-4">
                <h3 className="text-lg font-bold text-slate-800">Migración Electrónica y Exportación (DNIT)</h3>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                 <button className="flex-1 flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-[#D4AF37] text-[#8A6D3B] rounded-lg hover:bg-[#F9E7B3]/20 bg-white font-medium">
                    <UploadCloud className="w-5 h-5" /> <span>Importar Excel (Marangatu)</span>
                 </button>
                 <button className="flex-1 flex items-center justify-center space-x-2 py-3 bg-[#0A1128] text-white rounded-lg hover:bg-[#121A35] font-medium shadow-md">
                    <FileText className="w-5 h-5" /> <span>Generar Archivo .TXT (SET)</span>
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* --- PANEL CLIENTE: GESTIÓN --- */}
        {user.role === 'client' && activeTab === 'gestion_cliente' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-[#0A1128]">Mi Gestión Tributaria</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><CheckCircle className="w-5 h-5 text-[#D4AF37] mr-2"/> Carga de Comprobante Físico</h3>
               <button className="w-full py-8 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
                  <UploadCloud className="w-10 h-10 mb-2" />
                  <span className="font-medium text-center px-4">Haz clic para subir foto o PDF</span>
               </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
