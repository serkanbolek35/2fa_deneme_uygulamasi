import React, { useState } from "react";
import Navbar from "../components/Navbar";

// ── Siber Dedektif: Gerçek mi Sahte mi? ──────────────────────────────────────
const MESSAGE_SCENARIOS = [
  { id:1, type:"SMS", sender:"Google", title:"Doğrulama Kodu", content:"Google doğrulama kodunuz: 381921. Bu kodu kimseyle paylaşmayın.", isPhishing:false, explanation:"Gerçek doğrulama SMS'leri yalnızca kodu içerir ve kimseyle paylaşmamanızı hatırlatır.", dangerLevel:0, fakeClues:[] },
  { id:2, type:"E-Posta", sender:"guvenlik@e-devlet-destek.com", title:"ACİL: Hesabınız Tehlikede!", content:"Hesabınız güvenlik ihlali tespit edildi. 2FA kodunuzu hemen aşağıdaki forma girerek hesabınızı kurtarın, yoksa 24 saat içinde silinecek!", isPhishing:true, explanation:"Gerçek kurumlar 2FA kodunu asla e-posta ile istemez. Sahte alan adı (e-devlet-destek.com) ve panik yaratan dil dikkat çekicidir.", dangerLevel:3, fakeClues:["Sahte alan adı","2FA kodu isteniyor","Acil baskı dili"] },
  { id:3, type:"Bildirim", sender:"Instagram", title:"Yeni giriş algılandı", content:"İstanbul, Türkiye'den hesabınıza yeni bir giriş yapıldı. Bu işlem size ait değilse hesabınızı hemen güvenli hale getirin.", isPhishing:false, explanation:"Gerçek giriş bildirimleri konum bilgisi içerir ve şifre veya kod istemez.", dangerLevel:0, fakeClues:[] },
  { id:4, type:"E-Posta", sender:"banka-guvenlik@enpaybank-destek.net", title:"Banka Hesabınız Askıya Alındı", content:"Şüpheli işlem tespit edildi. Hesabınızın açılması için aşağıdaki linke tıklayarak TC kimlik numaranızı ve şifrenizi doğrulayın.", isPhishing:true, explanation:"Bankalar asla e-posta ile şifre veya TC kimlik numarası istemez. Alan adı (.net uzantılı sahte domain) ve acil dil phishing belirtisidir.", dangerLevel:3, fakeClues:["Sahte banka domain'i","Şifre isteniyor","TC kimlik numarası isteniyor"] },
  { id:5, type:"SMS", sender:"+90 532 XXX XX XX", title:"Şifre Sıfırlama", content:"Şifreniz sızdırıldı! Hesabınızı korumak için bu SMS'e 2FA kodunuzu yanıt olarak gönderin.", isPhishing:true, explanation:"Gerçek sistemler hiçbir zaman SMS'e 2FA kodu yanıtı istemez. Şifre sızdırıldı iddiası panik yaratmak içindir.", dangerLevel:3, fakeClues:["SMS'e 2FA kodu isteniyor","Kişisel numara gönderen","Panik dili"] },
  { id:6, type:"Bildirim", sender:"GitHub", title:"İki faktörlü doğrulama kodunuz", content:"GitHub güvenlik kodunuz: 847392. Bu kod yalnızca sizin kullanımınız içindir ve 10 dakika geçerlidir.", isPhishing:false, explanation:"Gerçek 2FA kodları yalnızca size özel olduğunu belirtir, kısa süreli geçerliliği vardır ve başka bir şey istemez.", dangerLevel:0, fakeClues:[] },
  { id:7, type:"Giriş Ekranı", sender:"faceb00k-giris.com", title:"Facebook Giriş", content:"Facebook hesabınıza giriş yapın. E-posta ve şifrenizi girerek devam edin. Güvenliğiniz bizim için önemli!", isPhishing:true, explanation:"Alan adı 'faceb00k' (iki sıfır ile) resmi Facebook adresi değildir. Sahte giriş ekranları şifrelerinizi çalmak için tasarlanır.", dangerLevel:3, fakeClues:["Sahte alan adı (0 yerine o)","Resmi logo kopyalanmış","Gerçekmiş gibi görünüyor"] },
];

