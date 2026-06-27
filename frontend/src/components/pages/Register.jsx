import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import bgImage from "../../assets/Foodbg.jpg";

const REGIONS = [
  "Metro Manila", "Ilocos Region", "Cagayan Valley", "Central Luzon",
  "CALABARZON", "MIMAROPA", "Bicol Region", "Western Visayas",
  "Central Visayas", "Eastern Visayas", "Zamboanga Peninsula",
  "Northern Mindanao", "Davao Region", "SOCCSKSARGEN", "Caraga",
  "BARMM", "Cordillera (CAR)",
];

const DIET_TYPES = [
  { value: "no_restrictions", label: "No Restrictions" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "halal", label: "Halal" },
];

const ALLERGIES = [
  { value: "nuts", label: "Nuts" },
  { value: "seafood", label: "Seafood" },
  { value: "dairy", label: "Dairy" },
  { value: "gluten", label: "Gluten" },
  { value: "eggs", label: "Eggs" },
  { value: "others", label: "Others" },
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Account Info, Step 2: Preferences
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    region: "",
    dietType: "no_restrictions",
    allergies: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otherAllergy, setOtherAllergy] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAllergyToggle = (value) => {
    setForm((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(value)
        ? prev.allergies.filter((a) => a !== value)
        : [...prev.allergies, value],
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.region) {
      alert("Please select your region.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        region: form.region,
        dietType: form.dietType,
        allergies: form.allergies,
        otherAllergy: form.allergies.includes("others") ? otherAllergy : "",
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Account created! Please sign in.");
      navigate("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div style={{ ...styles.root, backgroundImage: `url(${bgImage})` }}>
      <div style={styles.overlay} />

      <div style={styles.formCard}>
        {/* Brand */}
        <div style={styles.brandBlock}>
          <div style={styles.logoCircle}>
            <span style={styles.logoLetter}>S</span>
          </div>
          <span style={styles.brandName}>YourSystem</span>
        </div>

        {/* Step indicator */}
        <div style={styles.stepRow}>
          <div style={styles.stepItem}>
            <div style={{ ...styles.stepCircle, ...(step >= 1 ? styles.stepActive : {}) }}>1</div>
            <span style={styles.stepLabel}>Account</span>
          </div>
          <div style={styles.stepLine} />
          <div style={styles.stepItem}>
            <div style={{ ...styles.stepCircle, ...(step >= 2 ? styles.stepActive : {}) }}>2</div>
            <span style={styles.stepLabel}>Preferences</span>
          </div>
        </div>

        {/* ── STEP 1: Account Info ── */}
        {step === 1 && (
          <>
            <h1 style={styles.heading}>Create account</h1>
            <p style={styles.subheading}>Sign up to get started</p>

            <div style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Full name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Juan dela Cruz"
                  value={form.fullName}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

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
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    style={{ ...styles.input, paddingRight: "44px" }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Confirm password</label>
                <div style={styles.passwordWrapper}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    style={{ ...styles.input, paddingRight: "44px" }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="button" onClick={handleNext} style={styles.primaryBtn}>
                Next →
              </button>

              <p style={styles.switchText}>
                Already have an account?{" "}
                <button type="button" onClick={() => navigate("/login")} style={styles.switchLink}>
                  Sign in
                </button>
              </p>
            </div>
          </>
        )}

        {/* ── STEP 2: Preferences ── */}
        {step === 2 && (
          <>
            <h1 style={styles.heading}>Your preferences</h1>
            <p style={styles.subheading}>Help us personalize your food experience</p>

            <div style={styles.form}>
              {/* Region */}
              <div style={styles.field}>
                <label style={styles.label}> Region / Location</label>
                <select
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Select your region</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Diet Type */}
              <div style={styles.field}>
                <label style={styles.label}> Diet Type</label>
                <div style={styles.optionGroup}>
                  {DIET_TYPES.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setForm({ ...form, dietType: d.value })}
                      style={{
                        ...styles.optionBtn,
                        ...(form.dietType === d.value ? styles.optionBtnActive : {}),
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div style={styles.field}>
                <label style={styles.label}>Allergies (select all that apply)</label>
                <div style={styles.checkGroup}>
                  {ALLERGIES.map((a) => (
                    <label key={a.value} style={styles.checkItem}>
                      <input
                        type="checkbox"
                        checked={form.allergies.includes(a.value)}
                        onChange={() => handleAllergyToggle(a.value)}
                        style={styles.checkbox}
                      />
                      {a.label}
                    </label>
                  ))}
                </div>
                {/* Others text input — lalabas lang kapag naka-check ang Others */}
                {form.allergies.includes("others") && (
                  <input
                    type="text"
                    placeholder="Please specify your allergy..."
                    value={otherAllergy}
                    onChange={(e) => setOtherAllergy(e.target.value)}
                    style={{ ...styles.input, marginTop: "8px" }}
                  />
                )}
              </div>

              <div style={styles.btnRow}>
                <button type="button" onClick={() => setStep(1)} style={styles.backBtn}>
                   Back
                </button>
                <button type="button" onClick={handleSubmit} style={styles.primaryBtn}>
                  Create account
                </button>
              </div>
            </div>
          </>
        )}
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
    maxWidth: "440px",
    background: "rgba(255,255,255,0.97)",
    borderRadius: "20px",
    padding: "36px 40px 44px",
    boxShadow: "0 8px 32px rgba(10,38,90,0.25)",
    margin: "20px",
  },
  brandBlock: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
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
  stepRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "24px",
    gap: "8px",
  },
  stepItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  stepCircle: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#e2e8f0",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
  },
  stepActive: {
    background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
    color: "#fff",
  },
  stepLabel: { fontSize: "11px", color: "#64748b", fontWeight: "500" },
  stepLine: { flex: 1, height: "2px", background: "#e2e8f0", marginBottom: "16px" },
  heading: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1e3a5f",
    margin: "0 0 4px",
    letterSpacing: "-0.3px",
  },
  subheading: { fontSize: "13px", color: "#64748b", margin: "0 0 20px" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#374151" },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1.5px solid #bfdbfe",
    fontSize: "14px",
    color: "#1e3a5f",
    background: "#f0f7ff",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1.5px solid #bfdbfe",
    fontSize: "14px",
    color: "#1e3a5f",
    background: "#f0f7ff",
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
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
  optionGroup: { display: "flex", flexWrap: "wrap", gap: "8px" },
  optionBtn: {
    padding: "7px 14px",
    borderRadius: "20px",
    border: "1.5px solid #bfdbfe",
    background: "#f0f7ff",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  optionBtnActive: {
    background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
    color: "#fff",
    border: "1.5px solid transparent",
  },
  checkGroup: { display: "flex", flexWrap: "wrap", gap: "10px" },
  checkItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#374151",
    cursor: "pointer",
    fontWeight: "500",
  },
  checkbox: { accentColor: "#2563eb", width: "15px", height: "15px", cursor: "pointer" },
  btnRow: { display: "flex", gap: "10px", marginTop: "4px" },
  backBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1.5px solid #bfdbfe",
    background: "#f0f7ff",
    color: "#1e3a5f",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  primaryBtn: {
    flex: 1,
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
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