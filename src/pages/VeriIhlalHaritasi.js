import React, { useState } from "react";
import Navbar from "../components/Navbar";

const IHLALLER = [
  { id:1, company:"LinkedIn",  year:2012, icon:"💼", affected:"117 Milyon", leakedData:["E-posta","Şifre (hash)"], risk:"Credential Stuffing — aynı şifre başka platformlarda deneniyor.", protection:["Her platform için farklı şifre","2FA aktif et"], country:"ABD", posX:"22%", posY:"38%", color:"#0ea5e9" },
  { id:2, company:"Adobe",     year:2013, icon:"🎨", affected:"153 Milyon", leakedData:["E-posta","Şifreli parola","Kredi kartı ipucu"], risk:"Sızdırılan şifreler diğer platformlarda Credential Stuffing için kullanıldı.", protection:["Güçlü şifre kullan","2FA aktif et","Şifreni değiştir"], country:"ABD", posX:"20%", posY:"42%", color:"#f87171" },
  { id:3, company:"Yahoo",     year:2016, icon:"🟣", affected:"3 Milyar",   leakedData:["Ad","E-posta","Telefon","Doğum tarihi","Güvenlik sorusu"], risk:"Tarihte en büyük veri ihlali. Kişisel bilgiler sosyal mühendislik saldırılarında kullanıldı.", protection:["E-posta şifreni değiştir","2FA aktif et","Güvenlik sorularını güncelle"], country:"ABD", posX:"18%", posY:"40%", color:"#a78bfa" },
  { id:4, company:"Dropbox",   year:2012, icon:"📦", affected:"68 Milyon",  leakedData:["E-posta","Şifre (hash)"], risk:"Sızdırılan hesaplar 2016'ya kadar dark web'de satıldı.", protection:["Parolayı değiştir","2FA aktif et"], country:"ABD", posX:"17%", posY:"37%", color:"#34d399" },
  { id:5, company:"Facebook",  year:2019, icon:"👤", affected:"530 Milyon", leakedData:["Telefon numarası","Ad","E-posta","Konum"], risk:"Telefon numaraları SIM-swap ve sosyal mühendislik için kullanıldı.", protection:["Gizlilik ayarlarını kontrol et","2FA aktif et","Telefon numarasını gizle"], country:"ABD", posX:"21%", posY:"39%", color:"#60a5fa" },
  { id:6, company:"Canva",     year:2019, icon:"🎭", affected:"137 Milyon", leakedData:["Ad","E-posta","Şehir","Şifre (hash)"], risk:"Sanatçı ve tasarımcıların hesapları Credential Stuffing ile hedef alındı.", protection:["Şifreni değiştir","2FA aktif et"], country:"Avustralya", posX:"80%", posY:"65%", color:"#fbbf24" },
  { id:7, company:"Twitter/X", year:2022, icon:"🐦", affected:"200 Milyon", leakedData:["E-posta","Telefon (eşleştirilmiş)"], risk:"E-postalar ve telefon numaraları birleştirilerek kimlik tespiti yapıldı.", protection:["E-posta gizliliğini güncelle","2FA aktif et"], country:"ABD", posX:"24%", posY:"38%", color:"#38bdf8" },
];

