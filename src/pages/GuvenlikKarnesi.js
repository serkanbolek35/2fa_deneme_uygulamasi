import React, { useState } from "react";
import Navbar from "../components/Navbar";

const SORULAR = [
  { id:"q1", kategori:"sifre", metin:"Farklı platformlarda farklı şifreler kullanıyorum.", puan:20, tersPuan:-15 },
  { id:"q2", kategori:"sifre", metin:"Şifrelerim en az 12 karakter uzunluğunda.", puan:10, tersPuan:0 },
  { id:"q3", kategori:"sifre", metin:"Şifrelerimde büyük harf, sayı ve sembol kullanıyorum.", puan:10, tersPuan:0 },
  { id:"q4", kategori:"2fa",   metin:"Önemli hesaplarımda 2FA (iki faktörlü doğrulama) açık.", puan:30, tersPuan:0 },
  { id:"q5", kategori:"aliskanlik", metin:"Şifrelerimi not defteri veya kağıda yazmıyorum.", puan:5, tersPuan:-5 },
  { id:"q6", kategori:"aliskanlik", metin:"Şifre yöneticisi kullanıyorum.", puan:15, tersPuan:0 },
  { id:"q7", kategori:"aliskanlik", metin:"Şüpheli e-posta linklerine tıklamıyorum.", puan:5, tersPuan:-10 },
  { id:"q8", kategori:"aliskanlik", metin:"Şifrelerimi düzenli olarak güncelliyorum.", puan:5, tersPuan:0 },
];

