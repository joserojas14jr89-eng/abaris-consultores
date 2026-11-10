import React, { useState, useEffect } from 'react';
import { 
  Building2, Receipt, Users, LogOut, FileText, 
  UploadCloud, CheckCircle, Shield, ChevronRight, 
  DollarSign, Lock, Search, CalendarDays, Wallet
} from 'lucide-react';

// ==========================================
// 1. CONFIGURACIÓN DEL BACKEND (TU URL)
// ==========================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3GNdBNC52cfPWHdrNFIVgOgBz9pIhafOcK7dJsyXmUSksOVY27DattCK-EIkd0rSz/exec';

// Utilidad para llamar a tu Google Apps Script
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

// ==========================================
// 2. COMPONENTES VISUALES (BRANDING ABARIS)
// ==========================================
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

// ==========================================
// 3. APLICACIÓN PRINCIPAL
// ==========================================
export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('inicio');
  
  // Estados de Login
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // ----------------------------------------
  // LÓGICA DE INICIO DE SESIÓN (REAL)
  // ----------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    if (!emailInput || !passwordInput) {
      setLoginError('Por favor, completa todos los campos.');
      setIsLoggingIn(false);
      return;
    }

    const response = await apiCall('login', { email: emailInput, password: passwordInput });

    if (response.status === 'success') {
      setUser(response.user); // Carga el perfil (admin o client)
      setActiveTab(response.user.role === 'admin' ? 'facturas_admin' : 'gestion_cliente');
    } else {
      setLoginError(response.message || 'Error al iniciar sesión.');
    }
    
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    setUser(null);
    setEmailInput('');
    setPasswordInput('');
  };

  // ----------------------------------------
  // PANTALLA DE INICIO DE SESIÓN
  // ----------------------------------------
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A1128] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-4">
             <AbarisLogo className="w-28 h-28" />
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-[#D4AF37]">
            ABARIS CONSULTORES
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400 uppercase tracking-widest">
            Soluciones Contables y Financieras
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#121A35] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-700/50">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-slate-300">Correo Electrónico</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-md shadow-sm bg-[#0A1128] text-white focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm"
                    placeholder="tu@correo.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Contraseña</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-md shadow-sm bg-[#0A1128] text-white focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37] sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {loginError && (
                <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded border border-red-900/50">
                  {loginError}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-[#0A1128] bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-[#C5A059] hover:to-[#8A6D3B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all disabled:opacity-70"
                >
                  {isLoggingIn ? 'Iniciando sesión...' : 'Ingresar al Portal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------
  // PANTALLA PRINCIPAL (ADMIN O CLIENTE)
  // ----------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* BARRA LATERAL (SIDEBAR) */}
      <div className="w-64 bg-[#0A1128] text-white flex flex-col border-r border-slate-800">
        <div className="p-6 flex flex-col items-center border-b border-slate-800">
          <AbarisLogo className="w-16 h-16 mb-3" />
          <h1 className="text-lg font-bold text-[#D4AF37] tracking-wider text-center">ABARIS</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase">Portal de Gestión</p>
        </div>
        
        <div className="p-4 border-b border-slate-800 bg-[#121A35]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0A1128] font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {user.role === 'admin' ? (
            <>
              <button onClick={() => setActiveTab('facturas_admin')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'facturas_admin' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                <Receipt className="w-5 h-5" /> <span>Gestión de Facturas</span>
              </button>
              <button onClick={() => setActiveTab('clientes')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'clientes' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                <Users className="w-5 h-5" /> <span>Directorio Clientes</span>
              </button>
              <button onClick={() => setActiveTab('cobranzas')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'cobranzas' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                <DollarSign className="w-5 h-5" /> <span>Cobranzas Abaris</span>
              </button>
              <button onClick={() => setActiveTab('vencimientos')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'vencimientos' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                <CalendarDays className="w-5 h-5" /> <span>Vencimientos (SET)</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setActiveTab('gestion_cliente')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'gestion_cliente' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                <Receipt className="w-5 h-5" /> <span>Gestión Tributaria</span>
              </button>
              <button onClick={() => setActiveTab('pagos_cliente')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pagos_cliente' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                <Wallet className="w-5 h-5" /> <span>Mis Pagos</span>
              </button>
              <button onClick={() => setActiveTab('boveda')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'boveda' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                <Shield className="w-5 h-5" /> <span>Mi Bóveda</span>
              </button>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4" /> <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* ÁREA PRINCIPAL (CONTENIDO) */}
      <div className="flex-1 overflow-auto bg-slate-50 p-8">
        
        {/* === VISTAS DEL ADMINISTRADOR === */}
        {user.role === 'admin' && activeTab === 'facturas_admin' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#0A1128]">Gestión de Facturas (General)</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="border-l-4 border-[#D4AF37] pl-4 mb-4">
                <h3 className="text-lg font-bold text-slate-800">Migración Electrónica y Exportación (DNIT)</h3>
                <p className="text-sm text-slate-500">Importa facturas de Marangatu o exporta el TXT para la SET.</p>
              </div>
              <div className="flex gap-4">
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

        {/* === VISTAS DEL CLIENTE === */}
        {user.role === 'client' && activeTab === 'gestion_cliente' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-[#0A1128]">Mi Gestión Tributaria</h2>
            
            <div className="bg-[#0A1128] rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Receipt className="w-32 h-32" /></div>
              <h3 className="text-lg font-medium text-slate-300 mb-1">Resumen de IVA Estimado</h3>
              <p className="text-4xl font-bold text-[#D4AF37]">{formatCurrency(0)}</p>
              <div className="mt-4 flex gap-4 text-sm">
                <div className="bg-white/10 px-3 py-1.5 rounded text-green-300">Ventas: {formatCurrency(0)}</div>
                <div className="bg-white/10 px-3 py-1.5 rounded text-red-300">Compras: {formatCurrency(0)}</div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg flex items-start justify-between">
              <div>
                <h4 className="text-blue-800 font-bold">Extractos para IVA de Servicios Digitales</h4>
                <p className="text-sm text-blue-600 mt-1">¿Tienes consumos en Spotify, Netflix u otras plataformas? Sube tu extracto de tarjeta mensual para considerarlo en tu liquidación.</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded shadow hover:bg-blue-700">Subir PDF</button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><CheckCircle className="w-5 h-5 text-[#D4AF37] mr-2"/> Carga de Comprobante Físico</h3>
               <button className="w-full py-8 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
                  <UploadCloud className="w-10 h-10 mb-2" />
                  <span className="font-medium">Haz clic para tomar una foto o subir factura</span>
                  <span className="text-xs mt-1">El sistema leerá los datos automáticamente</span>
               </button>
            </div>
          </div>
        )}

        {/* Pestaña de Bóveda (Ejemplo visual rápido) */}
        {user.role === 'client' && activeTab === 'boveda' && (
           <div className="max-w-5xl mx-auto space-y-6">
             <h2 className="text-2xl font-bold text-[#0A1128]">Mi Bóveda de Documentos</h2>
             <p className="text-slate-600">Documentos fijos requeridos para trámites, siempre disponibles.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {['Constancia de RUC', 'Certificado de Cumplimiento Tributario', 'Cédula Tributaria', 'Cuenta Corriente DNIT'].map((doc) => (
                  <div key={doc} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                        <div className="bg-[#D4AF37]/20 p-3 rounded-lg text-[#8A6D3B]"><Shield className="w-6 h-6" /></div>
                        <span className="font-semibold text-slate-700">{doc}</span>
                     </div>
                     <button className="text-sm text-[#0A1128] font-bold underline hover:text-[#D4AF37]">Descargar</button>
                  </div>
                ))}
             </div>
           </div>
        )}

      </div>
    </div>
  );
}
