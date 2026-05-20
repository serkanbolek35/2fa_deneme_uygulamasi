import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

// ── 2FA Kalkan Laboratuvarı ─────────────────────────────────────────────────
const INITIAL_SYSTEMS = [
  { id:1, systemName:"E-Posta Hesabı",  icon:"📧", password:"", has2FA:false, isUnderAttack:false, isProtected:false, isCompromised:false, shieldEnergy:100, statusMessage:"Bekliyor" },
  { id:2, systemName:"Sosyal Medya",    icon:"📱", password:"", has2FA:false, isUnderAttack:false, isProtected:false, isCompromised:false, shieldEnergy:100, statusMessage:"Bekliyor" },
  { id:3, systemName:"Oyun Hesabı",     icon:"🎮", password:"", has2FA:false, isUnderAttack:false, isProtected:false, isCompromised:false, shieldEnergy:100, statusMessage:"Bekliyor" },
  { id:4, systemName:"Okul Sistemi",    icon:"🏫", password:"", has2FA:false, isUnderAttack:false, isProtected:false, isCompromised:false, shieldEnergy:100, statusMessage:"Bekliyor" },
  { id:5, systemName:"Banka Hesabı",    icon:"💳", password:"", has2FA:false, isUnderAttack:false, isProtected:false, isCompromised:false, shieldEnergy:100, statusMessage:"Bekliyor" },
];