export default function VeriIhlalHaritasi() {
  const [aktif, setAktif] = useState(null);
  const [kazanilan, setKazanilan] = useState([]);

  const tikla = (ihial) => {
    setAktif(ihial);
    if (!kazanilan.includes(ihial.id)) {
      setKazanilan(p => [...p, ihial.id]);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", fontFamily:"'Sora',sans-serif", color:"#fff" }}>
      <Navbar />
      <style>{`
        @keyframes ping{0%{transform:scale(1);opacity:1}100%{transform:scale(2.5);opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"2rem" }}>
        {/* Başlık */}
        <div style={{ textAlign:"center", marginBottom:"1.5rem" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"0.4rem" }}>🌍</div>
          <h1 style={{ margin:0, fontSize:"1.9rem", fontWeight:"800", background:"linear-gradient(90deg,#f87171,#fbbf24)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Küresel Veri İhlali Haritası</h1>
          <p style={{ color:"#94a3b8", marginTop:"0.35rem" }}>Noktalara tıkla, veri ihlallerini keşfet!</p>
          <div style={{ marginTop:"0.6rem", color:"#fbbf24", fontSize:"0.85rem" }}>
            İncelenen: {kazanilan.length}/{IHLALLER.length} 🔍
            {kazanilan.length >= 3 && <span style={{ marginLeft:"0.5rem" }}>🏅 Farkındalık Rozeti</span>}
            {kazanilan.length >= IHLALLER.length && <span style={{ marginLeft:"0.5rem" }}>🏆 Siber Farkındalık Uzmanı!</span>}
          </div>
        </div>

        {/* Harita alanı */}
        <div style={{ position:"relative", background:"linear-gradient(180deg,#0a1628 0%,#0d2240 50%,#0a1628 100%)", border:"1px solid #1e3a5f", borderRadius:"20px", overflow:"hidden", marginBottom:"1.5rem", height:"340px" }}>
          {/* Dekoratif grid */}
          <svg width="100%" height="100%" style={{ position:"absolute", inset:0, opacity:0.06 }}>
            {Array.from({length:10}).map((_,i) => <line key={`v${i}`} x1={`${i*11}%`} y1="0" x2={`${i*11}%`} y2="100%" stroke="#60a5fa" strokeWidth="1"/>)}
            {Array.from({length:7}).map((_,i)  => <line key={`h${i}`} x1="0" y1={`${i*17}%`} x2="100%" y2={`${i*17}%`} stroke="#60a5fa" strokeWidth="1"/>)}
          </svg>

          {/* Kıta siluet - basit polygon SVG */}
          <svg viewBox="0 0 900 340" width="100%" height="100%" style={{ position:"absolute", inset:0, opacity:0.12 }}>
            {/* Kuzey Amerika */}
            <polygon points="120,60 200,55 220,100 200,160 150,180 100,150 80,100" fill="#334155"/>
            {/* Güney Amerika */}
            <polygon points="170,200 220,195 240,260 210,310 170,300 150,260" fill="#334155"/>
            {/* Avrupa */}
            <polygon points="380,60 440,55 460,100 440,140 390,140 370,100" fill="#334155"/>
            {/* Afrika */}
            <polygon points="390,150 460,145 480,240 440,290 390,280 360,220" fill="#334155"/>
            {/* Asya */}
            <polygon points="470,50 700,45 730,130 680,160 500,155 460,110" fill="#334155"/>
            {/* Avustralya */}
            <polygon points="680,220 760,215 775,270 730,290 680,275 665,250" fill="#334155"/>
          </svg>

          {/* İhlal noktaları */}
          {IHLALLER.map(ihial => (
            <div key={ihial.id} onClick={() => tikla(ihial)}
              style={{ position:"absolute", left:ihial.posX, top:ihial.posY, transform:"translate(-50%,-50%)", cursor:"pointer", zIndex:10 }}>
              {/* Ping animasyonu */}
              <div style={{ position:"absolute", inset:"-6px", borderRadius:"50%", background:ihial.color+"44", animation:"ping 1.5s infinite" }} />
              <div style={{ width:"18px", height:"18px", borderRadius:"50%", background:ihial.color, border:"2px solid #fff",
                boxShadow:`0 0 12px ${ihial.color}`, transition:"transform .2s",
                ...(kazanilan.includes(ihial.id)?{ring:"2px solid #fff"}:{}) }} />
              {/* Etiket */}
              <div style={{ position:"absolute", bottom:"22px", left:"50%", transform:"translateX(-50%)", whiteSpace:"nowrap", background:"rgba(0,0,0,0.8)", color:"#fff", fontSize:"0.65rem", padding:"2px 6px", borderRadius:"6px", fontWeight:"600", pointerEvents:"none" }}>
                {ihial.icon} {ihial.company}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div style={{ position:"absolute", bottom:"12px", right:"14px", background:"rgba(0,0,0,0.6)", borderRadius:"10px", padding:"0.5rem 0.75rem", fontSize:"0.72rem", color:"#94a3b8" }}>
            🔴 = Veri İhlali Noktası
          </div>
        </div>

        {/* Seçili kart */}
        {aktif && (
          <div style={{ background:"rgba(255,255,255,0.04)", border:`2px solid ${aktif.color}44`, borderRadius:"20px", padding:"1.75rem", animation:"fadeUp .4s ease",
            boxShadow:`0 0 30px ${aktif.color}22` }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1rem" }}>
              <span style={{ fontSize:"2rem" }}>{aktif.icon}</span>
              <div>
                <div style={{ fontWeight:"800", fontSize:"1.2rem", color:aktif.color }}>{aktif.company} Veri İhlali</div>
                <div style={{ color:"#64748b", fontSize:"0.82rem" }}>📅 {aktif.year} · 👥 {aktif.affected} hesap etkilendi</div>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
              <div>
                <div style={{ color:"#94a3b8", fontSize:"0.75rem", fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"0.4rem" }}>🛑 Sızan Bilgiler</div>
                {aktif.leakedData.map(d => <div key={d} style={{ color:"#fca5a5", fontSize:"0.85rem", marginBottom:"2px" }}>• {d}</div>)}
              </div>
              <div>
                <div style={{ color:"#94a3b8", fontSize:"0.75rem", fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"0.4rem" }}>🛡️ Korunma Yöntemleri</div>
                {aktif.protection.map(p => <div key={p} style={{ color:"#86efac", fontSize:"0.85rem", marginBottom:"2px" }}>✅ {p}</div>)}
              </div>
            </div>

            <div style={{ marginTop:"1rem", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"12px", padding:"0.75rem 1rem" }}>
              <div style={{ color:"#94a3b8", fontSize:"0.75rem", fontWeight:"600", textTransform:"uppercase", marginBottom:"0.3rem" }}>⚠️ Credential Stuffing Riski</div>
              <p style={{ color:"#fca5a5", fontSize:"0.88rem", margin:0, lineHeight:"1.6" }}>{aktif.risk}</p>
            </div>

            {/* 2FA simülasyonu */}
            <div style={{ marginTop:"0.75rem", background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:"12px", padding:"0.75rem 1rem" }}>
              <div style={{ color:"#60a5fa", fontSize:"0.8rem", fontWeight:"600", marginBottom:"0.35rem" }}>🔐 2FA Açık Olsaydı Ne Olurdu?</div>
              <div style={{ display:"flex", gap:"0.5rem", alignItems:"center", fontSize:"0.82rem", color:"#94a3b8" }}>
                <span>🔓 Şifre doğru</span><span>→</span><span style={{ color:"#f87171" }}>❌ 2FA başarısız</span><span>→</span><span style={{ color:"#86efac" }}>🛡️ Hesap korundu</span>
              </div>
            </div>
          </div>
        )}

        {!aktif && (
          <div style={{ textAlign:"center", color:"#334155", padding:"2rem" }}>
            <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>👆</div>
            <div>Haritadaki noktalara tıklayarak veri ihlallerini incele</div>
          </div>
        )}
      </div>
    </div>
  );
}
