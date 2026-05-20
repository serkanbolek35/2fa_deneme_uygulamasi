import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function SifreOlcer() {
  const [sifre, setSifre] = useState("");
  const [skor, setSkor] = useState(0);
  const [kriterler, setKriterler] = useState({
    uzunluk: false, buyukHarf: false, kucukHarf: false, rakam: false, ozelKarakter: false,
  });

  useEffect(() => {
    const yeni = {
      uzunluk: sifre.length >= 8,
      buyukHarf: /[A-Z]/.test(sifre),
      kucukHarf: /[a-z]/.test(sifre),
      rakam: /[0-9]/.test(sifre),
      ozelKarakter: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(sifre),
    };
    setKriterler(yeni);
    setSkor(Object.values(yeni).filter(Boolean).length * 20);
  }, [sifre]);

  const skorRengi = () => skor <= 39 ? "#ef4444" : skor <= 79 ? "#f59e0b" : "#22c55e";
  const skorEtiketi = () => skor === 0 ? "" : skor <= 39 ? "Zayif" : skor <= 79 ? "Orta" : "Guclu";
  const skorEmoji = () => skor === 0 ? "🔒" : skor <= 39 ? "😟" : skor <= 79 ? "🤔" : "😎";
  const tamam = skor === 100;

  const kriterListesi = [
    { key: "uzunluk",      metin: "En az 8 karakter" },
    { key: "buyukHarf",    metin: "En az 1 buyuk harf (A-Z)" },
    { key: "kucukHarf",    metin: "En az 1 kucuk harf (a-z)" },
    { key: "rakam",        metin: "En az 1 rakam (0-9)" },
    { key: "ozelKarakter", metin: "En az 1 ozel karakter (!@#$...)" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0f172a,#1e1b4b,#0f172a)", fontFamily:"'Sora',sans-serif" }}>
      <Navbar />
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .so-input:focus{border-color:#a78bfa !important;box-shadow:0 0 0 3px rgba(167,139,250,0.2);}
      `}</style>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",minHeight:"calc(100vh - 62px)" }}>
        <div style={{ background:"rgba(255,255,255,0.05)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"24px",padding:"2.5rem",width:"100%",maxWidth:"520px",boxShadow:"0 25px 50px rgba(0,0,0,0.5)" }}>
          <div style={{ textAlign:"center",marginBottom:"2rem" }}>
            <span style={{ fontSize:"3rem",display:"block",marginBottom:"0.5rem" }}>🛡️</span>
            <h1 style={{ margin:0,fontSize:"1.8rem",fontWeight:"800",background:"linear-gradient(90deg,#a78bfa,#60a5fa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Canli Sifre Gucu Olcer</h1>
            <p style={{ color:"#94a3b8",fontSize:"0.9rem",marginTop:"0.4rem" }}>Guclu bir sifre olusturarak siber saldirilara karsi korun!</p>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1rem" }}>
            <input className="so-input" style={{ flex:1,background:"rgba(255,255,255,0.08)",border:"2px solid rgba(255,255,255,0.15)",borderRadius:"16px",padding:"1rem 1.25rem",color:"#fff",fontSize:"1.2rem",fontFamily:"monospace",outline:"none",transition:"border-color .2s" }} type="text" placeholder="Sifreni buraya yaz..." value={sifre} onChange={(e) => setSifre(e.target.value)} spellCheck={false} autoComplete="off" />
            <span style={{ fontSize:"2rem",minWidth:"48px",textAlign:"center",transition:"transform 0.3s",transform:tamam?"scale(1.3)":"scale(1)" }}>{skorEmoji()}</span>
          </div>
          <div style={{ marginBottom:"0.5rem" }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"0.4rem" }}>
              <span style={{ color:skorRengi(),fontWeight:"700",transition:"color .3s" }}>{skorEtiketi()}</span>
              <span style={{ color:"#94a3b8",fontSize:"0.85rem" }}>{skor}/100 puan</span>
            </div>
            <div style={{ background:"rgba(255,255,255,0.08)",borderRadius:"999px",height:"14px",overflow:"hidden" }}>
              <div style={{ height:"100%",borderRadius:"999px",background:skorRengi(),width:`${skor}%`,transition:"width 0.4s ease,background 0.4s ease",boxShadow:`0 0 12px ${skorRengi()}80` }} />
            </div>
          </div>
          <p style={{ color:"#94a3b8",fontSize:"0.8rem",fontWeight:"600",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"0.75rem",marginTop:"1.5rem" }}>Kontrol Listesi</p>
          {kriterListesi.map(({ key, metin }) => (
            <div key={key} style={{ display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.5rem 0.75rem",borderRadius:"10px",background:kriterler[key]?"rgba(34,197,94,0.1)":"rgba(255,255,255,0.03)",marginBottom:"0.4rem",border:kriterler[key]?"1px solid rgba(34,197,94,0.25)":"1px solid transparent",transition:"all .3s" }}>
              <span style={{ fontSize:"1.1rem",minWidth:"24px",textAlign:"center" }}>{kriterler[key]?"✅":"❌"}</span>
              <span style={{ color:kriterler[key]?"#86efac":"#94a3b8",fontSize:"0.9rem",fontWeight:kriterler[key]?"600":"400",transition:"color .3s" }}>{metin}</span>
            </div>
          ))}
          {tamam && (
            <div style={{ marginTop:"1.5rem",background:"linear-gradient(135deg,rgba(34,197,94,0.2),rgba(16,185,129,0.2))",border:"2px solid rgba(34,197,94,0.4)",borderRadius:"16px",padding:"1.25rem",textAlign:"center",animation:"fadeIn 0.5s ease" }}>
              <span style={{ fontSize:"2.5rem",display:"block",marginBottom:"0.5rem" }}>🎉</span>
              <p style={{ color:"#86efac",fontSize:"1rem",fontWeight:"600",lineHeight:"1.5",margin:0 }}>Harika! Cok guclu bir sifre olusturdun.<br/>Artik siber saldirilara karsi guvendesin!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
