import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

const NAV_LINKS = [
  { path:"/dashboard",        label:"Ana Sayfa",       icon:"🏠" },
  { path:"/sifre-olcer",      label:"Şifre Ölçer",     icon:"🛡️" },
  { path:"/sifre-avcisi",     label:"Şifre Avcısı",    icon:"🤖" },
  { path:"/guvenlik-karnesi", label:"Karne",            icon:"📊" },
  { path:"/siber-dedektif",   label:"Dedektif",         icon:"🔍" },
  { path:"/phishing",         label:"Phishing",         icon:"🎣" },
  { path:"/domino",           label:"Domino",           icon:"🎲" },
  { path:"/sifre-zinciri",    label:"Zincir",           icon:"⛓️" },
  { path:"/kalkan-lab",       label:"2FA Lab",          icon:"🔐" },
  { path:"/veri-ihlal",       label:"İhlal Haritası",   icon:"🌍" },
];

export default function Navbar() {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const [menuAcik, setMenuAcik] = useState(false);

  const handleLogout = async () => { await logout(); navigate("/login"); };

  return (
    <>
      <style>{`
        .navbar{position:sticky;top:0;z-index:50;background:rgba(10,10,15,0.92);backdrop-filter:blur(16px);border-bottom:1px solid #1a1a2e;font-family:'Sora',sans-serif;}
        .nav-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;height:58px;}
        .nav-logo{font-family:'Space Mono',monospace;font-size:1rem;font-weight:700;color:#6c63ff;cursor:pointer;border:none;background:transparent;white-space:nowrap;}
        .nav-links{display:flex;align-items:center;gap:0.1rem;overflow-x:auto;scrollbar-width:none;}
        .nav-links::-webkit-scrollbar{display:none;}
        .nav-link{display:flex;align-items:center;gap:0.3rem;padding:0.4rem 0.7rem;border-radius:8px;font-size:0.78rem;font-weight:500;color:#6b6b80;cursor:pointer;border:none;background:transparent;transition:color .2s,background .2s;font-family:'Sora',sans-serif;white-space:nowrap;}
        .nav-link:hover{background:rgba(108,99,255,0.1);color:#e8e8f0;}
        .nav-link.active{background:rgba(108,99,255,0.18);color:#6c63ff;font-weight:600;}
        .nav-right{display:flex;align-items:center;gap:0.5rem;flex-shrink:0;}
        .nav-logout{background:transparent;border:1px solid #1e1e2e;color:#6b6b80;padding:0.4rem 0.85rem;border-radius:8px;font-family:'Sora',sans-serif;font-size:0.8rem;cursor:pointer;transition:border-color .2s,color .2s;white-space:nowrap;}
        .nav-logout:hover{border-color:rgba(255,80,80,0.4);color:#ff6b6b;}
        .hamburger{display:none;flex-direction:column;gap:4px;background:transparent;border:none;cursor:pointer;padding:4px;}
        .hamburger span{display:block;width:20px;height:2px;background:#6b6b80;border-radius:2px;}
        .mobile-menu{display:none;flex-direction:column;background:rgba(10,10,15,0.98);border-bottom:1px solid #1a1a2e;padding:0.5rem 1rem;}
        .mobile-link{display:flex;align-items:center;gap:0.5rem;padding:0.65rem 0.75rem;border-radius:10px;font-size:0.88rem;font-weight:500;color:#6b6b80;cursor:pointer;border:none;background:transparent;font-family:'Sora',sans-serif;transition:all .2s;width:100%;text-align:left;}
        .mobile-link:hover,.mobile-link.active{background:rgba(108,99,255,0.12);color:#6c63ff;}
        .mobile-sep{height:1px;background:#1a1a2e;margin:0.4rem 0;}
        @media(max-width:768px){.nav-links{display:none !important;}.hamburger{display:flex !important;}.mobile-menu{display:flex !important;}}
      `}</style>

      <nav className="navbar">
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => navigate("/dashboard")}>🛡️ CyberEdu</button>

          <div className="nav-links">
            {NAV_LINKS.map(({ path, label, icon }) => (
              <button key={path} className={`nav-link ${location.pathname===path?"active":""}`} onClick={() => navigate(path)}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </div>

          <div className="nav-right">
            <button className="nav-logout" onClick={handleLogout}>Çıkış</button>
            <button className="hamburger" onClick={() => setMenuAcik(o => !o)}>
              <span /><span /><span />
            </button>
          </div>
        </div>

        {menuAcik && (
          <div className="mobile-menu">
            {NAV_LINKS.map(({ path, label, icon }) => (
              <button key={path} className={`mobile-link ${location.pathname===path?"active":""}`}
                onClick={() => { navigate(path); setMenuAcik(false); }}>
                <span>{icon}</span>{label}
              </button>
            ))}
            <div className="mobile-sep" />
            <button className="mobile-link" onClick={handleLogout}>🚪 Çıkış Yap</button>
          </div>
        )}
      </nav>
    </>
  );
}
