import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

// Yaygın şifre listesi (dictionary attack)
const COMMON_PASSWORDS = ["123456","password","qwerty","12345678","111111","abc123","password1","iloveyou","admin","letmein","monkey","dragon","master","sunshine","princess","welcome","shadow","superman","michael","football","1234567890"];

function analyzePassword(pw) {
  if (!pw) return null;
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw);
  const isCommon = COMMON_PASSWORDS.includes(pw.toLowerCase());
  const containsYear = /19\d\d|20\d\d/.test(pw);
  const hasPattern = /123|abc|qwe|asd|zxc/.test(pw.toLowerCase());

  // Charset büyüklüğü
  let charset = 0;
  if (hasLower) charset += 26;
  if (hasUpper) charset += 26;
  if (hasNumber) charset += 10;
  if (hasSymbol) charset += 32;
  if (charset === 0) charset = 26;

  // Entropy
  const entropy = Math.round(Math.log2(Math.pow(charset, pw.length)));

  // Skor
  let score = 0;
  if (pw.length > 12) score += 20; else if (pw.length >= 8) score += 10;
  if (hasUpper)   score += 10;
  if (hasLower)   score += 10;
  if (hasNumber)  score += 10;
  if (hasSymbol)  score += 20;
  if (isCommon)   score -= 30;
  if (containsYear) score -= 10;
  if (hasPattern) score -= 15;
  score = Math.max(0, Math.min(100, score));

  const level = score < 31 ? "Zayıf" : score < 61 ? "Orta" : score < 81 ? "Güçlü" : "Çok Güçlü";

  // Kırılma süresi (saniye) — basit model
  // GPU brute force: 1M/s
  const combinations = Math.pow(charset, pw.length);
  const crackSec = combinations / 1_000_000;

  let crackLabel;
  if (isCommon)         crackLabel = "Anında (listelerde mevcut!)";
  else if (crackSec < 1) crackLabel = "< 1 saniye";
  else if (crackSec < 60) crackLabel = `~${Math.round(crackSec)} saniye`;
  else if (crackSec < 3600) crackLabel = `~${Math.round(crackSec/60)} dakika`;
  else if (crackSec < 86400) crackLabel = `~${Math.round(crackSec/3600)} saat`;
  else if (crackSec < 31536000) crackLabel = `~${Math.round(crackSec/86400)} gün`;
  else if (crackSec < 31536000*100) crackLabel = `~${Math.round(crackSec/31536000)} yıl`;
  else crackLabel = `~${(crackSec/31536000).toExponential(1)} yıl`;

  return { hasLower, hasUpper, hasNumber, hasSymbol, isCommon, containsYear, hasPattern, entropy, score, level, crackLabel, charset };
}

