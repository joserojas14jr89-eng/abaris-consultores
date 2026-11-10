import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2, Receipt, Users, LogOut, FileText, LayoutDashboard,
  PlusCircle, TrendingUp, TrendingDown, UploadCloud, Edit2, Trash2, Camera,
  Calendar, CreditCard, Phone, Wallet, FileCheck, Download, Eye, DollarSign,
  CheckCircle, Clock, Shield, AlertCircle, CalendarDays, Bell, ChevronRight
} from 'lucide-react';

// URL DE TU BACKEND EN GOOGLE APPS SCRIPT (CONECTADA)
const API_URL = "https://script.google.com/macros/s/AKfycbz3GNdBNC52cfPWHdrNFIVgOgBz9pIhafOcK7dJsyXmUSksOVY27DattCK-EIkd0rSz/exec";

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
  const [viewMode, setViewMode] = useState('celular'); // 'celular' o 'escritorio'
  const [mockEmail, setMockEmail] = useState('');
  
  // Estados de datos
  const [invoices, setInvoices] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [rucsDirectory, setRucsDirectory] = useState({});
  const [cobranzas, setCobranzas] = useState([]);
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [abarisGastos, setAbarisGastos] = useState([]);
  const [mesesEstados, setMesesEstados] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Sincronizar con Google Sheets al iniciar
  useEffect(() => {
    cargarDatosReales();
  }, []);

  const cargarDatosReales = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setInvoices(json.data.invoices || []);
        setUsersData(json.data.usersData || []);
        setCobranzas(json.data.cobranzas || []);
        setLiquidaciones(json.data.liquidaciones || []);
        setAbarisGastos(json.data.abarisGastos || []);
        
        // Mapear estados de meses
        let estadosMap = {};
        (json.data.mesesEstados || []).forEach(m => {
          estadosMap[`${m.email}-${m.mes}`] = m.estado;
        });
        setMesesEstados(estadosMap);

        // Mapear directorio de RUCs
        let rucsMap = {};
        (json.data.rucsDirectory || []).forEach(r => {
          rucsMap[r.ruc] = r.razonSocial;
        });
        setRucsDirectory(rucsMap);
      }
    } catch (e) {
      console.error("Error al sincronizar con Google Sheets:", e);
    }
    setIsLoading(false);
  };

  const enviarAlBackend = async (action, payload) => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action, payload })
      });
      await cargarDatosReales(); // Recargar datos frescos
    } catch (e) {
      console.error("Error al enviar acción:", e);
    }
  };

  const db = {
    addInvoice: (data) => enviarAlBackend("addInvoice", data),
    addUser: (data) => enviarAlBackend("addUser", data),
    updateUser: (id, data) => enviarAlBackend("updateUser", { id, data }),
    addCobranza: (data) => enviarAlBackend("addCobranza", data),
    updateCobranza: (id, data) => enviarAlBackend("updateCobranza", { id, data }),
    addLiquidacion: (data) => enviarAlBackend("addLiquidacion", data),
    addAbarisGasto: (data) => enviarAlBackend("addAbarisGasto", data),
    setMesEstado: (email, mes, estado) => enviarAlBackend("setMesEstado", { email, mes, estado }),
    addRuc: (ruc, razonSocial) => enviarAlBackend("addRuc", { ruc, razonSocial })
  };

  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginInput) return;

    const cleanInput = loginInput.trim().toLowerCase();

    // Verificación de Administrador
    if (cleanInput === ADMIN_EMAIL.toLowerCase()) {
      if (passwordInput === ADMIN_PASSWORD) {
        setMockEmail(ADMIN_EMAIL);
      } else {
        setLoginError('Contraseña de Administrador incorrecta.');
      }
      return;
    }

    // Registro o entrada de Cliente
    if (!usersData.find(u => u.email === loginInput)) {
      db.addUser({ email: loginInput, razonSocial: 'Nuevo Cliente', ruc: '8000000-0', telefono: '0981000000', honorarios: 300000 });
    }
    setMockEmail(loginInput);
  };

  const quickLogin = (email, defaultName) => {
    setLoginError('');
    if (email === ADMIN_EMAIL) {
      // Para el botón rápido de Admin solicita la contraseña oficial
      if (passwordInput === ADMIN_PASSWORD) {
        setMockEmail(ADMIN_EMAIL);
      } else {
        setLoginInput(ADMIN_EMAIL);
        setLoginError('Ingresa la contraseña de Administrador oficial arriba.');
      }
      return;
    }
    if (!usersData.find(u => u.email === email)) {
      db.addUser({ email, razonSocial: defaultName, ruc: '80012345-6', telefono: '0981000000', honorarios: 300000 });
    }
    setMockEmail(email);
  };

  if (!mockEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0B132B' }}>
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border-t-8" style={{ borderColor: '#C5A059' }}>
          <div className="flex justify-center mb-4"><AbarisLogo className="w-20 h-20" /></div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">ABARIS</h1>
          <h2 className="text-sm font-semibold tracking-widest uppercase mb-8" style={{ color: '#C5A059' }}>Consultores</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="Ingresa tu correo electrónico" 
              className="w-full p-3 border rounded-lg outline-none text-slate-900" 
              value={loginInput} 
              onChange={e => setLoginInput(e.target.value)} 
              required 
            />
            {loginInput.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && (
              <input 
                type="password" 
                placeholder="Contraseña de Administrador" 
                className="w-full p-3 border rounded-lg outline-none text-slate-900" 
                value={passwordInput} 
                onChange={e => setPasswordInput(e.target.value)} 
                required 
              />
            )}
            {loginError && <p className="text-xs text-red-600 font-semibold">{loginError}</p>}
            <button type="submit" className="w-full text-white font-semibold p-3 rounded-lg shadow-md" style={{ backgroundColor: '#C5A059' }}>Ingresar al Portal</button>
          </form>
          <div className="mt-8 border-t pt-6">
            <p className="text-xs font-semibold text-gray-400 mb-4 uppercase">Accesos de Prueba / Rápidos</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => quickLogin(ADMIN_EMAIL)} className="w-full text-white text-sm p-3 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: '#0B132B' }}>
                <Shield size={16} className="mr-2"/> Entrar como Administrador
              </button>
              <button onClick={() => quickLogin('cliente1@empresa.com', 'Comercial El Sol S.R.L.')} className="w-full text-sm p-3 rounded-lg flex items-center justify-center border transition-colors" style={{ backgroundColor: '#F8F9FA', color: '#6B4B9A', borderColor: '#6B4B9A' }}>
                <Users size={16} className="mr-2"/> Entrar como Cliente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Barra de Control de Vista */}
      <div className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center text-xs">
        <span className="flex items-center"><Shield size={14} className="mr-1 text-amber-400"/> Conectado a Google Sheets & Drive</span>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('celular')} className={`px-3 py-1 rounded ${viewMode === 'celular' ? 'bg-amber-600 font-bold' : 'bg-slate-700'}`}>Vista Celular (Cliente)</button>
          <button onClick={() => setViewMode('escritorio')} className={`px-3 py-1 rounded ${viewMode === 'escritorio' ? 'bg-amber-600 font-bold' : 'bg-slate-700'}`}>Vista Escritorio (Admin)</button>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-start p-0 md:p-4">
        <div className={`w-full ${viewMode === 'celular' ? 'max-w-md shadow-2xl rounded-3xl overflow-hidden border-8 border-slate-900 bg-white min-h-[800px]' : 'max-w-7xl bg-white rounded-xl shadow-lg'}`}>
          {mockEmail === ADMIN_EMAIL ? (
            <AdminDashboard invoices={invoices} usersData={usersData} cobranzas={cobranzas} liquidaciones={liquidaciones} abarisGastos={abarisGastos} mesesEstados={mesesEstados} onLogout={() => { setMockEmail(''); setPasswordInput(''); }} db={db} />
          ) : (
            <ClientDashboard mockEmail={mockEmail} invoices={invoices.filter(i => i.userEmail === mockEmail)} cobranzas={cobranzas.filter(c => c.userEmail === mockEmail)} liquidaciones={liquidaciones.filter(l => l.userEmail === mockEmail)} rucsDirectory={rucsDirectory} userData={usersData.find(u => u.email === mockEmail)} mesesEstados={mesesEstados} onLogout={() => setMockEmail('')} db={db} />
          )}
        </div>
      </div>
      {isLoading && <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-full text-xs shadow-lg flex items-center"><Clock size={14} className="animate-spin mr-2"/> Sincronizando con Google...</div>}
    </div>
  );
}

