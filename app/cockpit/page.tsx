"use client";

import { useState, useEffect, useCallback } from "react";

interface Lead {
  id: string;
  stelle: string;
  name: string;
  email: string;
  phone: string;
  data: Record<string, string>;
  score: number;
  scoreLabel: string;
  source: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt?: string;
}

const STATUS_OPTIONS = [
  { value: "neu", label: "Neu", color: "#0a7be0", bg: "rgba(10,123,224,.1)" },
  { value: "kontaktiert", label: "Kontaktiert", color: "#c8a44e", bg: "rgba(200,164,78,.12)" },
  { value: "interview", label: "Interview", color: "#8B1A1A", bg: "rgba(139,26,26,.1)" },
  { value: "angebot", label: "Angebot", color: "#16a34a", bg: "rgba(22,163,74,.1)" },
  { value: "eingestellt", label: "Eingestellt", color: "#16a34a", bg: "rgba(22,163,74,.15)" },
  { value: "abgelehnt", label: "Abgelehnt", color: "#64748b", bg: "rgba(100,116,139,.1)" },
];

function ScoreBadge({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? "#16a34a" : score >= 45 ? "#0a7be0" : "#d97706";
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold" style={{ color, background: `${color}15` }}>
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {score} — {label}
    </span>
  );
}

