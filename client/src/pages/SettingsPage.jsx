import React, { useState } from 'react';
import { Settings, Database, Server, Shield, Check, RefreshCw, Cpu } from 'lucide-react';
import api from '../services/api';

const SettingsPage = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);

  const testBackendConnection = async () => {
    try {
      setTestingConnection(true);
      const res = await api.get('/health');
      setHealthStatus(res.data);
    } catch (err) {
      setHealthStatus({ status: 'error', message: err.message });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System & Store Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure dashboard preferences, monitor database health, and view environment details
        </p>
      </div>

      {/* Store Identity Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <Settings className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Store Profile</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-500 font-medium block mb-1">Store Name</label>
            <input
              type="text"
              readOnly
              value="Apex Retailers (Shopify Live)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="text-slate-500 font-medium block mb-1">Store Currency</label>
            <input
              type="text"
              readOnly
              value="USD ($) - United States Dollar"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="text-slate-500 font-medium block mb-1">Analytics Reporting Timezone</label>
            <input
              type="text"
              readOnly
              value="UTC / Local Device Timezone"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="text-slate-500 font-medium block mb-1">Default Date Window</label>
            <input
              type="text"
              readOnly
              value="Last 30 Days (Trailing)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Backend & Database Health Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Backend & Database Health</h2>
          </div>

          <button
            onClick={testBackendConnection}
            disabled={testingConnection}
            className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${testingConnection ? 'animate-spin' : ''}`} />
            <span>Ping API</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-700">API Gateway Endpoint</span>
            </div>
            <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              http://localhost:5000/api
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-700">Database Engine</span>
            </div>
            <span className="inline-flex items-center text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              MongoDB Atlas (Cluster0)
            </span>
          </div>

          {healthStatus && (
            <div className={`p-3 rounded-xl text-xs font-mono ${healthStatus.status === 'ok' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
              <pre>{JSON.stringify(healthStatus, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>

      {/* Tech Architecture Information */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <Cpu className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Application Architecture</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Frontend</p>
            <p className="text-xs font-bold text-slate-800 mt-1">React 19 + Vite</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase">State Mgmt</p>
            <p className="text-xs font-bold text-slate-800 mt-1">Redux Toolkit</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Styling</p>
            <p className="text-xs font-bold text-slate-800 mt-1">Tailwind CSS v4</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Backend</p>
            <p className="text-xs font-bold text-slate-800 mt-1">Express + Mongoose</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