export default function SiberDedektif() {
  const [index, setIndex] = useState(0);
  const [secim, setSecim] = useState(null); // null | "gercek" | "sahte"
  const [skor, setSkor] = useState({ dogru:0, yanlis:0 });
  const [bitti, setBitti] = useState(false);
  const [rozet, setRozet] = useState([]);

  const scenario = MESSAGE_SCENARIOS[index];

  const cevapla = (tip) => {
    if (secim) return;
    setSecim(tip);
    const dogru = (tip==="sahte") === scenario.isPhishing;
    const yeniSkor = dogru ? { ...skor, dogru: skor.dogru+1 } : { ...skor, yanlis: skor.yanlis+1 };
    setSkor(yeniSkor);
    if (dogru && yeniSkor.dogru === 3) setRozet(p => [...p, "🥉 Çaylak Dedektif"]);
    if (dogru && yeniSkor.dogru === 5) setRozet(p => [...p, "🥈 Tecrübeli Dedektif"]);
    if (dogru && yeniSkor.dogru === 7) setRozet(p => [...p, "🥇 Siber Dedektif Ustası"]);
  };

  const sonraki = () => {
    if (index >= MESSAGE_SCENARIOS.length-1) { setBitti(true); return; }
    setIndex(i => i+1);
    setSecim(null);
  };

  const yenidenBasla = () => { setIndex(0); setSecim(null); setSkor({dogru:0,yanlis:0}); setBitti(false); setRozet([]); };

  const tipRengi = { "SMS":"#22c55e","E-Posta":"#60a5fa","Bildirim":"#fbbf24","Giriş Ekranı":"#f87171" };

  if (bitti) {
    const toplam = MESSAGE_SCENARIOS.length;
    const oran = Math.round((skor.dogru/toplam)*100);
    return (
      <div style={{ minHeight:"100vh", background:"#0a0a0f", fontFamily:"'Sora',sans-serif", color:"#fff" }}>
        <Navbar />
        <div style={{ maxWidth:"600px", margin:"0 auto", padding:"2rem", textAlign:"center" }}>
          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
          <div style={{ background:"linear-gradient(135deg,rgba(30,27,75,0.9),rgba(15,23,42,0.95))", border:"2px solid rgba(167,139,250,0.4)", borderRadius:"24px", padding:"2.5rem", animation:"fadeUp .6s ease" }}>
            <div style={{ fontSize:"3rem", marginBottom:"0.5rem" }}>🏆</div>
            <h2 style={{ color:"#e2e8f0", marginBottom:"1rem" }}>Oyun Tamamlandı!</h2>
            <div style={{ display:"flex", justifyContent:"center", gap:"2.5rem", marginBottom:"1.5rem" }}>
              <div><div style={{ fontSize:"2.5rem", fontWeight:"800", color:"#86efac" }}>{skor.dogru}</div><div style={{ color:"#94a3b8", fontSize:"0.85rem" }}>Doğru</div></div>
              <div><div style={{ fontSize:"2.5rem", fontWeight:"800", color:"#f87171" }}>{skor.yanlis}</div><div style={{ color:"#94a3b8", fontSize:"0.85rem" }}>Yanlış</div></div>
              <div><div style={{ fontSize:"2.5rem", fontWeight:"800", color:"#fbbf24" }}>{oran}%</div><div style={{ color:"#94a3b8", fontSize:"0.85rem" }}>Başarı</div></div>
            </div>
            {rozet.length > 0 && <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap", justifyContent:"center", marginBottom:"1rem" }}>
              {rozet.map(r => <span key={r} style={{ background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.4)", borderRadius:"999px", padding:"0.35rem 0.9rem", fontSize:"0.85rem", color:"#fbbf24" }}>{r}</span>)}
            </div>}
            <p style={{ color:"#cbd5e1", lineHeight:"1.6", marginBottom:"1.5rem" }}>
              {oran>=80 ? "Tebrikler! Sosyal mühendislik saldırılarını başarıyla tespit ettin." : "Bazı sahte mesajlar seni kandırmayı başardı. Gerçek kurumların asla şifre veya 2FA kodu istemeyeceğini unutma!"}
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem", justifyContent:"center", marginBottom:"1.5rem" }}>
              {["2FA kodunu kimseyle paylaşma","Şüpheli bağlantılara tıklama","Alan adını kontrol et","Acil baskı dilinden şüphelenin","Gerçek kurumlar kod istemez"].map(k => (
                <span key={k} style={{ background:"rgba(108,99,255,0.12)", border:"1px solid rgba(108,99,255,0.25)", borderRadius:"999px", padding:"0.3rem 0.75rem", fontSize:"0.75rem", color:"#a78bfa" }}>✅ {k}</span>
              ))}
            </div>
            <button onClick={yenidenBasla} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"12px", padding:"0.75rem 2rem", color:"#fff", fontSize:"0.95rem", fontWeight:"600", cursor:"pointer" }}>🔄 Tekrar Oyna</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", fontFamily:"'Sora',sans-serif", color:"#fff" }}>
      <Navbar />
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}} @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}`}</style>
      <div style={{ maxWidth:"640px", margin:"0 auto", padding:"2rem" }}>
        {/* Üst panel */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem" }}>
          <div>
            <h1 style={{ margin:0, fontSize:"1.4rem", fontWeight:"800", background:"linear-gradient(90deg,#60a5fa,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>🔍 Siber Dedektif</h1>
            <p style={{ color:"#64748b", fontSize:"0.8rem", margin:0 }}>Gerçek mi, sahte mi?</p>
          </div>
          <div style={{ display:"flex", gap:"1rem" }}>
            <span style={{ color:"#86efac", fontWeight:"700" }}>✅ {skor.dogru}</span>
            <span style={{ color:"#f87171", fontWeight:"700" }}>❌ {skor.yanlis}</span>
            <span style={{ color:"#94a3b8", fontSize:"0.85rem" }}>{index+1}/{MESSAGE_SCENARIOS.length}</span>
          </div>
        </div>

        {/* Mesaj kartı */}
        <div style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:"18px", overflow:"hidden", marginBottom:"1.25rem", animation:"slideIn .4s ease",
          boxShadow: secim ? (((secim==="sahte")===scenario.isPhishing) ? "0 0 25px rgba(34,197,94,0.3)" : "0 0 25px rgba(239,68,68,0.3)") : "none" }}>
          {/* Mesaj başlığı */}
          <div style={{ background:"#0f172a", padding:"0.75rem 1.25rem", display:"flex", alignItems:"center", gap:"0.75rem", borderBottom:"1px solid #334155" }}>
            <span style={{ background:tipRengi[scenario.type]+"22", color:tipRengi[scenario.type], border:`1px solid ${tipRengi[scenario.type]}44`, borderRadius:"6px", padding:"2px 8px", fontSize:"0.72rem", fontWeight:"700" }}>{scenario.type}</span>
            <span style={{ color:"#94a3b8", fontSize:"0.82rem" }}>Gönderen: <strong style={{ color:"#cbd5e1" }}>{scenario.sender}</strong></span>
          </div>
          {/* İçerik */}
          <div style={{ padding:"1.5rem" }}>
            <div style={{ fontWeight:"700", color:"#e2e8f0", marginBottom:"0.75rem", fontSize:"1.05rem" }}>{scenario.title}</div>
            <p style={{ color:"#94a3b8", lineHeight:"1.7", margin:0 }}>{scenario.content}</p>
          </div>
        </div>

        {/* Butonlar */}
        {!secim ? (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
            <button onClick={() => cevapla("gercek")} style={{ background:"rgba(34,197,94,0.12)", border:"2px solid rgba(34,197,94,0.4)", borderRadius:"14px", padding:"1rem", color:"#86efac", fontWeight:"700", fontSize:"1rem", cursor:"pointer", transition:"all .2s" }}>
              ✅ Gerçek Mesaj
            </button>
            <button onClick={() => cevapla("sahte")} style={{ background:"rgba(239,68,68,0.12)", border:"2px solid rgba(239,68,68,0.4)", borderRadius:"14px", padding:"1rem", color:"#fca5a5", fontWeight:"700", fontSize:"1rem", cursor:"pointer", transition:"all .2s" }}>
              ❌ Phishing / Sahte
            </button>
          </div>
        ) : (
          <div>
            {/* Sonuç */}
            <div style={{ background: ((secim==="sahte")===scenario.isPhishing) ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", border:`2px solid ${((secim==="sahte")===scenario.isPhishing) ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`, borderRadius:"14px", padding:"1.25rem", marginBottom:"1rem" }}>
              <div style={{ fontWeight:"700", color: ((secim==="sahte")===scenario.isPhishing) ? "#86efac" : "#fca5a5", marginBottom:"0.5rem", fontSize:"1rem" }}>
                {((secim==="sahte")===scenario.isPhishing) ? "🎉 Doğru tespit ettin!" : "😬 Yanıldın!"}
              </div>
              {scenario.isPhishing && scenario.fakeClues.length>0 && (
                <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap", marginBottom:"0.6rem" }}>
                  {scenario.fakeClues.map(c => <span key={c} style={{ background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"6px", padding:"2px 8px", fontSize:"0.72rem", color:"#fca5a5" }}>⚠️ {c}</span>)}
                </div>
              )}
              <p style={{ color:"#94a3b8", fontSize:"0.88rem", margin:0, lineHeight:"1.6" }}>{scenario.explanation}</p>
            </div>
            <button onClick={sonraki} style={{ width:"100%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:"12px", padding:"0.85rem", color:"#fff", fontWeight:"700", fontSize:"1rem", cursor:"pointer" }}>
              {index >= MESSAGE_SCENARIOS.length-1 ? "🏆 Sonuçları Gör" : "Sonraki Mesaj →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
