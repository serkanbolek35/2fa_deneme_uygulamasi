import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

// ── Şifre Zinciri Kırılıyor ─────────────────────────────────────────────────
const INITIAL_ACCOUNTS = [
  { id:1, platformName:"Oyun Hesabı",       icon:"🎮", password:"", isCompromised:false, has2FA:false, securityLevel:100, statusMessage:"Güvende" },
  { id:2, platformName:"E-Posta Hesabı",    icon:"📧", password:"", isCompromised:false, has2FA:false, securityLevel:100, statusMessage:"Güvende" },
  { id:3, platformName:"Sosyal Medya",       icon:"📱", password:"", isCompromised:false, has2FA:false, securityLevel:100, statusMessage:"Güvende" },
  { id:4, platformName:"Okul Sistemi",       icon:"🏫", password:"", isCompromised:false, has2FA:false, securityLevel:100, statusMessage:"Güvende" },
  { id:5, platformName:"Online Alışveriş",  icon:"💳", password:"", isCompromised:false, has2FA:false, securityLevel:100, statusMessage:"Güvende" },
];

export default function SifreZinciri() {
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [phase, setPhase] = useState("setup"); // setup | attack | done
  const [botLog, setBotLog] = useState([]);
  const [leakedIdx, setLeakedIdx] = useState(null);
  const [sonuc, setSonuc] = useState(null);
  const logRef = useRef(null);

  // Aynı şifre kullanılan hesapları bul
  const findDuplicates = () => {
    const pw = {};
    accounts.forEach(a => { if (a.password) pw[a.password] = (pw[a.password]||[]).concat(a.id); });
    return Object.values(pw).filter(arr => arr.length > 1).flat();
  };
  const duplicateIds = findDuplicates();

  const sifreGuncelle = (id, val) =>
    setAccounts(prev => prev.map(a => a.id===id ? {...a, password:val} : a));
  const toggleTwoFA = (id) =>
    setAccounts(prev => prev.map(a => a.id===id ? {...a, has2FA:!a.has2FA} : a));

  // Log scroll
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [botLog]);

  const addLog = (msg, color="#94a3b8") => {
    setBotLog(prev => [...prev, { msg, color, ts: Date.now() }]);
  };

  const simulasyonuBaslat = () => {
    const idx = 0; // ilk platform sızdırılıyor
    setLeakedIdx(idx);
    setPhase("attack");
    const leaked = accounts[idx];
    const leakedPw = leaked.password || "sifre123";

    // İlk hesabı hack'le
    setAccounts(prev => prev.map((a,i) => i===idx ? {...a, isCompromised:true, statusMessage:"SİSTEM İHLALİ!"} : a));

    addLog("▶ Veri tabanı taranıyor...", "#fbbf24");
    setTimeout(() => addLog(`▶ Sızdırılmış parola bulundu: "${leakedPw}"`, "#f87171"), 1000);
    setTimeout(() => addLog("▶ Aynı parola diğer platformlarda deneniyor...", "#fbbf24"), 2000);

    accounts.forEach((acc, i) => {
      if (i === idx) return;
      const delay = 3000 + i * 2200;
      setTimeout(() => {
        addLog(`▶ ${acc.platformName} deneniyor...`, "#94a3b8");
        setTimeout(() => {
          if (acc.password === leakedPw || (!acc.password && leakedPw==="sifre123")) {
            if (acc.has2FA) {
              setAccounts(prev => prev.map(a => a.id===acc.id ? {...a, statusMessage:"🛡️ 2FA Engelledi!"} : a));
              addLog(`🛡️ ${acc.platformName} — 2FA engeline takıldım!`, "#60a5fa");
            } else {
              setAccounts(prev => prev.map(a => a.id===acc.id ? {...a, isCompromised:true, statusMessage:"💀 Ele Geçirildi!"} : a));
              addLog(`✅ ${acc.platformName} — Credential Stuffing başarılı!`, "#f87171");
            }
          } else {
            addLog(`❌ ${acc.platformName} — Erişim reddedildi.`, "#86efac");
          }
          if (i === accounts.length - 1) setTimeout(() => setPhase("done"), 800);
        }, 900);
      }, delay);
    });
  };

  useEffect(() => {
    if (phase === "done") {
      const gasp = accounts.filter(a => a.isCompromised).length - 1;
      const korunan = accounts.filter(a => !a.isCompromised && a.has2FA).length;
      setSonuc({ gasp: Math.max(0, gasp), korunan });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const sifirla = () => { setAccounts(INITIAL_ACCOUNTS); setPhase("setup"); setBotLog([]); setLeakedIdx(null); setSonuc(null); };

  const kartStyle = (acc, i) => {
    if (acc.isCompromised) return { bg:"rgba(239,68,68,0.15)", brd:"#ef4444", glow:"0 0 20px rgba(239,68,68,0.4)" };
    if (acc.statusMessage.includes("2FA")) return { bg:"rgba(59,130,246,0.15)", brd:"#60a5fa", glow:"0 0 20px rgba(96,165,250,0.4)" };
    if (acc.has2FA) return { bg:"rgba(34,197,94,0.08)", brd:"#22c55e", glow:"0 0 15px rgba(34,197,94,0.25)" };
    const isDup = duplicateIds.includes(acc.id) && phase==="setup";
    return isDup
      ? { bg:"rgba(239,68,68,0.08)", brd:"#f87171", glow:"none" }
      : { bg:"rgba(255,255,255,0.04)", brd:"rgba(255,255,255,0.1)", glow:"none" };
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", fontFamily:"'Sora',sans-serif", color:"#fff" }}>
      <Navbar />
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes hackGlow{0%,100%{box-shadow:0 0 20px rgba(239,68,68,0.4)}50%{box-shadow:0 0 40px rgba(239,68,68,0.8)}}
      `}</style>

      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"2rem" }}>
        {/* Başlık */}
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ fontSize:"3rem", marginBottom:"0.5rem" }}>⛓️</div>
          <h1 style={{ margin:0, fontSize:"2rem", fontWeight:"800", background:"linear-gradient(90deg,#ef4444,#f97316,#fbbf24)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Şifre Zinciri Kırılıyor
          </h1>
          <p style={{ color:"#94a3b8", marginTop:"0.4rem" }}>Credential Stuffing — Domino Etkisi Simülasyonu</p>
        </div>

        {/* Uyarı: aynı şifre */}
        {phase==="setup" && duplicateIds.length > 0 && (
          <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.4)", borderRadius:"12px", padding:"0.85rem 1.25rem", marginBottom:"1.5rem", textAlign:"center", color:"#fca5a5", fontWeight:"600" }}>
            ⚠️ Aynı parola tespit edildi! Güvenlik seviyesi düşüyor.
          </div>
        )}

        {/* Sızıntı banner */}
        {phase !== "setup" && leakedIdx !== null && (
          <div style={{ background:"rgba(239,68,68,0.15)", border:"2px solid #ef4444", borderRadius:"14px", padding:"1rem 1.5rem", textAlign:"center", marginBottom:"1.5rem", animation:"hackGlow 1.5s infinite" }}>
            <div style={{ fontSize:"1.4rem", marginBottom:"0.3rem" }}>💥 SİSTEM İHLALİ!</div>
            <div style={{ color:"#fca5a5" }}>
              <strong>{accounts[leakedIdx].platformName}</strong> veri sızıntısında ele geçirildi!{" "}
              Sızdırılan şifre:{" "}
              <code style={{ background:"rgba(0,0,0,0.4)", padding:"2px 8px", borderRadius:"6px", color:"#fbbf24" }}>
                {accounts[leakedIdx].password || "sifre123"}
              </code>
            </div>
          </div>
        )}

        {/* Platform kartları */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:"1rem", marginBottom:"1.5rem" }}>
          {accounts.map((acc, i) => {
            const { bg, brd, glow } = kartStyle(acc, i);
            return (
              <div key={acc.id} style={{ background:bg, border:`2px solid ${brd}`, borderRadius:"18px", padding:"1.25rem", boxShadow:glow, transition:"all 0.4s", animation: acc.isCompromised ? "hackGlow 1.5s infinite" : "none" }}>
                <div style={{ fontSize:"2rem", marginBottom:"0.4rem" }}>{acc.icon}</div>
                <div style={{ fontWeight:"700", fontSize:"0.9rem", marginBottom:"0.75rem" }}>
                  {acc.platformName}
                  {i === leakedIdx && <span style={{ marginLeft:"6px", color:"#f87171" }}>💥</span>}
                </div>

                <input
                  disabled={phase!=="setup"}
                  placeholder="Şifre gir..."
                  value={acc.password}
                  onChange={e => sifreGuncelle(acc.id, e.target.value)}
                  style={{ width:"100%", boxSizing:"border-box", background:"rgba(0,0,0,0.3)", border:`1px solid ${duplicateIds.includes(acc.id)&&phase==="setup"?"#f87171":"rgba(255,255,255,0.15)"}`, borderRadius:"8px", padding:"0.45rem 0.7rem", color:"#fff", fontSize:"0.82rem", outline:"none", marginBottom:"0.6rem", opacity:phase!=="setup"?0.6:1, fontFamily:"monospace" }}
                />

                <button
                  disabled={phase!=="setup"}
                  onClick={() => toggleTwoFA(acc.id)}
                  style={{ width:"100%", padding:"0.38rem", borderRadius:"8px", border:"none", background:acc.has2FA?"rgba(59,130,246,0.3)":"rgba(255,255,255,0.07)", color:acc.has2FA?"#93c5fd":"#94a3b8", fontSize:"0.78rem", fontWeight:"600", cursor:phase!=="setup"?"not-allowed":"pointer", transition:"all .2s" }}
                >
                  {acc.has2FA ? "🛡️ 2FA Açık" : "🔓 2FA Kapalı"}
                </button>

                <div style={{ marginTop:"0.5rem", fontSize:"0.75rem", fontWeight:"600",
                  color: acc.isCompromised?"#f87171": acc.statusMessage.includes("2FA")?"#60a5fa":"#86efac",
                  animation: acc.statusMessage.includes("Deneniyor")?"pulse 1s infinite":"none"
                }}>
                  {acc.statusMessage}
                </div>
              </div>
            );
          })}
        </div>

        {/* Başlat */}
        {phase==="setup" && (
          <div style={{ textAlign:"center", marginBottom:"1.5rem" }}>
            <button onClick={simulasyonuBaslat} style={{ background:"linear-gradient(135deg,#ef4444,#f97316)", border:"none", borderRadius:"16px", padding:"1rem 3rem", fontSize:"1.1rem", fontWeight:"800", color:"#fff", cursor:"pointer", boxShadow:"0 8px 25px rgba(239,68,68,0.4)" }}>
              ⚡ Saldırıyı Başlat
            </button>
            <p style={{ color:"#64748b", fontSize:"0.8rem", marginTop:"0.6rem" }}>İpucu: Bazı hesaplara aynı şifreyi yaz, bazılarına farklı!</p>
          </div>
        )}

        {/* Bot konsolu */}
        {botLog.length > 0 && (
          <div ref={logRef} style={{ background:"#000", border:"1px solid #1e293b", borderRadius:"12px", padding:"1rem", fontFamily:"monospace", fontSize:"0.82rem", maxHeight:"180px", overflowY:"auto", marginBottom:"1.5rem" }}>
            <div style={{ color:"#22c55e", marginBottom:"0.5rem", fontWeight:"700" }}>▶ Bot Konsolu</div>
            {botLog.map((l, i) => <div key={i} style={{ color:l.color, marginBottom:"2px" }}>{l.msg}</div>)}
          </div>
        )}

        {/* Sonuç */}
        {phase==="done" && sonuc && (
          <div style={{ background:"linear-gradient(135deg,rgba(30,27,75,0.9),rgba(15,23,42,0.95))", border:"2px solid rgba(167,139,250,0.4)", borderRadius:"20px", padding:"2rem", textAlign:"center", animation:"fadeUp .6s ease" }}>
            <div style={{ fontSize:"2.5rem", marginBottom:"0.75rem" }}>📊</div>
            <h2 style={{ margin:"0 0 1rem", color:"#e2e8f0" }}>Saldırı Tamamlandı</h2>
            <div style={{ display:"flex", justifyContent:"center", gap:"2.5rem", marginBottom:"1.25rem" }}>
              <div><div style={{ fontSize:"2.5rem", fontWeight:"800", color:"#f87171" }}>{sonuc.gasp}</div><div style={{ color:"#94a3b8", fontSize:"0.85rem" }}>Hesap Gasp Edildi</div></div>
              <div><div style={{ fontSize:"2.5rem", fontWeight:"800", color:"#86efac" }}>{sonuc.korunan}</div><div style={{ color:"#94a3b8", fontSize:"0.85rem" }}>2FA ile Korundu</div></div>
              <div><div style={{ fontSize:"2.5rem", fontWeight:"800", color:"#fbbf24" }}>{duplicateIds.length}</div><div style={{ color:"#94a3b8", fontSize:"0.85rem" }}>Aynı Şifre</div></div>
            </div>
            <p style={{ color:"#cbd5e1", lineHeight:"1.7", marginBottom:"1.5rem", maxWidth:"500px", margin:"0 auto 1.5rem" }}>
              {sonuc.gasp > 0
                ? "Bir platformdaki veri ihlali, aynı şifre kullandığın diğer hesaplarını da tehlikeye attı. Bu Credential Stuffing saldırılarının en büyük riskidir."
                : "🎉 Tebrikler! Farklı şifreler ve 2FA sayesinde tüm hesaplarını korudun."}
              {sonuc.korunan > 0 && " 2FA, şifren doğru olsa bile saldırganın hesabına girmesini engelledi."}
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem", justifyContent:"center", marginBottom:"1.5rem" }}>
              {["Her hesap için farklı şifre kullan","2FA sistemini aktif et","Veri ihlallerini düzenli kontrol et","Güçlü şifre oluştur"].map(tip => (
                <span key={tip} style={{ background:"rgba(108,99,255,0.15)", border:"1px solid rgba(108,99,255,0.3)", borderRadius:"999px", padding:"0.35rem 0.85rem", fontSize:"0.8rem", color:"#a78bfa" }}>✅ {tip}</span>
              ))}
            </div>
            <button onClick={sifirla} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"12px", padding:"0.75rem 2rem", color:"#fff", fontSize:"0.95rem", fontWeight:"600", cursor:"pointer" }}>🔄 Tekrar Dene</button>
          </div>
        )}
      </div>
    </div>
  );
}
