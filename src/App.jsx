import React, { useState, useMemo } from 'react';
import {
  Building2, Receipt, Users, LogOut, FileText,
  PlusCircle, TrendingUp, UploadCloud, Edit2, Camera,
  CalendarDays, CreditCard, Phone, Wallet, FileCheck, Download,
  CheckCircle, Clock, Shield, AlertCircle, Bell, ChevronRight, DollarSign
} from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG' }).format(Number(amount) || 0);
};

const AbarisLogo = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 300 300" className={className}>
    <defs>
      <linearGradient id="goldGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F3E5AB" />
        <stop offset="50%" stopColor="#C5A059" />
        <stop offset="100%" stopColor="#8A6D3B" />
      </linearGradient>
      <linearGradient id="goldGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E6C575" />
        <stop offset="100%" stopColor="#9E7B3B" />
      </linearGradient>
      <linearGradient id="purpleGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8A64BD" />
        <stop offset="100%" stopColor="#4A2E73" />
      </linearGradient>
      <linearGradient id="purpleGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6B4B9A" />
        <stop offset="100%" stopColor="#361D59" />
      </linearGradient>
    </defs>
    <polygon points="150,40 125,90 95,200 65,220 120,90" fill="url(#goldGradLeft)" />
    <polygon points="150,40 180,90 235,220 205,200 175,90" fill="url(#goldGradRight)" />
    <polygon points="150,40 135,110 150,140 165,110" fill="#D4AF37" />
    <polygon points="150,40 135,110 150,140" fill="#FFF2B2" opacity="0.3" />
    <polygon points="150,220 80,140 105,120 150,170" fill="url(#purpleGradLeft)" />
    <polygon points="150,220 220,140 195,120 150,170" fill="url(#purpleGradRight)" />
    <polygon points="150,170 105,120 125,120 150,150" fill="#A47CD6" />
    <polygon points="150,170 195,120 175,120 150,150" fill="#52337E" />
    <polygon points="95,200 65,220 105,220" fill="url(#goldGradLeft)" />
    <polygon points="205,200 235,220 195,220" fill="url(#goldGradRight)" />
  </svg>
);