// ================= ADMIN DASHBOARD =================
function AdminDashboard({ invoices, usersData, cobranzas, liquidaciones, abarisGastos, mesesEstados, onLogout, db }) {
  const [activeTab, setActiveTab] = useState('facturas');
  const clients = usersData.filter(u => u.email !== ADMIN_EMAIL);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="w-full md:w-64 text-white flex flex-col shadow-xl z-20" style={{ backgroundColor: '#0B132B' }}>
        <div className="p-6 text-center border-b border-slate-700">
          <AbarisLogo className="mx-auto mb-3 w-16 h-16" />
          <h2 className="font-bold text-lg" style={{ color: '#C5A059' }}>ABARIS</h2>
          <span className="text-xs text-slate-400 uppercase">Panel Administrador</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('facturas')} className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'facturas' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/50'}`}><Receipt size={18} className="mr-3 text-amber-500"/> Facturas y SET</button>
          <button onClick={() => setActiveTab('vencimientos')} className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'vencimientos' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/50'}`}><CalendarDays size={18} className="mr-3 text-amber-500"/> Vencimientos</button>
          <button onClick={() => setActiveTab('clientes')} className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'clientes' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/50'}`}><Users size={18} className="mr-3 text-amber-500"/> Directorio</button>
          <button onClick={() => setActiveTab('cobranzas')} className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'cobranzas' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/50'}`}><Wallet size={18} className="mr-3 text-amber-500"/> Cobranzas</button>
          <button onClick={() => setActiveTab('finanzas')} className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'finanzas' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/50'}`}><TrendingUp size={18} className="mr-3 text-amber-500"/> Finanzas Estudio</button>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button onClick={onLogout} className="w-full flex items-center justify-center p-3 bg-red-900/40 text-red-300 rounded-lg hover:bg-red-900/60"><LogOut size={18} className="mr-2"/> Cerrar Sesión</button>
        </div>
      </div>
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'facturas' && <AdminFacturas invoices={invoices} clients={clients} db={db} mesesEstados={mesesEstados} />}
        {activeTab === 'clientes' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center text-slate-800"><Users className="mr-2" style={{ color: '#6B4B9A' }}/> Directorio de Clientes</h3>
            <div className="grid gap-4">{clients.map(client => <ClientEditCard key={client.id || client.email} client={client} db={db} />)}</div>
          </div>
        )}
        {activeTab === 'cobranzas' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center text-slate-800"><Wallet className="mr-2" style={{ color: '#6B4B9A' }}/> Control de Cobranzas</h3>
            <AdminCobranzaForm clients={clients} db={db} />
            <AdminCobranzaList cobranzas={cobranzas} db={db} />
          </div>
        )}
        {activeTab === 'finanzas' && <AdminFinanzas cobranzas={cobranzas} abarisGastos={abarisGastos} db={db} />}
        {activeTab === 'vencimientos' && <AdminVencimientos clients={clients} />}
      </div>
    </div>
  );
}