export default function KalkanLab() {
  const [systems, setSystems] = useState(INITIAL_SYSTEMS);
  const [phase, setPhase] = useState("setup");
  const [botLog, setBotLog] = useState([]);
  const [skor, setSkor] = useState({ korunan:0, elden:0, aktif2FA:0 });
  const [sonuc, setSonuc] = useState(null);
  const logRef = useRef(null);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [botLog]);

  const sifreGuncelle = (id, v) => setSystems(p => p.map(s => s.id===id ? {...s, password:v} : s));
  const toggle2FA = (id) => {
    setSystems(p => p.map(s => s.id===id ? {...s, has2FA:!s.has2FA} : s));
  };

  const addLog = (msg, color="#94a3b8") => setBotLog(p => [...p, { msg, color }]);

  const saldiryiBaslat = () => {
    setPhase("attack");
    addLog("▶ Veri sızıntısı listesi yükleniyor...", "#fbbf24");

    systems.forEach((sys, i) => {
      const d = 1500 + i * 2500;
      setTimeout(() => {
        setSystems(p => p.map(s => s.id===sys.id ? {...s, isUnderAttack:true, statusMessage:"⚡ Saldırı Altında!"} : s));
        addLog(`▶ ${sys.systemName} — şifre eşleşmesi bulundu, giriş deneniyor...`, "#fbbf24");

        setTimeout(() => {
          if (sys.has2FA) {
            setSystems(p => p.map(s => s.id===sys.id ? {...s, isUnderAttack:false, isProtected:true, statusMessage:"🛡️ 2FA Kalkanı Engelledi!"} : s));
            addLog(`🛡️ ${sys.systemName} — 2FA kontrolü başarısız! Güvenlik kalkanı saldırıyı engelledi!`, "#60a5fa");
            setSkor(p => ({...p, korunan:p.korunan+1}));
          } else {
            setSystems(p => p.map(s => s.id===sys.id ? {...s, isUnderAttack:false, isCompromised:true, statusMessage:"💀 Ele Geçirildi!"} : s));
            addLog(`✅ ${sys.systemName} — Hesap ele geçirildi!`, "#f87171");
            setSkor(p => ({...p, elden:p.elden+1}));
          }
          if (i === systems.length-1) setTimeout(() => setPhase("done"), 800);
        }, 1200);
      }, d);
    });
  };

  useEffect(() => {
    if (phase==="done") {
      const aktif2FA = systems.filter(s => s.has2FA).length;
      setSonuc({ korunan:skor.korunan, elden:skor.elden, aktif2FA });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const sifirla = () => { setSystems(INITIAL_SYSTEMS); setPhase("setup"); setBotLog([]); setSkor({korunan:0,elden:0,aktif2FA:0}); setSonuc(null); };

  const aktif2FACount = systems.filter(s => s.has2FA).length;
  const basari = systems.length > 0 ? Math.round((skor.korunan / systems.length) * 100) : 0;

  const kartStyle = (sys) => {
    if (sys.isCompromised) return { bg:"rgba(239,68,68,0.15)", brd:"#ef4444", glow:"0 0 20px rgba(239,68,68,0.5)" };
    if (sys.isProtected)   return { bg:"rgba(59,130,246,0.15)",  brd:"#60a5fa", glow:"0 0 25px rgba(96,165,250,0.5)" };
    if (sys.isUnderAttack) return { bg:"rgba(251,191,36,0.12)",  brd:"#fbbf24", glow:"0 0 20px rgba(251,191,36,0.4)" };
    if (sys.has2FA)        return { bg:"rgba(59,130,246,0.08)",  brd:"rgba(96,165,250,0.5)", glow:"0 0 15px rgba(96,165,250,0.25)" };
    return { bg:"rgba(255,255,255,0.04)", brd:"rgba(255,255,255,0.1)", glow:"none" };
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", fontFamily:"'Sora',sans-serif", color:"#fff" }}>
      <Navbar />
      <style>{`
        @keyframes shieldPulse{0%,100%{box-shadow:0 0 15px rgba(96,165,250,0.4)}50%{box-shadow:0 0 35px rgba(96,165,250,0.8)}}
        @keyframes attackPulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"2rem" }}>
        {/* Başlık */}
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ fontSize:"3rem", marginBottom:"0.5rem" }}>🛡️</div>
          <h1 style={{ margin:0, fontSize:"2rem", fontWeight:"800", background:"linear-gradient(90deg,#60a5fa,#818cf8,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            2FA Kalkan Laboratuvarı
          </h1>
          <p style={{ color:"#94a3b8", marginTop:"0.4rem" }}>2FA'yı aç ve saldırganı durdur!</p>
        </div>

        {/* Canlı skor */}
        <div style={{ display:"flex", gap:"1rem", marginBottom:"1.5rem", flexWrap:"wrap", justifyContent:"center" }}>
          {[
            { label:"Korunan", val:skor.korunan, color:"#86efac" },
            { label:"Ele Geçirilen", val:skor.elden, color:"#f87171" },
            { label:"Aktif 2FA", val:aktif2FACount, color:"#60a5fa" },
            { label:"Başarı %", val:phase==="done"?`${basari}%`:"-", color:"#fbbf24" },
          ].map(s => (
            <div key={s.label} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", padding:"0.6rem 1.25rem", textAlign:"center" }}>
              <div style={{ color:s.color, fontSize:"1.4rem", fontWeight:"800" }}>{s.val}</div>
              <div style={{ color:"#64748b", fontSize:"0.75rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Platform kartları */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:"1rem", marginBottom:"1.5rem" }}>
          {systems.map(sys => {
            const { bg, brd, glow } = kartStyle(sys);
            return (
              <div key={sys.id} style={{ background:bg, border:`2px solid ${brd}`, borderRadius:"18px", padding:"1.25rem", boxShadow:glow, transition:"all .4s",
                animation: sys.isProtected?"shieldPulse 2s infinite": sys.isUnderAttack?"attackPulse 0.6s infinite":"none" }}>
                <div style={{ fontSize:"2rem", marginBottom:"0.4rem" }}>{sys.icon}</div>
                {sys.has2FA && phase==="setup" && (
                  <div style={{ fontSize:"0.7rem", color:"#60a5fa", fontWeight:"700", marginBottom:"0.3rem" }}>⚡ KALKAN AKTİF</div>
                )}
                <div style={{ fontWeight:"700", fontSize:"0.9rem", marginBottom:"0.75rem" }}>{sys.systemName}</div>
                <input disabled={phase!=="setup"} placeholder="Şifre..." value={sys.password} onChange={e => sifreGuncelle(sys.id, e.target.value)}
                  style={{ width:"100%", boxSizing:"border-box", background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", padding:"0.4rem 0.65rem", color:"#fff", fontSize:"0.82rem", outline:"none", marginBottom:"0.6rem", opacity:phase!=="setup"?0.6:1, fontFamily:"monospace" }} />
                <button disabled={phase!=="setup"} onClick={() => toggle2FA(sys.id)}
                  style={{ width:"100%", padding:"0.4rem", borderRadius:"8px", border:"none", background:sys.has2FA?"rgba(59,130,246,0.35)":"rgba(255,255,255,0.07)", color:sys.has2FA?"#93c5fd":"#94a3b8", fontSize:"0.78rem", fontWeight:"700", cursor:phase!=="setup"?"not-allowed":"pointer", transition:"all .2s", boxShadow:sys.has2FA?"0 0 10px rgba(96,165,250,0.3)":"none" }}>
                  {sys.has2FA?"🛡️ 2FA AÇIK":"🔓 2FA Kapalı"}
                </button>
                <div style={{ marginTop:"0.5rem", fontSize:"0.75rem", fontWeight:"600",
                  color:sys.isCompromised?"#f87171":sys.isProtected?"#60a5fa":sys.isUnderAttack?"#fbbf24":"#64748b" }}>
                  {sys.statusMessage}
                </div>
              </div>
            );
          })}
        </div>

        {/* Başlat */}
        {phase==="setup" && (
          <div style={{ textAlign:"center", marginBottom:"1.5rem" }}>
            <button onClick={saldiryiBaslat} style={{ background:"linear-gradient(135deg,#7c3aed,#4f46e5)", border:"none", borderRadius:"16px", padding:"1rem 3rem", fontSize:"1.1rem", fontWeight:"800", color:"#fff", cursor:"pointer", boxShadow:"0 8px 25px rgba(124,58,237,0.4)" }}>
              🚀 Siber Saldırıyı Başlat
            </button>
            <p style={{ color:"#64748b", fontSize:"0.8rem", marginTop:"0.6rem" }}>Bazı hesaplarda 2FA'yı aç, bazılarını korumasız bırak!</p>
          </div>
        )}

        {/* Bot konsolu */}
        {botLog.length > 0 && (
          <div ref={logRef} style={{ background:"#000", border:"1px solid #1e293b", borderRadius:"12px", padding:"1rem", fontFamily:"monospace", fontSize:"0.82rem", maxHeight:"170px", overflowY:"auto", marginBottom:"1.5rem" }}>
            <div style={{ color:"#a78bfa", marginBottom:"0.5rem", fontWeight:"700" }}>▶ Siber Saldırı Konsolu</div>
            {botLog.map((l,i) => <div key={i} style={{ color:l.color, marginBottom:"2px" }}>{l.msg}</div>)}
          </div>
        )}

        {/* Sonuç */}
        {phase==="done" && sonuc && (
          <div style={{ background:"linear-gradient(135deg,rgba(30,27,75,0.9),rgba(15,23,42,0.95))", border:"2px solid rgba(96,165,250,0.4)", borderRadius:"20px", padding:"2rem", textAlign:"center", animation:"fadeUp .6s ease" }}>
            <div style={{ fontSize:"2.5rem", marginBottom:"0.75rem" }}>{sonuc.korunan >= sonuc.elden ? "🏆" : "😰"}</div>
            <h2 style={{ margin:"0 0 0.75rem", color:"#e2e8f0" }}>Saldırı Sonucu</h2>
            <div style={{ display:"flex", justifyContent:"center", gap:"2.5rem", marginBottom:"1.25rem" }}>
              <div><div style={{ fontSize:"2.2rem", fontWeight:"800", color:"#86efac" }}>{sonuc.korunan}</div><div style={{ color:"#94a3b8", fontSize:"0.8rem" }}>2FA ile Korunan</div></div>
              <div><div style={{ fontSize:"2.2rem", fontWeight:"800", color:"#f87171" }}>{sonuc.elden}</div><div style={{ color:"#94a3b8", fontSize:"0.8rem" }}>Ele Geçirilen</div></div>
              <div><div style={{ fontSize:"2.2rem", fontWeight:"800", color:"#60a5fa" }}>{sonuc.aktif2FA}</div><div style={{ color:"#94a3b8", fontSize:"0.8rem" }}>Aktif 2FA</div></div>
            </div>
            <p style={{ color:"#cbd5e1", lineHeight:"1.7", marginBottom:"1.5rem", maxWidth:"520px", margin:"0 auto 1.5rem" }}>
              {sonuc.elden === 0
                ? "Tebrikler! 2FA güvenlik kalkanını doğru kullanarak hesaplarını büyük ölçüde korudun."
                : sonuc.korunan > sonuc.elden
                ? "İyi iş! Parola doğru olsa bile 2FA sistemi saldırganın erişimini engelledi."
                : "Birçok hesabın yalnızca parola korumasına sahip olduğu için saldırıya karşı savunmasız kaldı."}
            </p>
            <button onClick={sifirla} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"12px", padding:"0.75rem 2rem", color:"#fff", fontSize:"0.95rem", fontWeight:"600", cursor:"pointer" }}>🔄 Tekrar Dene</button>
          </div>
        )}
      </div>
    </div>
  );
}
