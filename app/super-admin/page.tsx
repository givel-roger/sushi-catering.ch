"use client";

import { useState, useEffect } from "react";

type Tenant = {
  id: string;
  slug: string;
  name: string;
  codePrefix: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  addressStreet: string | null;
  addressCity: string | null;
  addressZip: string | null;
  active: boolean;
  platformFeePercent: number;
  admins: { id: string; email: string; name: string; role: string }[];
  gutscheinCount: number;
  createdAt: string;
};

type Stats = {
  tenantCount: number;
  gutscheinCount: number;
  paidGutscheine: number;
  totalRevenue: number;
  redeemedTotal: number;
};

export default function SuperAdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showNewTenant, setShowNewTenant] = useState(false);
  const [newTenant, setNewTenant] = useState({
    slug: "", name: "", codePrefix: "", website: "", phone: "", email: "",
    addressStreet: "", addressCity: "", addressZip: "",
    adminEmail: "", adminPassword: "", adminName: "",
    primaryColor: "#c8962e",
  });
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => { checkAuth(); }, []);

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user?.role === "superadmin") {
          setLoggedIn(true);
          loadData();
        }
      }
    } catch {}
    setChecking(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      if (!res.ok) {
        setLoginError("Login fehlgeschlagen.");
        return;
      }
      const me = await fetch("/api/auth/me").then((r) => r.json());
      if (me.user?.role !== "superadmin") {
        setLoginError("Kein Super-Admin-Zugang.");
        return;
      }
      setLoggedIn(true);
      loadData();
    } catch {
      setLoginError("Verbindungsfehler.");
    }
  }

  async function loadData() {
    const [t, s] = await Promise.all([
      fetch("/api/super-admin/tenants").then((r) => r.json()),
      fetch("/api/super-admin/stats").then((r) => r.json()),
    ]);
    setTenants(t);
    setStats(s);
  }

  async function handleCreateTenant(e: React.FormEvent) {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      const res = await fetch("/api/super-admin/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTenant,
          branding: { primaryColor: newTenant.primaryColor, primaryHoverColor: newTenant.primaryColor },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Fehler beim Erstellen.");
        setCreating(false);
        return;
      }
      setShowNewTenant(false);
      setNewTenant({ slug: "", name: "", codePrefix: "", website: "", phone: "", email: "", addressStreet: "", addressCity: "", addressZip: "", adminEmail: "", adminPassword: "", adminName: "", primaryColor: "#c8962e" });
      loadData();
    } catch {
      setCreateError("Verbindungsfehler.");
    }
    setCreating(false);
  }

  async function toggleTenant(tenantId: string, active: boolean) {
    await fetch(`/api/super-admin/tenants/${tenantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    loadData();
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full" />
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Super-Admin</h1>
          <p className="text-sm text-gray-500 text-center mb-8">gutschein-schenken.ch</p>
          {loginError && <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm mb-4">{loginError}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="E-Mail" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            <input type="password" placeholder="Passwort" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg py-3 font-medium transition-colors">
              Anmelden
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Super-Admin</h1>
            <p className="text-sm text-gray-500">gutschein-schenken.ch</p>
          </div>
          <button onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); setLoggedIn(false); }}
            className="text-sm text-gray-500 hover:text-gray-700">
            Abmelden
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Tenants" value={stats.tenantCount} />
            <StatCard label="Gutscheine" value={stats.gutscheinCount} />
            <StatCard label="Umsatz (CHF)" value={stats.totalRevenue.toFixed(0)} />
            <StatCard label="Eingelöst (CHF)" value={stats.redeemedTotal.toFixed(0)} />
          </div>
        )}

        {/* Tenants */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tenants</h2>
            <button onClick={() => setShowNewTenant(!showNewTenant)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
              {showNewTenant ? "Abbrechen" : "+ Neuer Tenant"}
            </button>
          </div>

          {/* New Tenant Form */}
          {showNewTenant && (
            <form onSubmit={handleCreateTenant} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
              <h3 className="font-medium text-gray-900">Neuen Tenant anlegen</h3>
              {createError && <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm">{createError}</div>}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Slug *" value={newTenant.slug} onChange={(v) => setNewTenant({ ...newTenant, slug: v })} placeholder="krone-blatten" />
                <Field label="Name *" value={newTenant.name} onChange={(v) => setNewTenant({ ...newTenant, name: v })} placeholder="Restaurant Krone" />
                <Field label="Code-Prefix *" value={newTenant.codePrefix} onChange={(v) => setNewTenant({ ...newTenant, codePrefix: v.toUpperCase() })} placeholder="KR" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Website" value={newTenant.website} onChange={(v) => setNewTenant({ ...newTenant, website: v })} placeholder="https://krone-blatten.ch" />
                <Field label="Telefon" value={newTenant.phone} onChange={(v) => setNewTenant({ ...newTenant, phone: v })} placeholder="+41 27 ..." />
                <Field label="E-Mail" value={newTenant.email} onChange={(v) => setNewTenant({ ...newTenant, email: v })} placeholder="info@krone-blatten.ch" type="email" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Strasse" value={newTenant.addressStreet} onChange={(v) => setNewTenant({ ...newTenant, addressStreet: v })} />
                <Field label="Ort" value={newTenant.addressCity} onChange={(v) => setNewTenant({ ...newTenant, addressCity: v })} />
                <Field label="PLZ" value={newTenant.addressZip} onChange={(v) => setNewTenant({ ...newTenant, addressZip: v })} />
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Admin-Benutzer (optional)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Admin-Name" value={newTenant.adminName} onChange={(v) => setNewTenant({ ...newTenant, adminName: v })} />
                  <Field label="Admin-E-Mail" value={newTenant.adminEmail} onChange={(v) => setNewTenant({ ...newTenant, adminEmail: v })} type="email" />
                  <Field label="Admin-Passwort" value={newTenant.adminPassword} onChange={(v) => setNewTenant({ ...newTenant, adminPassword: v })} type="password" />
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Primärfarbe</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={newTenant.primaryColor}
                    onChange={(e) => setNewTenant({ ...newTenant, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
                  <span className="text-sm text-gray-600 font-mono">{newTenant.primaryColor}</span>
                </div>
              </div>

              <button type="submit" disabled={creating}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg text-sm transition-colors">
                {creating ? "Wird erstellt..." : "Tenant erstellen"}
              </button>
            </form>
          )}

          {/* Tenant List */}
          <div className="space-y-3">
            {tenants.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{t.name}</h3>
                      <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{t.slug}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${t.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {t.active ? "Aktiv" : "Inaktiv"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 space-y-0.5">
                      <p>Prefix: <span className="font-mono">{t.codePrefix}</span> · Gutscheine: {t.gutscheinCount} · Provision: {t.platformFeePercent}%</p>
                      {t.website && <p>{t.website}</p>}
                      {t.admins.length > 0 && (
                        <p>Admins: {t.admins.map((a) => a.email).join(", ")}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <a href={`/r/${t.slug}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded transition-colors">
                      Shop
                    </a>
                    <a href={`/admin/${t.slug}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded transition-colors">
                      Admin
                    </a>
                    <button onClick={() => toggleTenant(t.id, t.active)}
                      className={`text-xs px-3 py-1.5 rounded transition-colors ${t.active ? "bg-red-50 hover:bg-red-100 text-red-700" : "bg-green-50 hover:bg-green-100 text-green-700"}`}>
                      {t.active ? "Deaktivieren" : "Aktivieren"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">{label}</label>
      <input type={type || "text"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}
