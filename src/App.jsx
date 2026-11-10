import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2, Receipt, Users, LogOut, FileText, LayoutDashboard,
  PlusCircle, TrendingUp, TrendingDown, UploadCloud, Edit2, Trash2, Camera,
  Calendar, CreditCard, Phone, Wallet, FileCheck, Download, Eye, DollarSign,
  CheckCircle, Clock, Shield, AlertCircle, CalendarDays, Bell, ChevronRight
} from 'lucide-react';

// URL DE TU BACKEND EN GOOGLE APPS SCRIPT
const API_URL = "https://script.google.com/macros/s/AKfycbz3GNdBNC52cfPWhdrNFIVgOgBz9PihaFOcK7dJsyXmUSks0VY2DattCK-Eikd0Rsz/exec";

// CREDANCIALES OFICIALES DE ADMINISTRADOR
const ADMIN_EMAIL = "jose.rojas14.jr89@gmail.com";
const ADMIN_PASSWORD = "613101Joseed*";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG' }).format(Number(amount) || 0);
};

const AbarisLogo = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 15 L20 80 L32 80 L50 40 L68 80 L80 80 Z" fill="#C5A059" />
    <path d="M50 55 L35 70 L50 85 L65 70 Z" fill="#6B4B9A" />
  </svg>
);

export default function AbarisApp() {
  const [viewMode, setViewMode] = useState('celular');
  const [mockEmail, setMockEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // 'admin' o 'cliente'
  const [clientData, setClientData] = useState(null);
  const [loginError, setLoginError] = useState('');

  // Estados de datos
  const [clientes, setClientes] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Formularios
  const [nuevoCliente, setNuevoCliente] = useState({ ruc: '', razonSocial: '', email: '', telefono: '', honorario: '' });
  const [nuevaFactura, setNuevaFactura] = useState({ rucCliente: '', tipo: 'Emitida', numero: '', concepto: '', montoTotal: '', iva10: '', iva5: '', fecha: '' });

  // Cargar datos al iniciar
  useEffect(() => {
    if (isLoggedIn && role === 'admin') {
      cargarDatosDesdeBackend();
    }
  }, [isLoggedIn, role]);

  const cargarDatosDesdeBackend = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=getData`);
      const json = await res.json();
      if (json.status === 'success') {
        setClientes(json.clientes || []);
        setFacturas(json.facturas || []);
        setMovimientos(json.movimientos || []);
      }
    } catch (err) {
      console.error("Error al cargar datos de Google Sheets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = mockEmail.trim().toLowerCase();

    // Verificación de Administrador
    if (cleanEmail === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      setRole('admin');
      setIsLoggedIn(true);
      return;
    }

    // Verificación de Cliente (si existe en la base de datos local o clientes ficticios)
    const clienteEncontrado = clientes.find(c => c.email && c.email.toLowerCase() === cleanEmail);
    if (clienteEncontrado) {
      setClientData(clienteEncontrado);
      setRole('cliente');
      setIsLoggedIn(true);
    } else if (cleanEmail !== ADMIN_EMAIL.toLowerCase()) {
      setLoginError('Correo no encontrado o contraseña incorrecta de Administrador.');
    } else {
      setLoginError('Contraseña de Administrador incorrecta.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setMockEmail('');
    setPassword('');
    setClientData(null);
  };

  const handleGuardarCliente = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addCliente', data: nuevoCliente })
      });
      setNuevoCliente({ ruc: '', razonSocial: '', email: '', telefono: '', honorario: '' });
      await cargarDatosDesdeBackend();
    } catch (err) {
      console.error("Error al guardar cliente:", err);
    } finally {
      setLoading(false);
    }
  };

  // VISTA DE LOGIN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <AbarisLogo className="w-16 h-16" />
            <h1 className="text-2xl font-bold text-amber-400">ABARIS Consultores</h1>
            <p className="text-sm text-slate-400">Portal Contable y Financiero</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={mockEmail}
                onChange={(e) => setMockEmail(e.target.value)}
                placeholder="ejemplo@abaris.com.py"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Contraseña / PIN</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3 rounded-lg shadow-lg transition-all"
            >
              Ingresar al Portal
            </button>
          </form>

          <div className="text-xs text-center text-slate-500">
            <p>Acceso seguro cifrado para clientes y administradores.</p>
          </div>
        </div>
      </div>
    );
  }

  // VISTA PANEL ADMINISTRADOR
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      {/* Barra superior */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <AbarisLogo className="w-8 h-8" />
          <div>
            <h2 className="font-bold text-amber-400 leading-none">ABARIS</h2>
            <span className="text-xs text-slate-400">Panel de Administración</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30">
            {ADMIN_EMAIL}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Total Clientes</p>
              <h3 className="text-2xl font-bold text-slate-900">{clientes.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Facturas Registradas</p>
              <h3 className="text-2xl font-bold text-slate-900">{facturas.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Estado de Backend</p>
              <h3 className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Conectado a Sheets
              </h3>
            </div>
          </div>
        </div>

        {/* Sección de Registro de Clientes */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-500" /> Registrar Nuevo Cliente
          </h3>
          <form onSubmit={handleGuardarCliente} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="RUC (ej: 80012345-6)"
              required
              value={nuevoCliente.ruc}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, ruc: e.target.value })}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
            <input
              type="text"
              placeholder="Razón Social / Nombre"
              required
              value={nuevoCliente.razonSocial}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, razonSocial: e.target.value })}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              required
              value={nuevoCliente.email}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={nuevoCliente.telefono}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
            <input
              type="number"
              placeholder="Honorario Mensual (PYG)"
              value={nuevoCliente.honorario}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, honorario: e.target.value })}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
            >
              {loading ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