export default function SifreAvcisi() {
  const [sifre, setSifre] = useState("");
  const [analiz, setAnaliz] = useState(null);
  const [botLog, setBotLog] = useState([]);
  const [botRunning, setBotRunning] = useState(false);

  useEffect(() => { setAnaliz(analyzePassword(sifre)); }, [sifre]);

  const botSimule = () => {
    if (!sifre) return;
    setBotRunning(true);
    setBotLog([]);
    const pw = sifre;
    const isCommon = COMMON_PASSWORDS.includes(pw.toLowerCase());
    const steps = [
      { msg:"[Bot] Dictionary Attack başlatılıyor...", color:"#fbbf24", delay:400 },
      { msg:`[Bot] 'password', '123456', 'qwerty'... deneniyor`, color:"#94a3b8", delay:900 },
      isCommon
        ? { msg:`[Bot] ✅ EŞLEŞME BULUNDU → "${pw}" yaygın şifre listesinde!`, color:"#f87171", delay:1400 }
        : { msg:`[Bot] ❌ Dictionary attack başarısız. Brute force deneniyor...`, color:"#86efac", delay:1400 },
      { msg:`[Bot] Şifre karmaşıklığı: charset=${analiz?.charset} · entropy=${analiz?.entropy} bit`, color:"#94a3b8", delay:2000 },
      { msg:`[Bot] Tahmini kırılma süresi (GPU): ${analiz?.crackLabel}`, color: analiz?.score < 50 ? "#f87171" : "#86efac", delay:2700 },
      { msg:`[Bot] Sonuç: ${analiz?.level} şifre`, color: analiz?.score < 50 ? "#f87171" : "#86efac", delay:3200 },
    ];
    steps.forEach(({ msg, color, delay }) => {
      setTimeout(() => setBotLog(p => [...p, { msg, color }]), delay);
    });
    setTimeout(() => setBotRunning(false), 3600);
  };

  const levelColor = { "Zayıf":"#ef4444", "Orta":"#f59e0b", "Güçlü":"#22c55e", "Çok Güçlü":"#6366f1" };

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", fontFamily:"'Sora',sans-serif", color:"#fff" }}>
      <Navbar />
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ maxWidth:"640px", margin:"0 auto", padding:"2rem" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"0.4rem" }}>🤖</div>
          <h1 style={{ margin:0, fontSize:"1.9rem", fontWeight:"800", background:"linear-gradient(90deg,#fbbf24,#f97316)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Şifre Avcısı Botu</h1>
          <p style={{ color:"#94a3b8", marginTop:"0.35rem" }}>Şifreni gir, bot ne kadar sürede kırar öğren!</p>
        </div>

        {/* Input */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"18px", padding:"1.5rem", marginBottom:"1.25rem" }}>
          <input
            value={sifre} onChange={e => setSifre(e.target.value)}
            placeholder="Şifreni buraya gir..."
            style={{ width:"100%", boxSizing:"border-box", background:"rgba(0,0,0,0.4)", border:"2px solid rgba(255,255,255,0.1)", borderRadius:"12px", padding:"0.9rem 1.1rem", color:"#fff", fontSize:"1.1rem", fontFamily:"monospace", outline:"none" }}
          />
        </div>

        {analiz && sifre && (
          <div style={{ animation:"fadeUp .4s ease" }}>
            {/* Güç çubuğu */}
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"16px", padding:"1.25rem", marginBottom:"1rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.5rem" }}>
                <span style={{ color:levelColor[analiz.level], fontWeight:"700" }}>{analiz.level}</span>
                <span style={{ color:"#94a3b8", fontSize:"0.85rem" }}>{analiz.score}/100 puan</span>
              </div>
              <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:"999px", height:"12px", overflow:"hidden", marginBottom:"0.75rem" }}>
                <div style={{ height:"100%", borderRadius:"999px", background:levelColor[analiz.level], width:`${analiz.score}%`, transition:"width .5s ease", boxShadow:`0 0 10px ${levelColor[analiz.level]}80` }} />
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", fontSize:"0.82rem" }}>
                {[
                  { label:"Küçük harf", ok:analiz.hasLower },
                  { label:"Büyük harf", ok:analiz.hasUpper },
                  { label:"Rakam", ok:analiz.hasNumber },
                  { label:"Özel karakter", ok:analiz.hasSymbol },
                  { label:"Yaygın şifre değil", ok:!analiz.isCommon },
                  { label:"Yıl/tarih içermiyor", ok:!analiz.containsYear },
                  { label:"Pattern yok (123,abc)", ok:!analiz.hasPattern },
                  { label:"8+ karakter", ok:sifre.length>=8 },
                ].map(({ label, ok }) => (
                  <div key={label} style={{ display:"flex", gap:"0.4rem", color:ok?"#86efac":"#f87171" }}>
                    <span>{ok?"✅":"❌"}</span><span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* İstatistikler */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.75rem", marginBottom:"1rem" }}>
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"0.9rem", textAlign:"center" }}>
                <div style={{ color:"#60a5fa", fontSize:"1.3rem", fontWeight:"800" }}>{analiz.entropy}</div>
                <div style={{ color:"#64748b", fontSize:"0.72rem" }}>Entropy (bit)</div>
              </div>
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"0.9rem", textAlign:"center" }}>
                <div style={{ color:"#fbbf24", fontSize:"1rem", fontWeight:"800" }}>{analiz.crackLabel}</div>
                <div style={{ color:"#64748b", fontSize:"0.72rem" }}>Kırılma Süresi</div>
              </div>
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"0.9rem", textAlign:"center" }}>
                <div style={{ color:"#a78bfa", fontSize:"1.3rem", fontWeight:"800" }}>{analiz.charset}</div>
                <div style={{ color:"#64748b", fontSize:"0.72rem" }}>Charset</div>
              </div>
            </div>

            {/* Bot simülasyonu */}
            <button onClick={botSimule} disabled={botRunning}
              style={{ width:"100%", background:"linear-gradient(135deg,#1e293b,#334155)", border:"2px solid #f97316", borderRadius:"14px", padding:"0.85rem", color:"#f97316", fontWeight:"700", fontSize:"0.95rem", cursor:botRunning?"not-allowed":"pointer", marginBottom:"1rem" }}>
              {botRunning ? "⏳ Bot çalışıyor..." : "🤖 Bot Saldırısını Simüle Et"}
            </button>

            {botLog.length > 0 && (
              <div style={{ background:"#000", border:"1px solid #1e293b", borderRadius:"12px", padding:"1rem", fontFamily:"monospace", fontSize:"0.82rem" }}>
                <div style={{ color:"#f97316", fontWeight:"700", marginBottom:"0.5rem" }}>▶ Bot Konsolu</div>
                {botLog.map((l,i) => <div key={i} style={{ color:l.color, marginBottom:"2px" }}>{l.msg}</div>)}
              </div>
            )}

            {/* Eğitim notu */}
            <div style={{ marginTop:"1rem", background:"rgba(108,99,255,0.08)", border:"1px solid rgba(108,99,255,0.2)", borderRadius:"12px", padding:"1rem" }}>
              <div style={{ color:"#a78bfa", fontWeight:"700", fontSize:"0.85rem", marginBottom:"0.4rem" }}>📚 Brute Force vs Credential Stuffing</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem", fontSize:"0.8rem" }}>
                <div style={{ color:"#94a3b8" }}><div style={{ color:"#f87171", fontWeight:"600", marginBottom:"0.2rem" }}>🔴 Brute Force</div>Tüm kombinasyonları dener. Yavaş ama garantili.</div>
                <div style={{ color:"#94a3b8" }}><div style={{ color:"#60a5fa", fontWeight:"600", marginBottom:"0.2rem" }}>🔵 Credential Stuffing</div>Daha önce sızmış şifreleri dener. Çok hızlı başarılı olur.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