export default function Cockpit() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filter, setFilter] = useState("alle");

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function updateLead(id: string, updates: { status?: string; notes?: string }) {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const updated = await res.json();
      setLeads(ls => ls.map(l => l.id === id ? updated : l));
      if (selected?.id === id) setSelected(updated);
    } catch { /* ignore */ }
  }

  const filtered = filter === "alle" ? leads : leads.filter(l => l.status === filter);
  const counts = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="min-h-screen" style={{ background: "#f4f8fc", fontFamily: "'Inter', system-ui, sans-serif", color: "#1a1a2e" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ background: "rgba(255,255,255,.92)", backdropFilter: "blur(12px)", borderColor: "#e4ebf3" }}>
        <div className="max-w-[1400px] mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl grid place-items-center font-bold text-base" style={{ background: "#8B1A1A", color: "#fff" }}>B</span>
            <div>
              <span className="font-semibold text-[15px]" style={{ color: "#8B1A1A" }}>Bewerbungs-Cockpit</span>
              <span className="block text-[11px]" style={{ color: "#5b6b7c" }}>Teamleiter Operativer Einkauf</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium px-3 py-1.5 rounded-full" style={{ background: "rgba(139,26,26,.08)", color: "#8B1A1A" }}>
              {leads.length} Bewerbungen
            </span>
            <a href="/" className="text-[13px] font-semibold px-3 py-1.5 rounded-full no-underline" style={{ background: "#8B1A1A", color: "#fff" }}>Zur Stelle</a>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-5 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          <button onClick={() => setFilter("alle")} className="bg-white rounded-2xl p-4 cursor-pointer text-left transition-all" style={{ border: `2px solid ${filter === "alle" ? "#8B1A1A" : "#e4ebf3"}`, boxShadow: "0 4px 12px -4px rgba(0,0,0,.08)" }}>
            <div className="text-[28px] font-bold">{leads.length}</div>
            <div className="text-[13px] font-medium" style={{ color: "#5b6b7c" }}>Gesamt</div>
          </button>
          {STATUS_OPTIONS.map(s => (
            <button key={s.value} onClick={() => setFilter(s.value)} className="bg-white rounded-2xl p-4 cursor-pointer text-left transition-all" style={{ border: `2px solid ${filter === s.value ? s.color : "#e4ebf3"}`, boxShadow: "0 4px 12px -4px rgba(0,0,0,.08)" }}>
              <div className="text-[28px] font-bold" style={{ color: s.color }}>{counts[s.value] || 0}</div>
              <div className="text-[13px] font-medium" style={{ color: "#5b6b7c" }}>{s.label}</div>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-[17px]" style={{ color: "#5b6b7c" }}>Lade Bewerbungen...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-[48px] mb-4">📭</div>
            <div className="text-[17px] font-semibold mb-2">Noch keine Bewerbungen</div>
            <p className="text-[15px]" style={{ color: "#5b6b7c" }}>Sobald sich jemand bewirbt, erscheinen die Bewerbungen hier.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
            {/* List */}
            <div className="space-y-3">
              {filtered.map(lead => (
                <button key={lead.id} onClick={() => setSelected(lead)}
                  className="w-full text-left bg-white rounded-2xl p-5 cursor-pointer transition-all"
                  style={{ border: `2px solid ${selected?.id === lead.id ? "#8B1A1A" : "#e4ebf3"}`, boxShadow: "0 4px 12px -4px rgba(0,0,0,.08)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-[16px] mb-1">{lead.name}</div>
                      <div className="text-[13px] mb-2" style={{ color: "#5b6b7c" }}>{lead.email} · {lead.phone}</div>
                      <div className="flex flex-wrap gap-2">
                        <ScoreBadge score={lead.score} label={lead.scoreLabel} />
                        {lead.data?.Erfahrung && <span className="text-[12px] px-2 py-0.5 rounded-full" style={{ background: "#f0f4f8", color: "#5b6b7c" }}>{lead.data.Erfahrung}</span>}
                        {lead.data?.["Führungserfahrung"] && <span className="text-[12px] px-2 py-0.5 rounded-full" style={{ background: "#f0f4f8", color: "#5b6b7c" }}>{lead.data["Führungserfahrung"]}</span>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block text-[12px] font-semibold px-2.5 py-1 rounded-full" style={{ color: STATUS_OPTIONS.find(s => s.value === lead.status)?.color || "#5b6b7c", background: STATUS_OPTIONS.find(s => s.value === lead.status)?.bg || "#f0f4f8" }}>
                        {STATUS_OPTIONS.find(s => s.value === lead.status)?.label || lead.status}
                      </span>
                      <div className="text-[12px] mt-1.5" style={{ color: "#5b6b7c" }}>
                        {new Date(lead.createdAt).toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail Panel */}
            {selected && (
              <div className="bg-white rounded-2xl p-6 h-fit sticky top-24" style={{ border: "1px solid #e4ebf3", boxShadow: "0 8px 24px -12px rgba(0,0,0,.12)" }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-[20px]">{selected.name}</h2>
                    <p className="text-[13px]" style={{ color: "#5b6b7c" }}>{selected.email}</p>
                    <p className="text-[13px]" style={{ color: "#5b6b7c" }}>{selected.phone}</p>
                  </div>
                  <ScoreBadge score={selected.score} label={selected.scoreLabel} />
                </div>

                {/* Status */}
                <div className="mb-5">
                  <label className="block text-[12px] font-bold tracking-[.06em] uppercase mb-2" style={{ color: "#5b6b7c" }}>Status</label>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map(s => (
                      <button key={s.value} onClick={() => updateLead(selected.id, { status: s.value })}
                        className="text-[13px] font-semibold px-3 py-1.5 rounded-full cursor-pointer border-none transition-all"
                        style={{ background: selected.status === s.value ? s.color : s.bg, color: selected.status === s.value ? "#fff" : s.color }}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="mb-5">
                  <label className="block text-[12px] font-bold tracking-[.06em] uppercase mb-2" style={{ color: "#5b6b7c" }}>Angaben</label>
                  <div className="rounded-xl p-3" style={{ background: "#f4f8fc", border: "1px solid #e4ebf3" }}>
                    {Object.entries(selected.data || {}).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 py-1.5 text-[14px]" style={{ borderTop: "1px solid #e4ebf3" }}>
                        <span style={{ color: "#5b6b7c" }}>{k}</span>
                        <span className="font-medium text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notizen */}
                <div>
                  <label className="block text-[12px] font-bold tracking-[.06em] uppercase mb-2" style={{ color: "#5b6b7c" }}>Notizen</label>
                  <textarea
                    value={selected.notes || ""}
                    onChange={e => setSelected({ ...selected, notes: e.target.value })}
                    onBlur={() => updateLead(selected.id, { notes: selected.notes })}
                    rows={4} placeholder="Notizen zur Bewerbung..."
                    className="w-full rounded-xl px-3.5 py-3 text-[14px] outline-none resize-none transition-all" style={{ border: "2px solid #e4ebf3", background: "#fff" }}
                  />
                </div>

                <div className="text-[12px] mt-4" style={{ color: "#5b6b7c" }}>
                  Eingegangen: {new Date(selected.createdAt).toLocaleString("de-CH")}
                  {selected.updatedAt && <> · Aktualisiert: {new Date(selected.updatedAt).toLocaleString("de-CH")}</>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