function AdminFacturas({ invoices, clients, db, mesesEstados }) {
  const [importClient, setImportClient] = useState('');
  const [importPeriod, setImportPeriod] = useState('');
  const [exportClient, setExportClient] = useState('');
  const [exportPeriod, setExportPeriod] = useState('');

  const handleImportMarangatu = (e) => {
    e.preventDefault();
    if (!importClient || !importPeriod) return alert('Selecciona cliente y periodo.');
    db.addInvoice({
      userEmail: importClient,
      fecha: `${importPeriod}-15`,
      ruc: '80000000',
      razonSocial: 'PROVEEDOR ELECTRÓNICO S.A. (MARANGATÚ)',
      tipo: 'Gasto',
      monto: 850000,
      iva10: 77272,
      cdc: '05800261577001002036773922026101314320998022',
      origen: 'ELECTRONICO'
    });
    db.setMesEstado(importClient, importPeriod, 'Pendiente');
    alert('¡Excel de Marangatú procesado! El balance se actualizó y el cliente debe aprobarlo.');
  };

  const handleExportSet = (e) => {
    e.preventDefault();
    if (!exportClient || !exportPeriod) return alert('Selecciona cliente y periodo.');
    const estado = mesesEstados[`${exportClient}-${exportPeriod}`];
    if (estado !== 'Aprobado') return alert('No puedes exportar: El cliente aún no ha dado su Aprobación (OK) para este periodo.');

    const comprobantesFisicos = invoices.filter(inv => inv.userEmail === exportClient && inv.fecha && inv.fecha.startsWith(exportPeriod) && !inv.cdc);

    let csvContent = "";
    comprobantesFisicos.forEach(inv => {
      const tipoReg = inv.tipo === 'Ingreso' ? '1' : '2';
      const tipoId = '11';
      const rucComprador = inv.ruc || '80000000';
      const razonSoc = inv.razonSocial || 'SIN NOMBRE';
      const tipoComp = '109';
      const fechaFmt = inv.fecha.split('-').reverse().join('/');
      const timbrado = '12345678';
      const nroComp = '001-001-0000001';
      const grav10 = inv.iva10 ? inv.monto : 0;
      const grav5 = inv.iva5 ? inv.monto : 0;
      const exento = 0;
      const total = inv.monto;
      const condicion = '1';
      const monedaExt = 'N';
      const imputaIva = 'S';
      const imputaIre = 'N';
      const imputaIrp = 'S';
      const noImputa = 'N';

      csvContent += `${tipoReg};${tipoId};${rucComprador};${razonSoc};${tipoComp};${fechaFmt};${timbrado};${nroComp};${grav10};${grav5};${exento};${total};${condicion};${monedaExt};${imputaIva};${imputaIre};${imputaIrp};${noImputa}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `80000000_REG_${exportPeriod.replace('-','')}_V0001.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('¡Archivo oficial SET (.CSV) generado con éxito según la normativa!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold mb-2 flex items-center text-slate-800"><Download className="mr-2 text-purple-700"/> 1. Importar Facturas Electrónicas (Excel Marangatú)</h3>
        <form onSubmit={handleImportMarangatu} className="flex flex-col md:flex-row gap-4 items-end mt-4">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-semibold mb-1">Cliente</label>
            <select required className="w-full border p-2 rounded-lg text-sm text-slate-900" value={importClient} onChange={e => setImportClient(e.target.value)}>
              <option value="">Seleccionar...</option>
              {clients.map(c => <option key={c.email} value={c.email}>{c.razonSocial || c.email}</option>)}
            </select>
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-semibold mb-1">Periodo</label>
            <input required type="month" className="w-full border p-2 rounded-lg text-sm text-slate-900" value={importPeriod} onChange={e => setImportPeriod(e.target.value)} />
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-semibold mb-1">Archivo Excel Marangatú</label>
            <input required type="file" accept=".xlsx,.csv" className="w-full text-sm border p-1 rounded-lg text-slate-900" />
          </div>
          <button type="submit" className="text-white px-5 py-2.5 rounded-lg text-sm font-semibold bg-purple-700">Importar Excel</button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold mb-2 flex items-center text-slate-800"><UploadCloud className="mr-2 text-amber-600"/> 2. Exportar Archivo SET Oficial (.CSV)</h3>
        <form onSubmit={handleExportSet} className="flex flex-col md:flex-row gap-4 items-end mt-4">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-semibold mb-1">Cliente</label>
            <select required className="w-full border p-2 rounded-lg text-sm text-slate-900" value={exportClient} onChange={e => setExportClient(e.target.value)}>
              <option value="">Seleccionar...</option>
              {clients.map(c => <option key={c.email} value={c.email}>{c.razonSocial || c.email}</option>)}
            </select>
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-semibold mb-1">Periodo a Exportar</label>
            <input required type="month" className="w-full border p-2 rounded-lg text-sm text-slate-900" value={exportPeriod} onChange={e => setExportPeriod(e.target.value)} />
          </div>
          <button type="submit" className="text-white px-5 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 flex items-center"><Download className="mr-2" size={16}/> Descargar .CSV SET</button>
        </form>
      </div>
    </div>
  );
}

function ClientEditCard({ client, db }) {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(client);
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    db.updateUser(client.id || client.email, data);
    setIsEditing(false);
  };

  return (
    <div className="border p-4 rounded-xl bg-slate-50">
      {!isEditing ? (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h4 className="font-bold text-slate-800 text-lg">{client.razonSocial || 'Sin Nombre'}</h4>
            <p className="text-sm text-slate-500">{client.email} | RUC: {client.ruc || 'N/A'}</p>
            <div className="flex gap-4 mt-2 text-xs font-semibold text-slate-600">
              <span>Tel: {client.telefono || 'N/A'}</span>
              <span className="text-amber-600">Honorarios: {formatCurrency(client.honorarios)}</span>
              <span className="flex items-center text-purple-700">
                Marangatú Pwd: {showPassword ? (client.marangatuPassword || 'No cargada') : '••••••••'}
                <button onClick={() => setShowPassword(!showPassword)} className="ml-2 text-slate-500 hover:text-slate-800"><Eye size={14}/></button>
              </span>
            </div>
          </div>
          <button onClick={() => setIsEditing(true)} className="mt-4 md:mt-0 flex items-center text-sm border px-4 py-2 rounded-lg bg-white shadow-sm"><Edit2 size={14} className="mr-2"/> Editar Datos</button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" placeholder="Razón Social" className="border p-2 rounded text-sm bg-white text-slate-900" value={data.razonSocial || ''} onChange={e => setData({...data, razonSocial: e.target.value})} />
            <input type="text" placeholder="RUC" className="border p-2 rounded text-sm bg-white text-slate-900" value={data.ruc || ''} onChange={e => setData({...data, ruc: e.target.value})} />
            <input type="text" placeholder="Teléfono" className="border p-2 rounded text-sm bg-white text-slate-900" value={data.telefono || ''} onChange={e => setData({...data, telefono: e.target.value})} />
            <input type="number" placeholder="Honorarios Gs." className="border p-2 rounded text-sm bg-white text-slate-900" value={data.honorarios || 0} onChange={e => setData({...data, honorarios: e.target.value})} />
            <input type="text" placeholder="Contraseña Marangatú" className="border p-2 rounded text-sm bg-white text-slate-900 md:col-span-2" value={data.marangatuPassword || ''} onChange={e => setData({...data, marangatuPassword: e.target.value})} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-slate-600 text-sm">Cancelar</button>
            <button onClick={handleSave} className="px-4 py-1 bg-slate-900 text-white rounded text-sm">Guardar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminCobranzaForm({ clients, db }) {
  const [form, setForm] = useState({ userEmail: '', periodo: 'Noviembre 2026', monto: '' });
  const handleSubmit = (e) => {
    e.preventDefault();
    db.addCobranza({ ...form, monto: Number(form.monto), estado: 'Pendiente', createdAt: new Date().toISOString() });
    setForm({ userEmail: '', periodo: 'Noviembre 2026', monto: '' });
    alert('Cobro de honorarios generado con éxito para el cliente.');
  };
  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded-xl bg-slate-50 mb-6">
      <h4 className="font-semibold mb-3 text-sm text-slate-700">Generar Cobro de Honorarios</h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select required className="border p-2 rounded text-sm bg-white text-slate-900" value={form.userEmail} onChange={e => setForm({...form, userEmail: e.target.value})}>
          <option value="">Seleccionar Cliente...</option>
          {clients.map(c => <option key={c.email} value={c.email}>{c.razonSocial || c.email}</option>)}
        </select>
        <input required type="text" placeholder="Periodo" className="border p-2 rounded text-sm bg-white text-slate-900" value={form.periodo} onChange={e => setForm({...form, periodo: e.target.value})} />
        <input required type="number" placeholder="Monto Gs." className="border p-2 rounded text-sm bg-white text-slate-900" value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} />
        <button type="submit" className="bg-amber-600 text-white p-2 rounded text-sm font-semibold flex items-center justify-center"><PlusCircle size={16} className="mr-1"/> Generar Deuda</button>
      </div>
    </form>
  );
}

function AdminCobranzaList({ cobranzas, db }) {
  const [inspectingCob, setInspectingCob] = useState(null);

  return (
    <div>
      <h4 className="font-semibold mb-3 text-slate-800">Historial de Cobranzas</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 border-b text-slate-800">
            <tr><th className="p-3">Periodo</th><th className="p-3">Cliente</th><th className="p-3 text-right">Monto</th><th className="p-3 text-center">Estado</th><th className="p-3 text-center">Acciones</th></tr>
          </thead>
          <tbody className="divide-y text-slate-800">
            {cobranzas.map(cob => (
              <tr key={cob.id || cob.createdAt}>
                <td className="p-3 font-bold">{cob.periodo}</td>
                <td className="p-3">{cob.userEmail}</td>
                <td className="p-3 text-right font-medium">{formatCurrency(cob.monto)}</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${cob.estado === 'Pagado' ? 'bg-emerald-100 text-emerald-800' : cob.estado === 'En Revisión' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>{cob.estado}</span>
                </td>
                <td className="p-3 text-center flex justify-center gap-2">
                  {cob.comprobanteUrl && <button onClick={() => setInspectingCob(cob)} className="text-purple-700 border border-purple-600 px-2 py-1 rounded text-xs flex items-center"><Eye size={12} className="mr-1"/> Ver Comprobante</button>}
                  {cob.estado === 'En Revisión' && <button onClick={() => db.updateCobranza(cob.id, { estado: 'Pagado' })} className="bg-emerald-700 text-white px-3 py-1 rounded text-xs">Aprobar Pago</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {inspectingCob && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full">
            <h3 className="font-bold text-lg mb-3 text-slate-900">Comprobante de Transferencia</h3>
            <div className="bg-slate-100 p-4 rounded-xl text-center mb-4 border">
              <p className="text-xs text-slate-500 mb-2">Cliente: {inspectingCob.userEmail} | Monto: {formatCurrency(inspectingCob.monto)}</p>
              <img src={inspectingCob.comprobanteUrl} alt="Comprobante" className="max-h-64 mx-auto rounded shadow object-contain" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setInspectingCob(null)} className="px-4 py-2 border rounded-lg text-sm text-slate-800">Cerrar</button>
              <button onClick={() => { db.updateCobranza(inspectingCob.id, { estado: 'Pagado' }); setInspectingCob(null); }} className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm">Aprobar y Acreditar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminFinanzas({ cobranzas, abarisGastos, db }) {
  const [form, setForm] = useState({ concepto: '', categoria: 'Distribución Equipo', monto: '', fecha: new Date().toISOString().split('T')[0] });
  const ingresos = cobranzas.filter(c => c.estado === 'Pagado').reduce((acc, curr) => acc + Number(curr.monto), 0);
  const egresos = abarisGastos.reduce((acc, curr) => acc + Number(curr.monto), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    db.addAbarisGasto({ ...form, monto: Number(form.monto) });
    setForm({ concepto: '', categoria: 'Distribución Equipo', monto: '', fecha: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center text-slate-800"><TrendingUp className="mr-2 text-purple-700"/> Finanzas Internas del Estudio</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 bg-slate-50 rounded-xl border"><p className="text-xs font-bold text-slate-500 uppercase">Ingresos Cobrados</p><p className="text-2xl font-black text-slate-900">{formatCurrency(ingresos)}</p></div>
        <div className="p-5 bg-slate-50 rounded-xl border"><p className="text-xs font-bold text-slate-500 uppercase">Egresos Operativos</p><p className="text-2xl font-black text-slate-900">{formatCurrency(egresos)}</p></div>
        <div className="p-5 rounded-xl text-white" style={{ backgroundColor: '#0B132B' }}><p className="text-xs font-bold text-amber-400 uppercase">Rentabilidad Neta</p><p className="text-2xl font-black">{formatCurrency(ingresos - egresos)}</p></div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input required type="date" className="border p-2 rounded text-sm text-slate-900" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
        <input required type="text" placeholder="Concepto (Ej. Alquiler Oficina)" className="border p-2 rounded text-sm flex-1 text-slate-900" value={form.concepto} onChange={e => setForm({...form, concepto: e.target.value})} />
        <input required type="number" placeholder="Monto Gs." className="border p-2 rounded text-sm text-slate-900" value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} />
        <button type="submit" className="bg-purple-700 text-white px-4 rounded"><PlusCircle size={18}/></button>
      </form>
    </div>
  );
}

function AdminVencimientos({ clients }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center text-slate-800"><CalendarDays className="mr-2 text-amber-600"/> Vencimientos SET (RUC)</h3>
      <p className="text-sm text-slate-500 mb-4">Calendario de prioridades fiscales basado en el último dígito del RUC.</p>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 border-b text-slate-800"><tr><th className="p-3">Cliente</th><th className="p-3">RUC</th><th className="p-3 text-right">Prioridad</th></tr></thead>
          <tbody className="divide-y text-slate-800">
            {clients.map(c => (
              <tr key={c.email}><td className="p-3 font-bold">{c.razonSocial || c.email}</td><td className="p-3">{c.ruc || 'Falta cargar'}</td><td className="p-3 text-right"><span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold">Próximo Vencimiento</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ================= CLIENT DASHBOARD =================
function ClientDashboard({ mockEmail, invoices, cobranzas, liquidaciones, rucsDirectory, userData, mesesEstados, onLogout, db }) {
  const [activeTab, setActiveTab] = useState('inicio');
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="text-white p-4 shadow-lg sticky top-0 z-30" style={{ backgroundColor: '#0B132B' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <AbarisLogo className="w-10 h-10" />
            <div>
              <h1 className="font-bold text-lg">ABARIS</h1>
              <p className="text-[10px] uppercase text-amber-400">{userData?.razonSocial || mockEmail}</p>
            </div>
          </div>
          <button onClick={onLogout} className="text-red-400 hover:text-red-300 p-2 bg-slate-800 rounded-full"><LogOut size={18}/></button>
        </div>
        <nav className="flex bg-slate-800 rounded-xl p-1 mt-4 gap-1 overflow-x-auto">
          <button onClick={() => setActiveTab('inicio')} className={`flex-1 py-2 px-3 text-xs rounded-lg font-bold flex items-center justify-center whitespace-nowrap ${activeTab === 'inicio' ? 'bg-white text-slate-900' : 'text-slate-300'}`}><Receipt size={14} className="mr-1"/> Inicio</button>
          <button onClick={() => setActiveTab('pagos')} className={`flex-1 py-2 px-3 text-xs rounded-lg font-bold flex items-center justify-center whitespace-nowrap ${activeTab === 'pagos' ? 'bg-white text-slate-900' : 'text-slate-300'}`}><CreditCard size={14} className="mr-1"/> Mis Pagos</button>
          <button onClick={() => setActiveTab('declaraciones')} className={`flex-1 py-2 px-3 text-xs rounded-lg font-bold flex items-center justify-center whitespace-nowrap ${activeTab === 'declaraciones' ? 'bg-white text-slate-900' : 'text-slate-300'}`}><FileCheck size={14} className="mr-1"/> Declaraciones</button>
        </nav>
      </header>

      <div className="flex-1 p-4 space-y-4">
        {activeTab === 'inicio' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <h3 className="font-bold text-slate-800 mb-2">Comprobantes Recientes</h3>
              <p className="text-xs text-slate-500">Listado de facturas cargadas y procesadas.</p>
            </div>
          </div>
        )}
        {activeTab === 'pagos' && (
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <h3 className="font-bold text-slate-800 mb-2">Historial de Honorarios</h3>
            <p className="text-xs text-slate-500">Estado de tus cuotas mensuales y comprobantes subidos.</p>
          </div>
        )}
        {activeTab === 'declaraciones' && (
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <h3 className="font-bold text-slate-800 mb-2">Liquidaciones de Impuestos</h3>
            <p className="text-xs text-slate-500">Resumen de IVA/IRP y aprobación mensual.</p>
          </div>
        )}
      </div>
    </div>
  );
}
