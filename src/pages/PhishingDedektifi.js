import React, { useState } from "react";
import Navbar from "../components/Navbar";

const IPUCLARI = [
  { id:0, baslik:"Sahte Gonderici Adresi", emoji:"📧", mesaj:"Tebrikler! Kurumlarin resmi uzantilarini (gov.tr vb.) fark ettin. Saldirganlar sahte adreslerle seni kandirmayi dener." },
  { id:1, baslik:"Credential Stuffing Tuzagi", emoji:"🔑", mesaj:"Harika! Saldirganlar 'Credential Stuffing' icin ayni sifreyi farkli yerlerde kullanma aliskanligini somurur. Her hesaba farkli sifre koy!" },
  { id:2, baslik:"2FA Kodu Calma Girisimi", emoji:"🛡️", mesaj:"Dedektif is basinda! Gercek kurumlar 2FA kodunu ASLA e-posta ile istemez. Bu kod senin son guvenlik kalkanindir!" },
];

export default function PhishingDedektifi() {
  const [bulunanlar, setBulunanlar] = useState([]);
  const [aktifModal, setAktifModal] = useState(null);
  const ipucuTikla = (id) => { setAktifModal(id); if (!bulunanlar.includes(id)) setBulunanlar(p => [...p, id]); };
  const tumBulundu = bulunanlar.length === 3;
  const aktifIpucu = IPUCLARI.find(i => i.id === aktifModal);
  const ipStil = (id) => ({
    display:"inline",background:bulunanlar.includes(id)?"rgba(34,197,94,0.25)":"rgba(251,191,36,0.08)",
    borderRadius:"4px",cursor:"pointer",
    border:bulunanlar.includes(id)?"2px solid rgba(34,197,94,0.6)":"2px dashed rgba(251,191,36,0.4)",
    padding:"1px 3px",transition:"all 0.2s",
  });

  return (
    <div style={{ minHeight:"100vh",background:"#0f172a",fontFamily:"'Sora',sans-serif",color:"#fff" }}>
      <Navbar />
      <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}} @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",padding:"2rem" }}>

        {/* Skor */}
        <div style={{ display:"flex",alignItems:"center",gap:"1rem",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"16px",padding:"0.75rem 1.5rem",marginBottom:"1.5rem",fontSize:"1rem",fontWeight:"600" }}>
          <span>🔍 Dedektif Skoru:</span>
          <span style={{ color:"#fbbf24",fontSize:"1.3rem",fontWeight:"800" }}>{bulunanlar.length} / 3</span>
          <div style={{ display:"flex",gap:"0.4rem" }}>
            {IPUCLARI.map(ip => <div key={ip.id} style={{ width:"14px",height:"14px",borderRadius:"50%",background:bulunanlar.includes(ip.id)?"#22c55e":"#334155",transition:"background .3s" }} />)}
          </div>
          <span style={{ color:"#64748b",fontSize:"0.8rem" }}>Sarı alanları bul 👆</span>
        </div>

        {/* E-posta kartı */}
        <div style={{ background:"#1e293b",border:"1px solid #334155",borderRadius:"16px",width:"100%",maxWidth:"640px",overflow:"hidden",boxShadow:"0 20px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ background:"#1e3a5f",padding:"1rem 1.5rem",borderBottom:"1px solid #334155",display:"flex",gap:"0.75rem",alignItems:"center" }}>
            <span style={{ fontSize:"1.4rem" }}>📬</span>
            <div>
              <div style={{ color:"#fff",fontWeight:"700" }}>Gelen Kutusu — e-Devlet Guvenlik Uyarisi</div>
              <div style={{ color:"#94a3b8",fontSize:"0.8rem" }}>Konu: Acil! Hesabiniz tehlikede</div>
            </div>
          </div>
          <div style={{ padding:"1.5rem" }}>
            <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:"10px",padding:"0.75rem 1rem",marginBottom:"1.25rem",fontSize:"0.83rem",color:"#94a3b8" }}>
              <strong style={{ color:"#cbd5e1" }}>Kimden: </strong>
              <span style={ipStil(0)} onClick={() => ipucuTikla(0)}>
                guvenlik@e-devlet-destek-hizmetleri.com <sup style={{ color:"#fbbf24",fontSize:"0.65rem" }}>❓</sup>
              </span>
              <br/><strong style={{ color:"#cbd5e1" }}>Kime: </strong>kullanici@ornek.com
            </div>
            <p style={{ color:"#cbd5e1",fontSize:"0.95rem",lineHeight:"1.7",marginBottom:"1rem" }}>Sayın Kullanici,</p>
            <p style={{ color:"#cbd5e1",fontSize:"0.95rem",lineHeight:"1.7",marginBottom:"1rem" }}>
              Sistemlerimiz hesabinizla ilgili bilgilerin karanlik web'de sizdirildigini tespit etti.
              <strong style={{ color:"#f87171" }}> Hemen harekete gecmelisiniz!</strong>
            </p>
            <p style={{ color:"#cbd5e1",fontSize:"0.95rem",lineHeight:"1.7",marginBottom:"1rem" }}>
              Sifreniz sizdirildi! Lutfen asagidaki linke tiklayarak{" "}
              <span style={ipStil(1)} onClick={() => ipucuTikla(1)}>
                <strong>her yerde kullandiginiz ortak sifrenizi</strong> girip hesabinizi dogrulayin
                <sup style={{ color:"#fbbf24",fontSize:"0.65rem" }}>❓</sup>
              </span>.
            </p>
            <p style={{ color:"#cbd5e1",fontSize:"0.95rem",lineHeight:"1.7",marginBottom:"1rem" }}>
              Dogrulama: <span style={{ color:"#60a5fa",textDecoration:"underline" }}>https://e-devlet-destek-hizmetleri.com/dogrula</span>
            </p>
            <div style={{ background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"12px",padding:"1rem" }}>
              <p style={{ color:"#cbd5e1",fontSize:"0.95rem",lineHeight:"1.7",margin:0 }}>
                ⚠️ Hesabinizin silinmesini durdurmak icin{" "}
                <span style={ipStil(2)} onClick={() => ipucuTikla(2)}>
                  telefonunuza gelen 6 haneli 2FA kodunu bize yanit olarak gonderin
                  <sup style={{ color:"#fbbf24",fontSize:"0.65rem" }}>❓</sup>
                </span>. 10 dakika icinde yapmazsaniz hesabiniz silinecektir.
              </p>
            </div>
          </div>
        </div>

        {/* Gorev tamamlandi */}
        {tumBulundu && (
          <div style={{ marginTop:"1.5rem",background:"linear-gradient(135deg,rgba(34,197,94,0.15),rgba(59,130,246,0.15))",border:"2px solid rgba(34,197,94,0.4)",borderRadius:"20px",padding:"2rem",textAlign:"center",maxWidth:"640px",width:"100%",animation:"fadeIn 0.6s ease" }}>
            <span style={{ fontSize:"3rem",display:"block",marginBottom:"0.5rem" }}>🏆</span>
            <div style={{ color:"#86efac",fontSize:"1.4rem",fontWeight:"800",marginBottom:"0.5rem" }}>Gorev Tamamlandi!</div>
            <p style={{ color:"#94a3b8",margin:0 }}>Credential Stuffing saldirisini durdurdun ve 2FA kalkanini korudun. <strong style={{ color:"#86efac" }}>Harika bir Siber Dedektifsin!</strong></p>
            <div style={{ marginTop:"0.75rem",fontSize:"2rem" }}>🎉🔒🎉</div>
          </div>
        )}

        {/* Modal */}
        {aktifModal !== null && aktifIpucu && (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:"1rem" }} onClick={() => setAktifModal(null)}>
            <div style={{ background:"#1e293b",border:"2px solid #22c55e",borderRadius:"20px",padding:"2rem",maxWidth:"420px",width:"100%",textAlign:"center",boxShadow:"0 0 40px rgba(34,197,94,0.3)",animation:"popIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
              <span style={{ fontSize:"3rem",display:"block",marginBottom:"0.75rem" }}>{aktifIpucu.emoji}</span>
              <div style={{ color:"#22c55e",fontSize:"1.2rem",fontWeight:"800",marginBottom:"0.75rem" }}>{aktifIpucu.baslik}</div>
              <p style={{ color:"#cbd5e1",fontSize:"0.95rem",lineHeight:"1.6",marginBottom:"1.5rem" }}>{aktifIpucu.mesaj}</p>
              <button style={{ background:"#22c55e",color:"#0f172a",border:"none",borderRadius:"12px",padding:"0.75rem 2rem",fontSize:"1rem",fontWeight:"700",cursor:"pointer" }} onClick={() => setAktifModal(null)}>Anladim! ✓</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
