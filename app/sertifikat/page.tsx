"use client";

import { useState } from "react";
import { pegawaiList, kodeAkses, sertifikat, Pegawai } from "@/lib/data";
import CertCard from "@/components/CertCard";
import PageHeader from "@/components/PageHeader";
import { Lock, LogOut, User, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";

function maskNik(nik: string) {
  return nik.slice(0, 4) + "••••••••" + nik.slice(-4);
}

export default function SertifikatPage() {
  const [pegawai, setPegawai] = useState<Pegawai | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      const found = pegawaiList.find((p) => p.nik === input.trim());
      if (found) {
        setPegawai(found);
        setInput("");
      } else if (kodeAkses.includes(input.trim())) {
        setPegawai({ nik: "GUEST", nama: "Tamu Terverifikasi", jabatan: "Akses Kode", unit: "PLN" });
        setInput("");
      } else {
        setError("NIK atau kode akses tidak valid. Periksa kembali input Anda.");
      }
      setLoading(false);
    }, 600);
  }

  if (!pegawai) {
    return (
      <div className="p-6">
        <PageHeader title="Sertifikat Tower" subtitle="Masuk dengan NIK pegawai atau kode akses untuk melihat sertifikat" />

        <div className="max-w-md mx-auto mt-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-4">
              <Lock size={22} className="text-blue-600" />
            </div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">Autentikasi Diperlukan</h2>
            <p className="text-xs text-slate-500 mb-5">Masukkan NIK pegawai atau kode akses untuk melanjutkan.</p>

            <form onSubmit={handleLogin} className="space-y-3">
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError(""); }}
                  placeholder="NIK atau Kode Akses"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm pr-10 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono"
                  autoComplete="off"
                />
                <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

              <button
                type="submit"
                disabled={loading || !input}
                className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Memverifikasi..." : "Masuk"}
              </button>
            </form>
          </div>

          {/* Hint tabel — collapsible, NIK disamarkan */}
          <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowHint((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 text-xs font-medium text-slate-500 hover:bg-slate-100 transition"
            >
              <span>Butuh bantuan? Lihat akun demo</span>
              {showHint ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {showHint && (
              <div className="px-4 pb-4 pt-3 bg-white">
                <table className="w-full text-xs mb-3">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left pb-2 text-slate-400 font-medium">NIK</th>
                      <th className="text-left pb-2 text-slate-400 font-medium">Nama</th>
                      <th className="text-left pb-2 text-slate-400 font-medium">Jabatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pegawaiList.map((p) => (
                      <tr key={p.nik}>
                        <td className="py-1.5 font-mono text-slate-500">{maskNik(p.nik)}</td>
                        <td className="py-1.5 text-slate-700">{p.nama}</td>
                        <td className="py-1.5 text-slate-500">{p.jabatan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[11px] text-slate-400">
                  Hubungi administrator untuk memperoleh NIK atau kode akses.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const valid = sertifikat.filter((s) => s.status === "valid").length;
  const expiring = sertifikat.filter((s) => s.status === "expiring").length;
  const expired = sertifikat.filter((s) => s.status === "expired").length;

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Sertifikat Tower</h1>
          <p className="text-sm text-slate-500 mt-0.5">Dokumen sertifikasi dan legalitas operasional tower</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
            <User size={14} className="text-blue-600" />
            <div>
              <p className="text-xs font-semibold text-blue-800">{pegawai.nama}</p>
              <p className="text-[10px] text-blue-600">{pegawai.jabatan} — {pegawai.unit}</p>
            </div>
          </div>
          <button
            onClick={() => setPegawai(null)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition"
          >
            <LogOut size={13} />
            Keluar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{valid}</p>
          <p className="text-xs text-green-600 mt-0.5">Valid</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{expiring}</p>
          <p className="text-xs text-amber-600 mt-0.5">Hampir Expired</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{expired}</p>
          <p className="text-xs text-red-600 mt-0.5">Expired</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sertifikat.map((s) => (
          <CertCard key={s.id} cert={s} />
        ))}
      </div>
    </div>
  );
}