export default function GuvenlikKarnesi() {
  const [cevaplar, setCevaplar] = useState({});
  const [goster, setGoster] = useState(false);

  const cevapla = (id, evet) => setCevaplar(p => ({ ...p, [id]: evet }));

  const hesapla = () => {
    let skor = 0;
    SORULAR.forEach(s => {
      if (cevaplar[s.id] === true) skor += s.puan;
      if (cevaplar[s.id] === false) skor += s.tersPuan;
    });
    return Math.max(0, Math.min(100, skor));
  };

  const skor = goster ? hesapla() : null;
  const seviye = skor !== null ? (skor < 41 ? "Tehlikeli" : skor < 71 ? "Riskli" : "Güvenli") : null;
  const seviyeRenk = { "Tehlikeli":"#ef4444", "Riskli":"#f59e0b", "Güvenli":"#22c55e" };
  const seviyeEmoji = { "Tehlikeli":"🔴", "Riskli":"🟡", "Güvenli":"🟢" };

  const tumCevaplandi = SORULAR.every(s => cevaplar[s.id] !== undefined);

  const sifirla = () => { setCevaplar({}); setGoster(false); };

  const kategoriLabel = { sifre:"🔐 Şifre Güvenliği", "2fa":"🛡️ 2FA Güvenliği", aliskanlik:"🧠 Kullanıcı Alışkanlıkları" };

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", fontFamily:"'Sora',sans-serif", color:"#fff" }}>
      <Navbar />
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ maxWidth:"620px", margin:"0 auto", padding:"2rem" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"0.4rem" }}>📊</div>
          <h1 style={{ margin:0, fontSize:"1.9rem", fontWeight:"800", background:"linear-gradient(90deg,#22c55e,#60a5fa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Dijital Güvenlik Karnesi
          </h1>
          <p style={{ color:"#94a3b8", marginTop:"0.35rem" }}>Soruları yanıtla, güvenlik notunu öğren!</p>
        </div>

        {/* Sorular */}
        {!goster && (
          <div>
            {["sifre","2fa","aliskanlik"].map(kat => (
              <div key={kat} style={{ marginBottom:"1.25rem" }}>
                <div style={{ color:"#94a3b8", fontSize:"0.78rem", fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"0.6rem" }}>
                  {kategoriLabel[kat]}
                </div>
                {SORULAR.filter(s => s.kategori===kat).map(s => (
                  <div key={s.id} style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${cevaplar[s.id]===true?"rgba(34,197,94,0.4)":cevaplar[s.id]===false?"rgba(239,68,68,0.25)":"rgba(255,255,255,0.08)"}`, borderRadius:"14px", padding:"1rem 1.25rem", marginBottom:"0.6rem", transition:"border-color .2s" }}>
                    <p style={{ color:"#e2e8f0", fontSize:"0.9rem", margin:"0 0 0.75rem", lineHeight:"1.5" }}>{s.metin}</p>
                    <div style={{ display:"flex", gap:"0.6rem" }}>
                      <button onClick={() => cevapla(s.id, true)}
                        style={{ flex:1, padding:"0.45rem", borderRadius:"8px", border:"none", background:cevaplar[s.id]===true?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.07)", color:cevaplar[s.id]===true?"#86efac":"#94a3b8", fontWeight:"600", cursor:"pointer", fontSize:"0.85rem", transition:"all .2s" }}>
                        ✅ Evet
                      </button>
                      <button onClick={() => cevapla(s.id, false)}
                        style={{ flex:1, padding:"0.45rem", borderRadius:"8px", border:"none", background:cevaplar[s.id]===false?"rgba(239,68,68,0.25)":"rgba(255,255,255,0.07)", color:cevaplar[s.id]===false?"#fca5a5":"#94a3b8", fontWeight:"600", cursor:"pointer", fontSize:"0.85rem", transition:"all .2s" }}>
                        ❌ Hayır
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <button onClick={() => setGoster(true)} disabled={!tumCevaplandi}
              style={{ width:"100%", background: tumCevaplandi ? "linear-gradient(135deg,#22c55e,#16a34a)" : "rgba(255,255,255,0.05)", border:"none", borderRadius:"14px", padding:"1rem", fontSize:"1rem", fontWeight:"700", color: tumCevaplandi ? "#fff" : "#4b5563", cursor: tumCevaplandi ? "pointer" : "not-allowed", marginTop:"0.5rem" }}>
              {tumCevaplandi ? "📊 Karnemi Göster" : `${SORULAR.length - Object.keys(cevaplar).length} soru kaldı`}
            </button>
          </div>
        )}

        {/* Sonuç */}
        {goster && skor !== null && (
          <div style={{ animation:"fadeUp .5s ease" }}>
            {/* Skor */}
            <div style={{ background:"rgba(255,255,255,0.04)", border:`2px solid ${seviyeRenk[seviye]}44`, borderRadius:"20px", padding:"2rem", textAlign:"center", marginBottom:"1.25rem", boxShadow:`0 0 30px ${seviyeRenk[seviye]}22` }}>
              <div style={{ fontSize:"3rem", marginBottom:"0.5rem" }}>{seviyeEmoji[seviye]}</div>
              <div style={{ color:seviyeRenk[seviye], fontSize:"1.8rem", fontWeight:"800", marginBottom:"0.25rem" }}>{seviye}</div>
              <div style={{ color:"#94a3b8", fontSize:"0.85rem", marginBottom:"1rem" }}>Güvenlik Skoru</div>
              <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:"999px", height:"16px", overflow:"hidden", marginBottom:"0.5rem" }}>
                <div style={{ height:"100%", borderRadius:"999px", background:seviyeRenk[seviye], width:`${skor}%`, transition:"width 1s ease", boxShadow:`0 0 12px ${seviyeRenk[seviye]}80` }} />
              </div>
              <div style={{ color:"#e2e8f0", fontWeight:"800", fontSize:"1.5rem" }}>{skor} / 100</div>
            </div>

            {/* Detaylar */}
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"1.25rem", marginBottom:"1.25rem" }}>
              <div style={{ color:"#94a3b8", fontSize:"0.78rem", fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"0.75rem" }}>📋 Detaylı Analiz</div>
              {SORULAR.map(s => (
                <div key={s.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.45rem 0", borderBottom:"1px solid rgba(255,255,255,0.05)", fontSize:"0.83rem" }}>
                  <span style={{ color:"#cbd5e1" }}>{s.metin}</span>
                  <span style={{ color:cevaplar[s.id]?"#86efac":"#f87171", fontWeight:"700", marginLeft:"0.75rem", whiteSpace:"nowrap" }}>
                    {cevaplar[s.id]?`+${s.puan}`:s.tersPuan<0?s.tersPuan:"0"}
                  </span>
                </div>
              ))}
            </div>

            {/* Öneri mesajı */}
            <div style={{ background:`${seviyeRenk[seviye]}11`, border:`1px solid ${seviyeRenk[seviye]}33`, borderRadius:"14px", padding:"1rem 1.25rem", marginBottom:"1.25rem" }}>
              <p style={{ color:"#cbd5e1", fontSize:"0.88rem", lineHeight:"1.7", margin:0 }}>
                {seviye==="Güvenli" && "Harika! Dijital güvenlik alışkanlıkların çok iyi. 2FA kullanmaya ve farklı şifreler oluşturmaya devam et."}
                {seviye==="Riskli" && "Bazı güvenlik alışkanlıkların iyileştirilebilir. 2FA aktif etmek ve farklı şifreler kullanmak güvenliğini önemli ölçüde artırır."}
                {seviye==="Tehlikeli" && "Hesapların ciddi risk altında! Hemen 2FA aç, farklı şifreler belirle ve şifre yöneticisi kullanmayı düşün."}
              </p>
            </div>

            <button onClick={sifirla} style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"12px", padding:"0.85rem", color:"#fff", fontSize:"0.95rem", fontWeight:"600", cursor:"pointer" }}>🔄 Testi Tekrar Yap</button>
          </div>
        )}
      </div>
    </div>
  );
}
