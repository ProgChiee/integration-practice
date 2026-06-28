import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import bgImage from "../../assets/Foodbg.jpg";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      // Remember Me — localStorage (persistent) o sessionStorage (closes with tab)
      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }
      navigate("/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div style={{ ...styles.root, backgroundImage: `url(${bgImage})` }}>
      <div style={styles.overlay} />

      <div style={styles.formCard}>
        <div style={styles.brandBlock}>
          <div style={styles.logoCircle}>
            <span style={styles.logoLetter}>S</span>
          </div>
          <span style={styles.brandName}>YourSystem</span>
        </div>

        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.subheading}>Sign in to your account</p>

        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                style={{ ...styles.input, paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot Password row */}
          <div style={styles.optionsRow}>
            <label style={styles.rememberLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              Remember me
            </label>
            <a href="#" style={styles.link}>Forgot password?</a>
          </div>

          <button type="button" onClick={handleSubmit} style={styles.primaryBtn}>
            Sign in
          </button>

          <p style={styles.switchText}>
            Don't have an account?{" "}
            <button type="button" onClick={() => navigate("/register")} style={styles.switchLink}>
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    width: "100vw",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(10, 25, 60, 0.55)",
    backdropFilter: "blur(2px)",
    pointerEvents: "none",
  },
  formCard: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.97)",
    borderRadius: "20px",
    padding: "44px 40px",
    boxShadow: "0 8px 32px rgba(10,38,90,0.25)",
    margin: "20px",
  },
  brandBlock: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "24px",
  },
  logoCircle: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#60a5fa,#1d4ed8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: { color: "#fff", fontWeight: "700", fontSize: "16px" },
  brandName: { fontSize: "17px", fontWeight: "700", color: "#1e3a5f" },
  heading: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1e3a5f",
    margin: "0 0 6px",
    letterSpacing: "-0.4px",
  },
  subheading: { fontSize: "14px", color: "#64748b", margin: "0 0 28px" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "500", color: "#374151" },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #bfdbfe",
    fontSize: "14px",
    color: "#1e3a5f",
    background: "#f0f7ff",
    outline: "none",
    boxSizing: "border-box",
  },
  passwordWrapper: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
  },
  optionsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "-6px",
  },
  rememberLabel: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "13px",
    color: "#374151",
    cursor: "pointer",
    fontWeight: "500",
  },
  checkbox: { accentColor: "#2563eb", width: "15px", height: "15px", cursor: "pointer" },
  link: { fontSize: "13px", color: "#2563eb", textDecoration: "none", fontWeight: "500" },
  primaryBtn: {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "4px",
    letterSpacing: "0.2px",
  },
  switchText: { fontSize: "13px", color: "#64748b", textAlign: "center", margin: "4px 0 0" },
  switchLink: {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
    padding: 0,
  },
};