export default function App() {
  const [mockEmail, setMockEmail] = useState('');
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [invoices, setInvoices] = useState([
    { id: '1', userEmail: 'cliente1@empresa.com', fecha: '2026-11-05', ruc: '80012345-6', razonSocial: 'Servicios Generales S.A.', tipo: 'Gasto', monto: 1200000, iva5: 0, iva10: 109091, cdc: '0123456789' }
  ]);
  const [usersData, setUsersData] = useState([
    { id: '1', email: 'cliente1@empresa.com', razonSocial: 'Empresa de Prueba S.A.', ruc: '80012345-6', telefono: '0981123456', honorarios: 350000 }
  ]);
  const [rucsDirectory, setRucsDirectory] = useState({ '80012345-6': 'Empresa de Prueba S.A.' });
  const [cobranzas, setCobranzas] = useState([
    { id: '1', userEmail: 'cliente1@empresa.com', periodo: 'Noviembre 2026', monto: 350000, estado: 'Pendiente' }
  ]);
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [abarisGastos, setAbarisGastos] = useState([]);
  const [mesesEstados, setMesesEstados] = useState({});

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
    if (loginInput === 'jose.rojas14.jr89@gmail.com' && passwordInput === '613101Joseed*') {
      setMockEmail(loginInput);
      return;
    }
    if (!usersData.find(u => u.email === loginInput)) {
      mockDb.addUser({
        email: loginInput,
        razonSocial: 'Nuevo Cliente',
        ruc: '80000000-0',
        telefono: '0981000000',
        honorarios: 300000
      });
    }
    setMockEmail(loginInput);
  };

  if (!mockEmail) {
    return (
      <div className="min-h-screen bg-[#0B132B] flex flex-col items-center justify-center p-4 text-slate-100">
        <div className="max-w-md w-full bg-[#0B132B] border border-[#C5A059]/20 rounded-2xl p-8 flex flex-col items-center shadow-2xl">
          <AbarisLogo className="w-28 h-28 drop-shadow-xl" />
          <h1 className="text-xl font-serif tracking-[0.2em] text-[#C5A059] text-center mt-2 mb-8 font-semibold">
            ABARIS CONSULTORES
          </h1>
          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="Ingresa tu correo electrónico"
                className="w-full px-4 py-3 bg-[#111C44] border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-[#C5A059] transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                Contraseña
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-[#111C44] border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-[#C5A059] transition-all text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 text-[#0B132B] font-bold rounded-xl transition-all shadow-lg text-sm tracking-wide mt-2"
            >
              Ingresar al Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (mockEmail === 'jose.rojas14.jr89@gmail.com') {
    return (
      <AdminDashboard
        invoices={invoices}
        usersData={usersData}
        cobranzas={cobranzas}
        liquidaciones={liquidaciones}
        abarisGastos={abarisGastos}
        mesesEstados={mesesEstados}
        onLogout={() => setMockEmail('')}
        mockDb={mockDb}
      />
    );
  }

  return (
    <ClientDashboard
      mockEmail={mockEmail}
      invoices={invoices.filter(i => i.userEmail === mockEmail)}
      cobranzas={cobranzas.filter(c => c.userEmail === mockEmail)}
      liquidaciones={liquidaciones.filter(l => l.userEmail === mockEmail)}
      rucsDirectory={rucsDirectory}
      userData={usersData.find(u => u.email === mockEmail)}
      mesesEstados={mesesEstados}
      onLogout={() => setMockEmail('')}
      mockDb={mockDb}
    />
  );
}

function AdminDashboard({ invoices, usersData, cobranzas, liquidaciones, abarisGastos, mesesEstados, onLogout, mockDb }) {
  const [activeTab, setActiveTab] = useState('facturas');
  const clients = usersData.filter(u => u.email !== 'jose.rojas14.jr89@gmail.com');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="w-full md:w-64 text-white flex flex-col shadow-xl z-20 bg-[#0B132B]">
        <div className="p-6 text-center border-b border-slate-800">
          <AbarisLogo className="mx-auto mb-2 w-14 h-14" />
          <h2 className="font-serif font-bold text-lg tracking-widest text-[#C5A059]">ABARIS</h2>
          <span className="text-[10px] text-slate-400 tracking-widest uppercase">Back-Office Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('facturas')} className={`w-full flex items-center p-3 rounded-lg text-sm ${activeTab === 'facturas' ? 'bg-[#111C44] text-[#C5A059] font-bold' : 'text-slate-300 hover:bg-slate-800/50'}`}>
            <Receipt size={18} className="mr-3" /> Facturas y SET
          </button>
          <button onClick={() => setActiveTab('vencimientos')} className={`w-full flex items-center p-3 rounded-lg text-sm ${activeTab === 'vencimientos' ? 'bg-[#111C44] text-[#C5A059] font-bold' : 'text-slate-300 hover:bg-slate-800/50'}`}>
            <CalendarDays size={18} className="mr-3" /> Vencimientos
          </button>
          <button onClick={() => setActiveTab('clientes')} className={`w-full flex items-center p-3 rounded-lg text-sm ${activeTab === 'clientes' ? 'bg-[#111C44] text-[#C5A059] font-bold' : 'text-slate-300 hover:bg-slate-800/50'}`}>
            <Users size={18} className="mr-3" /> Directorio
          </button>
          <button onClick={() => setActiveTab('cobranzas')} className={`w-full flex items-center p-3 rounded-lg text-sm ${activeTab === 'cobranzas' ? 'bg-[#111C44] text-[#C5A059] font-bold' : 'text-slate-300 hover:bg-slate-800/50'}`}>
            <Wallet size={18} className="mr-3" /> Cobranzas
          </button>
          <button onClick={() => setActiveTab('liquidaciones')} className={`w-full flex items-center p-3 rounded-lg text-sm ${activeTab === 'liquidaciones' ? 'bg-[#111C44] text-[#C5A059] font-bold' : 'text-slate-300 hover:bg-slate-800/50'}`}>
            <FileCheck size={18} className="mr-3" /> Liquidaciones
          </button>
          <button onClick={() => setActiveTab('finanzas')} className={`w-full flex items-center p-3 rounded-lg text-sm ${activeTab === 'finanzas' ? 'bg-[#111C44] text-[#C5A059] font-bold' : 'text-slate-300 hover:bg-slate-800/50'}`}>
            <TrendingUp size={18} className="mr-3" /> Mi Estudio
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center justify-center p-3 bg-red-900/40 text-red-300 rounded-lg text-sm font-medium hover:bg-red-900/60 transition-colors">
            <LogOut size={18} className="mr-2" /> Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'facturas' && <AdminFacturas invoices={invoices} clients={clients} mockDb={mockDb} mesesEstados={mesesEstados} />}
        {activeTab === 'clientes' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="text-xl font-bold flex items-center text-slate-800"><Users className="mr-2 text-[#6B4B9A]" /> Directorio de Clientes</h3>
            <div className="grid gap-4">
              {clients.map(client => <ClientEditCard key={client.id} client={client} mockDb={mockDb} />)}
            </div>
          </div>
        )}
        {activeTab === 'cobranzas' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h3 className="text-xl font-bold flex items-center text-slate-800"><Wallet className="mr-2 text-[#6B4B9A]" /> Control de Cobranzas</h3>
            <AdminCobranzaForm clients={clients} mockDb={mockDb} />
            <AdminCobranzaList cobranzas={cobranzas} mockDb={mockDb} />
          </div>
        )}
        {activeTab === 'liquidaciones' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h3 className="text-xl font-bold flex items-center text-slate-800"><FileCheck className="mr-2 text-[#6B4B9A]" /> Liquidaciones y Declaraciones</h3>
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
        cdc: '0123456789'
      });
      mockDb.setMesEstado(importClient, importPeriod, 'Pendiente');
      setIsImporting(false);
      alert('¡Excel procesado! Las facturas se agregaron al balance del cliente.');
    }, 1200);
  };

  const handleExportMarangatu = (e) => {
    e.preventDefault();
    if (!exportClient || !exportPeriod) return alert('Selecciona cliente y periodo.');
    const estado = mesesEstados[`${exportClient}-${exportPeriod}`];
    if (estado !== 'Aprobado') {
      alert('No puedes exportar: El cliente aún no ha dado su Aprobación (OK) para este periodo.');
      return;
    }
    alert(`Generando archivo RUC_REG_${exportPeriod.replace('-', '')}_V0001.csv para la SET.`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#6B4B9A]"></div>
        <h3 className="text-lg font-bold mb-2 flex items-center text-slate-800 pl-2">
          <Download className="mr-2 text-[#6B4B9A]" /> 1. Importar Facturas Electrónicas (Excel Marangatu)
        </h3>
        <p className="text-xs text-slate-500 mb-4 pl-2">Sube el Excel descargado de Marangatu para actualizar el balance del cliente.</p>
        <form onSubmit={handleImportMarangatu} className="pl-2 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Cliente</label>
            <select required className="w-full border border-slate-300 p-2.5 rounded-lg bg-slate-50 text-xs" value={importClient} onChange={e => setImportClient(e.target.value)}>
              <option value="">Seleccionar...</option>
              {clients.map(c => <option key={c.id} value={c.email}>{c.razonSocial || c.email}</option>)}
            </select>
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Periodo (Ej. 2026-11)</label>
            <input required type="month" className="w-full border border-slate-300 p-2 rounded-lg bg-slate-50 text-xs" value={importPeriod} onChange={e => setImportPeriod(e.target.value)} />
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Archivo Excel SET</label>
            <input required type="file" accept=".xlsx, .xls, .csv" className="w-full text-xs border border-slate-300 p-1.5 rounded-lg bg-slate-50" />
          </div>
          <button type="submit" disabled={isImporting} className="w-full md:w-auto text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center shadow bg-[#6B4B9A] hover:bg-purple-900">
            {isImporting ? 'Procesando...' : 'Importar Excel'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#C5A059]"></div>
        <h3 className="text-lg font-bold mb-2 flex items-center text-slate-800 pl-2">
          <UploadCloud className="mr-2 text-[#C5A059]" /> 2. Exportar para Presentación (Formato Oficial SET)
        </h3>
        <form onSubmit={handleExportMarangatu} className="pl-2 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Cliente</label>
            <select required className="w-full border border-slate-300 p-2.5 rounded-lg bg-slate-50 text-xs" value={exportClient} onChange={e => setExportClient(e.target.value)}>
              <option value="">Seleccionar...</option>
              {clients.map(c => <option key={c.id} value={c.email}>{c.razonSocial || c.email}</option>)}
            </select>
          </div>
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Periodo a Exportar</label>
            <input required type="month" className="w-full border border-slate-300 p-2 rounded-lg bg-slate-50 text-xs" value={exportPeriod} onChange={e => setExportPeriod(e.target.value)} />
          </div>
          <button type="submit" className="w-full md:w-auto text-white px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#0B132B] hover:bg-slate-900 shadow">
            Descargar .TXT / .CSV
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center text-slate-800"><Receipt className="mr-2 text-[#6B4B9A]" /> Registro Global de Facturas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b">
              <tr>
                <th className="p-3">Fecha</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Proveedor / RUC</th>
                <th className="p-3">Origen</th>
                <th className="p-3 text-right">Monto Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="p-3">{inv.fecha}</td>
                  <td className="p-3 text-slate-600">{inv.userEmail}</td>
                  <td className="p-3 font-bold text-slate-800">{inv.razonSocial}<br/><span className="text-[10px] font-normal text-slate-500">{inv.ruc}</span></td>
                  <td className="p-3">
                    {inv.cdc ? (
                      <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold">Excel SET</span>
                    ) : (
                      <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">Física (Foto)</span>
                    )}
                  </td>
                  <td className="p-3 text-right font-bold">{formatCurrency(inv.monto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ClientEditCard({ client, mockDb }) {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(client);

  const handleSave = () => {
    mockDb.updateUser(client.id, data);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50">
        <div>
          <h4 className="font-bold text-slate-800 text-base">{client.razonSocial || 'Sin Nombre'}</h4>
          <p className="text-xs text-slate-500">{client.email}</p>
          <div className="flex gap-4 mt-2 text-xs text-slate-600">
            <span>RUC: {client.ruc || 'N/A'}</span>
            <span>Tel: {client.telefono || 'N/A'}</span>
            <span className="font-bold text-[#C5A059]">Honorarios: {formatCurrency(client.honorarios)}</span>
          </div>
        </div>
        <button onClick={() => setIsEditing(true)} className="mt-3 md:mt-0 text-xs border px-3 py-1.5 rounded-lg bg-white shadow-sm hover:bg-slate-100">
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
        <button onClick={handleSave} className="px-4 py-1.5 bg-[#0B132B] text-white rounded-lg font-semibold">Guardar</button>
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
        <input required type="text" placeholder="Periodo (Ej. Noviembre 2026)" className="border p-2 rounded-lg" value={form.periodo} onChange={e => setForm({...form, periodo: e.target.value})} />
        <input required type="number" placeholder="Monto Gs." className="border p-2 rounded-lg" value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} />
        <button type="submit" className="bg-[#C5A059] text-[#0B132B] font-bold p-2 rounded-lg shadow hover:brightness-105">
          Generar Deuda
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
            <th className="p-3">Periodo</th>
            <th className="p-3">Cliente</th>
            <th className="p-3 text-right">Monto</th>
            <th className="p-3 text-center">Estado</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {cobranzas.map(cob => (
            <tr key={cob.id}>
              <td className="p-3 font-bold text-slate-700">{cob.periodo}</td>
              <td className="p-3">{cob.userEmail}</td>
              <td className="p-3 text-right font-medium">{formatCurrency(cob.monto)}</td>
              <td className="p-3 text-center">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cob.estado === 'Pagado' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {cob.estado}
                </span>
              </td>
              <td className="p-3 text-center">
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
    mockDb.addLiquidacion({ ...form });
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
        <input required type="text" placeholder="Periodo (Ej. Octubre 2026)" className="border p-2 rounded-lg" value={form.periodo} onChange={e => setForm({...form, periodo: e.target.value})} />
        <button type="submit" className="bg-[#6B4B9A] text-white font-bold p-2 rounded-lg shadow">
          Subir Documento
        </button>
      </div>
    </form>
  );
}

function AdminLiquidacionList({ liquidaciones }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
      {liquidaciones.map(liq => (
        <div key={liq.id} className="border p-3 rounded-xl flex justify-between items-center bg-white shadow-sm">
          <div>
            <p className="font-bold text-slate-800">{liq.periodo}</p>
            <p className="text-[10px] text-slate-500">{liq.userEmail}</p>
          </div>
          <FileText size={18} className="text-[#6B4B9A]" />
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
      <h3 className="text-lg font-bold flex items-center text-slate-800"><CalendarDays className="mr-2 text-[#C5A059]" /> Calendario de Vencimientos</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3">Día Vencimiento</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">RUC</th>
              <th className="p-3 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {clients.map(c => {
              const v = calcularVencimiento(c.ruc);
              return (
                <tr key={c.id}>
                  <td className="p-3 font-black text-sm text-[#0B132B]">{v.dia ? `Día ${v.dia}` : 'N/A'}</td>
                  <td className="p-3 font-bold">{c.razonSocial || c.email}</td>
                  <td className="p-3 text-slate-500">{c.ruc || 'Falta cargar'}</td>
                  <td className="p-3 text-right">
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">Con Tiempo</span>
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <h3 className="text-lg font-bold flex items-center text-slate-800"><TrendingUp className="mr-2 text-[#6B4B9A]" /> Finanzas Internas del Estudio</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 rounded-xl border">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Ingresos Cobrados</p>
          <p className="text-lg font-black text-slate-800">{formatCurrency(ingresos)}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Egresos Operativos</p>
          <p className="text-lg font-black text-slate-800">{formatCurrency(egresos)}</p>
        </div>
        <div className="p-4 bg-[#0B132B] text-white rounded-xl">
          <p className="text-[10px] font-bold text-[#C5A059] uppercase">Rentabilidad Neta</p>
          <p className="text-lg font-black">{formatCurrency(ingresos - egresos)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border p-4 rounded-xl bg-slate-50 flex flex-col md:flex-row gap-3 text-xs">
        <input required type="date" className="border p-2 rounded-lg" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
        <input required type="text" placeholder="Concepto (Ej. Honorarios Asistente)" className="border p-2 rounded-lg flex-1" value={form.concepto} onChange={e => setForm({...form, concepto: e.target.value})} />
        <input required type="number" placeholder="Monto" className="border p-2 rounded-lg w-32" value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} />
        <button type="submit" className="bg-[#6B4B9A] text-white px-4 py-2 rounded-lg font-bold">Registrar Egreso</button>
      </form>
    </div>
  );
}

function ClientDashboard({ mockEmail, invoices, cobranzas, liquidaciones, rucsDirectory, userData, mesesEstados, onLogout, mockDb }) {
  const [activeTab, setActiveTab] = useState('tributaria');

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <header className="bg-[#0B132B] text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <AbarisLogo className="w-8 h-8" />
          <div>
            <h1 className="font-bold text-sm tracking-wide text-[#C5A059]">ABARIS</h1>
            <p className="text-[9px] uppercase tracking-wider text-slate-400">Portal del Cliente</p>
          </div>
        </div>
        <button onClick={onLogout} className="text-xs text-red-400 font-medium">Salir</button>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {activeTab === 'tributaria' && <ClientTributaria invoices={invoices} mockEmail={mockEmail} mesesEstados={mesesEstados} mockDb={mockDb} />}
        {activeTab === 'pagos' && <ClientPagos cobranzas={cobranzas} mockDb={mockDb} />}
        {activeTab === 'declaraciones' && <ClientDeclaraciones liquidaciones={liquidaciones} />}
        {activeTab === 'boveda' && <ClientBoveda />}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0B132B] border-t border-slate-800 flex justify-around py-3 md:hidden z-50">
        <button onClick={() => setActiveTab('tributaria')} className={`text-xs ${activeTab === 'tributaria' ? 'text-[#C5A059] font-bold' : 'text-slate-400'}`}>Gestión</button>
        <button onClick={() => setActiveTab('pagos')} className={`text-xs ${activeTab === 'pagos' ? 'text-[#C5A059] font-bold' : 'text-slate-400'}`}>Pagos</button>
        <button onClick={() => setActiveTab('declaraciones')} className={`text-xs ${activeTab === 'declaraciones' ? 'text-[#C5A059] font-bold' : 'text-slate-400'}`}>Declaraciones</button>
        <button onClick={() => setActiveTab('boveda')} className={`text-xs ${activeTab === 'boveda' ? 'text-[#C5A059] font-bold' : 'text-slate-400'}`}>Bóveda</button>
      </div>
    </div>
  );
}

function ClientTributaria({ invoices, mockEmail, mesesEstados, mockDb }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Total Ingresos</p>
          <p className="text-lg font-black text-slate-800">Gs. 0</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Total Gastos</p>
          <p className="text-lg font-black text-slate-800">Gs. 0</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm">
          <p className="text-[10px] text-purple-700 uppercase font-bold">IVA Crédito</p>
          <p className="text-lg font-black text-purple-900">Gs. 0</p>
        </div>
        <div className="bg-[#6B4B9A] text-white p-4 rounded-xl shadow-sm">
          <p className="text-[10px] uppercase text-purple-200 font-bold">Saldo a Favor</p>
          <p className="text-lg font-black">Gs. 0</p>
        </div>
      </div>
    </div>
  );
}

function ClientPagos({ cobranzas, mockDb }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
      <h3 className="font-bold text-slate-800">Datos Bancarios para Transferencia</h3>
      <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-2">
        <p><strong>Titular:</strong> Veronica Cubilla</p>
        <p><strong>Banco:</strong> Banco GNB</p>
        <p><strong>Cuenta N°:</strong> <span className="font-mono text-purple-700 font-bold">13351759001</span></p>
      </div>
    </div>
  );
}

function ClientDeclaraciones({ liquidaciones }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm text-center py-8">
      <h3 className="font-bold text-slate-800">Liquidaciones Presentadas</h3>
      <p className="text-xs text-slate-400 mt-1">Aún no hay declaraciones subidas este periodo.</p>
    </div>
  );
}

function ClientBoveda() {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
      <h3 className="font-bold text-slate-800">Archivo Fijo (Bóveda)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3 border rounded-xl flex justify-between items-center">
          <div>
            <p className="font-bold">Constancia RUC</p>
            <p className="text-[10px] text-slate-400">Documento SET</p>
          </div>
          <button className="px-3 py-1 bg-[#0B132B] text-white rounded">Descargar</button>
        </div>
      </div>
    </div>
  );
}
