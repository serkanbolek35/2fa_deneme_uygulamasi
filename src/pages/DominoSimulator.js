import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

// Platform verisini buradan kolayca duzenleyebilirsin
const INITIAL_PLATFORMS = [
  { id:1, name:"Oyun Sunucusu", icon:"🎮", password:"", isHacked:false, has2FA:false },
  { id:2, name:"Sosyal Medya",  icon:"📱", password:"", isHacked:false, has2FA:false },
  { id:3, name:"Okul Portali",  icon:"🏫", password:"", isHacked:false, has2FA:false },
  { id:4, name:"E-Posta",       icon:"📧", password:"", isHacked:false, has2FA:false },
  { id:5, name:"Banka",         icon:"🏦", password:"", isHacked:false, has2FA:false },
];

export default function DominoSimulator() {
  const [platforms, setPlatforms]       = useState(INITIAL_PLATFORMS);
  const [asamaIndex, setAsamaIndex]     = useState(0);
  const [sizdirilan, setSizdirilan]     = useState("");
  const [botLog, setBotLog]             = useState([]);
  const [durumlar, setDurumlar]         = useState({});
  const [sonuc, setSonuc]               = useState(null);

  const sifreGuncelle = (id, val) => setPlatforms(p => p.map(x => x.id===id ? {...x,password:val} : x));
  const toggleTwoFA   = (id)     => setPlatforms(p => p.map(x => x.id===id ? {...x,has2FA:!x.has2FA} : x));

  const simulasyonuBaslat = () => {
    const ilk = platforms[0];
    const sifre = ilk.password || "sifre123";
    setSizdirilan(sifre);
    setDurumlar({ [ilk.id]:"hacked" });
    setBotLog([`[BOT] 💥 ${ilk.name} hacklendi! Sifre ele gecirildi: "${sifre}"`]);
    setAsamaIndex(1);

    platforms.slice(1).forEach((p, idx) => {
      setTimeout(() => {
        setDurumlar(prev => ({...prev,[p.id]:"checking"}));
        setBotLog(prev => [...prev, `[BOT] 🔄 "${sifre}" → ${p.name} deneniyor...`]);
        setTimeout(() => {
          let durum, log;
          if (p.password !== sifre || p.password === "") {
            durum = "safe";
            log = `[BOT] ❌ Erisim Reddedildi — ${p.name} farkli sifre kullaniyor.`;
          } else if (p.has2FA) {
            durum = "2fa";
            log = `[BOT] 🛡️ Sifre dogru FAKAT ${p.name} 2FA engelini asamamadim!`;
          } else {
            durum = "hacked";
            log = `[BOT] ✅ HESAP GASP EDILDI! ${p.name} — Credential Stuffing basarili!`;
          }
          setDurumlar(prev => ({...prev,[p.id]:durum}));
          setBotLog(prev => [...prev, log]);
          if (idx === platforms.length - 2) setTimeout(() => setAsamaIndex(2), 800);
        }, 800);
      }, (idx + 1) * 2000);
    });
  };

  useEffect(() => {
    if (asamaIndex === 2) {
      const vals = Object.values(durumlar);
      setSonuc({
        kurtarilan: vals.filter(d => d==="safe"||d==="2fa").length,
        gasp: vals.filter(d => d==="hacked").length - 1,
      });
    }
  }, [asamaIndex]);

  const sifirla = () => { setPlatforms(INITIAL_PLATFORMS); setAsamaIndex(0); setSizdirilan(""); setBotLog([]); setDurumlar({}); setSonuc(null); };

  const kartRenk = (id) => {
    const d = durumlar[id];
    if (d==="hacked") return {bg:"rgba(239,68,68,0.15)",brd:"#ef4444"};
    if (d==="safe")   return {bg:"rgba(34,197,94,0.12)",brd:"#22c55e"};
    if (d==="2fa")    return {bg:"rgba(59,130,246,0.15)",brd:"#60a5fa"};
    if (d==="checking") return {bg:"rgba(251,191,36,0.1)",brd:"#fbbf24"};
    return {bg:"rgba(255,255,255,0.04)",brd:"rgba(255,255,255,0.1)"};
  };
  const kartIkon = (id) => ({hacked:"💀",safe:"✅","2fa":"🛡️",checking:"⏳"}[durumlar[id]] || null);

  return (
    <div style={{ minHeight:"100vh",background:"#0f172a",fontFamily:"'Sora',sans-serif",color:"#fff" }}>
      <Navbar />
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <div style={{ maxWidth:"900px",margin:"0 auto",padding:"2rem" }}>

        {/* Baslik */}
        <div style={{ textAlign:"center",marginBottom:"2rem" }}>
          <div style={{ fontSize:"3rem",marginBottom:"0.5rem" }}>🎲</div>
          <h1 style={{ margin:0,fontSize:"1.9rem",fontWeight:"800",background:"linear-gradient(90deg,#f87171,#fb923c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Domino Etkisi</h1>
          <p style={{ color:"#94a3b8",marginTop:"0.4rem" }}>Credential Stuffing Simulatoru</p>
        </div>

        {/* Hack uyarisi */}
        {asamaIndex >= 1 && (
          <div style={{ background:"rgba(239,68,68,0.15)",border:"2px solid #ef4444",borderRadius:"16px",padding:"1rem 1.5rem",textAlign:"center",marginBottom:"1.5rem",animation:"fadeIn .5s ease" }}>
            <div style={{ fontSize:"1.5rem",marginBottom:"0.3rem" }}>💥 SISTEM HACKLENDİ!</div>
            <div style={{ color:"#fca5a5" }}><strong>{platforms[0].name}</strong> coktu — Sizdirilan sifre: <code style={{ background:"rgba(0,0,0,0.3)",padding:"2px 8px",borderRadius:"6px",color:"#fbbf24" }}>{sizdirilan}</code></div>
          </div>
        )}

        {/* Platform kartlari */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"1rem",marginBottom:"1.5rem" }}>
          {platforms.map((p, idx) => {
            const { bg, brd } = kartRenk(p.id);
            const ikon = kartIkon(p.id);
            return (
              <div key={p.id} style={{ background:bg,border:`2px solid ${brd}`,borderRadius:"16px",padding:"1.25rem",transition:"all .4s" }}>
                <div style={{ fontSize:"2rem",marginBottom:"0.5rem" }}>{p.icon}</div>
                <div style={{ fontWeight:"700",marginBottom:"0.75rem",fontSize:"0.95rem" }}>{p.name} {ikon}</div>
                <input disabled={asamaIndex>=1} placeholder="Sifre gir..." value={p.password} onChange={e => sifreGuncelle(p.id,e.target.value)}
                  style={{ width:"100%",boxSizing:"border-box",background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"8px",padding:"0.5rem 0.75rem",color:"#fff",fontSize:"0.85rem",outline:"none",marginBottom:"0.75rem",opacity:asamaIndex>=1?0.6:1 }} />
                {idx !== 0 && (
                  <button disabled={asamaIndex>=1} onClick={() => toggleTwoFA(p.id)}
                    style={{ width:"100%",padding:"0.4rem",borderRadius:"8px",border:"none",background:p.has2FA?"rgba(59,130,246,0.3)":"rgba(255,255,255,0.08)",color:p.has2FA?"#93c5fd":"#94a3b8",fontSize:"0.8rem",fontWeight:"600",cursor:asamaIndex>=1?"not-allowed":"pointer",transition:"all .2s" }}>
                    {p.has2FA?"🛡️ 2FA Acik":"🔓 2FA Kapali"}
                  </button>
                )}
                {durumlar[p.id]==="hacked"   && <div style={{ marginTop:"0.5rem",color:"#f87171",fontSize:"0.8rem",fontWeight:"700" }}>💀 Hesap Gasp Edildi!</div>}
                {durumlar[p.id]==="2fa"      && <div style={{ marginTop:"0.5rem",color:"#60a5fa",fontSize:"0.8rem",fontWeight:"700" }}>🛡️ 2FA Engeli!</div>}
                {durumlar[p.id]==="safe"     && <div style={{ marginTop:"0.5rem",color:"#86efac",fontSize:"0.8rem",fontWeight:"700" }}>✅ Guvende!</div>}
                {durumlar[p.id]==="checking" && <div style={{ marginTop:"0.5rem",color:"#fbbf24",fontSize:"0.8rem",animation:"pulse 1s infinite" }}>⏳ Deneniyor...</div>}
              </div>
            );
          })}
        </div>

        {/* Baslat butonu */}
        {asamaIndex===0 && (
          <div style={{ textAlign:"center" }}>
            <button onClick={simulasyonuBaslat} style={{ background:"linear-gradient(135deg,#ef4444,#f97316)",border:"none",borderRadius:"16px",padding:"1rem 3rem",fontSize:"1.1rem",fontWeight:"800",color:"#fff",cursor:"pointer",boxShadow:"0 8px 25px rgba(239,68,68,0.4)" }}>
              ⚡ Simulasyonu Baslat
            </button>
          </div>
        )}

        {/* Bot konsolu */}
        {botLog.length > 0 && (
          <div style={{ marginTop:"1.5rem",background:"#000",border:"1px solid #1e293b",borderRadius:"12px",padding:"1rem",fontFamily:"monospace",fontSize:"0.82rem",maxHeight:"180px",overflowY:"auto" }}>
            <div style={{ color:"#22c55e",marginBottom:"0.5rem",fontWeight:"700" }}>▶ Bot Konsolu</div>
            {botLog.map((log,i) => (
              <div key={i} style={{ color:log.includes("GASP")?"#f87171":log.includes("Reddedildi")?"#86efac":log.includes("2FA")?"#60a5fa":"#94a3b8",marginBottom:"2px" }}>{log}</div>
            ))}
          </div>
        )}

        {/* Sonuc */}
        {asamaIndex===2 && sonuc && (
          <div style={{ marginTop:"1.5rem",background:"linear-gradient(135deg,rgba(30,27,75,0.9),rgba(15,23,42,0.9))",border:"2px solid rgba(167,139,250,0.4)",borderRadius:"20px",padding:"2rem",textAlign:"center",animation:"fadeIn .6s ease" }}>
            <div style={{ fontSize:"3rem",marginBottom:"0.75rem" }}>📊</div>
            <h2 style={{ margin:"0 0 1rem",color:"#e2e8f0" }}>Simulasyon Tamamlandi</h2>
            <div style={{ display:"flex",justifyContent:"center",gap:"2rem",marginBottom:"1.25rem" }}>
              <div><div style={{ fontSize:"2.5rem",fontWeight:"800",color:"#86efac" }}>{sonuc.kurtarilan}</div><div style={{ color:"#94a3b8",fontSize:"0.85rem" }}>Hesap Kurtarildi</div></div>
              <div><div style={{ fontSize:"2.5rem",fontWeight:"800",color:"#f87171" }}>{sonuc.gasp}</div><div style={{ color:"#94a3b8",fontSize:"0.85rem" }}>Hesap Gasp Edildi</div></div>
            </div>
            <p style={{ color:"#cbd5e1",lineHeight:"1.6",marginBottom:"1.5rem" }}>
              {sonuc.gasp===0
                ? "🎉 Mukemmel! Farkli sifreler ve 2FA kullanarak tum hesaplarini korudun!"
                : sonuc.kurtarilan>sonuc.gasp
                ? `🛡️ Iyi is! ${sonuc.gasp} hesabin gasp edildi. 2FA ve farkli sifreler daha fazla korurdu.`
                : `⚠️ Dikkat! ${sonuc.gasp} hesabin domino etkisiyle gasp edildi. Her hesaba farkli sifre koy ve 2FA'yi ac!`}
            </p>
            <button onClick={sifirla} style={{ background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:"12px",padding:"0.75rem 2rem",color:"#fff",fontSize:"1rem",fontWeight:"600",cursor:"pointer" }}>🔄 Tekrar Dene</button>
          </div>
        )}
      </div>
    </div>
  );
}
