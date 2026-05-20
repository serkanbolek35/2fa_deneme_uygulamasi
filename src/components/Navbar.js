import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

const NAV_LINKS = [
  { path: "/dashboard",   label: "Ana Sayfa",    icon: "🏠" },
  { path: "/sifre-olcer", label: "Şifre Ölçer",  icon: "🛡️" },
  { path: "/phishing",    label: "Phishing",      icon: "🔍" },
  { path: "/domino",      label: "Domino",         icon: "🎲" },
];

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAcik, setMenuAcik] = useState(false);

  const handleLogout = async () => { await logout(); navigate("/login"); };

  return (
    <>
      <style>{`
        .navbar{
          position:sticky;top:0;z-index:50;
          background:rgba(10,10,15,0.88);
          backdrop-filter:blur(14px);
          border-bottom:1px solid #1e1e2e;
          font-family:'Sora',sans-serif;
        }
        .nav-inner{
          max-width:900px;margin:0 auto;
          display:flex;align-items:center;
          justify-content:space-between;
          padding:0 1.5rem;height:62px;
        }
        .nav-logo{
          font-family:'Space Mono',monospace;
          font-size:1.1rem;font-weight:700;color:#6c63ff;
          cursor:pointer;letter-spacing:-0.02em;border:none;background:transparent;
        }
        .nav-links{display:flex;align-items:center;gap:0.25rem;}
        .nav-link{
          display:flex;align-items:center;gap:0.4rem;
          padding:0.5rem 0.9rem;border-radius:10px;
          font-size:0.875rem;font-weight:500;color:#6b6b80;
          cursor:pointer;border:none;background:transparent;
          transition:color .2s,background .2s;
          font-family:'Sora',sans-serif;white-space:nowrap;
        }
        .nav-link:hover{background:rgba(108,99,255,0.1);color:#e8e8f0;}
        .nav-link.active{background:rgba(108,99,255,0.15);color:#6c63ff;font-weight:600;}
        .nav-right{display:flex;align-items:center;gap:0.75rem;}
        .nav-logout{
          background:transparent;border:1px solid #1e1e2e;
          color:#6b6b80;padding:0.45rem 1rem;border-radius:8px;
          font-family:'Sora',sans-serif;font-size:0.85rem;
          cursor:pointer;transition:border-color .2s,color .2s;
        }
        .nav-logout:hover{border-color:rgba(255,80,80,0.4);color:#ff6b6b;}
        .hamburger{
          display:none;flex-direction:column;gap:5px;
          background:transparent;border:none;cursor:pointer;padding:4px;
        }
        .hamburger span{display:block;width:22px;height:2px;
          background:#6b6b80;border-radius:2px;transition:all .25s;}
        .mobile-menu{
          display:none;flex-direction:column;
          background:rgba(13,13,20,0.97);
          border-bottom:1px solid #1e1e2e;
          padding:0.75rem 1rem;
        }
        .mobile-link{
          display:flex;align-items:center;gap:0.5rem;
          padding:0.7rem 0.75rem;border-radius:10px;
          font-size:0.9rem;font-weight:500;color:#6b6b80;
          cursor:pointer;border:none;background:transparent;
          font-family:'Sora',sans-serif;transition:all .2s;
        }
        .mobile-link:hover,.mobile-link.active{background:rgba(108,99,255,0.12);color:#6c63ff;}
        .mobile-sep{height:1px;background:#1e1e2e;margin:0.5rem 0;}
        @media(max-width:640px){
          .nav-links{display:none !important;}
          .hamburger{display:flex !important;}
          .mobile-menu{display:flex !important;}
        }
      `}</style>

      <nav className="navbar">
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => navigate("/dashboard")}>MyApp</button>

          <div className="nav-links">
            {NAV_LINKS.map(({ path, label, icon }) => (
              <button
                key={path}
                className={`nav-link ${location.pathname === path ? "active" : ""}`}
                onClick={() => navigate(path)}
              >
                <span>{icon}</span>{label}
              </button>
            ))}
          </div>

          <div className="nav-right">
            <button className="nav-logout" onClick={handleLogout}>Çıkış Yap</button>
            <button className="hamburger" onClick={() => setMenuAcik(o => !o)}>
              <span /><span /><span />
            </button>
          </div>
        </div>

        {menuAcik && (
          <div className="mobile-menu">
            {NAV_LINKS.map(({ path, label, icon }) => (
              <button
                key={path}
                className={`mobile-link ${location.pathname === path ? "active" : ""}`}
                onClick={() => { navigate(path); setMenuAcik(false); }}
              >
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
