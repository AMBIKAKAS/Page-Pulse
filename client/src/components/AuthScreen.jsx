
import { useState } from "react";
import { Activity, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../utils/api";

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";

      const payload =
        mode === "login"
          ? { email, password }
          : { name, email, password };

      const response = await api.post(endpoint, payload);
      const { token, user } = response.data;

      localStorage.setItem("pagepulse_token", token);
      onAuthenticated(user);

      toast.success(
        mode === "login" ? "Welcome back!" : "Your account has been created!"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <div className="auth-layout">
        <section className="auth-intro">
          <div className="auth-brand">
            <span className="auth-brand-icon"><Activity size={23} /></span>
            <span>page<span>pulse</span></span>
          </div>

          <div className="auth-intro-content">
            <div className="auth-eyebrow">
              <span className="live-dot" /> SEO INTELLIGENCE PLATFORM
            </div>
            <h1>Understand your website. <span>Improve its performance.</span></h1>
            <p>
              Analyze technical SEO signals, identify website issues and
              monitor your progress from one focused workspace.
            </p>

            <div className="auth-benefits">
              <div><span>01</span><div><strong>Technical SEO insights</strong><small>Review important on-page SEO checks.</small></div></div>
              <div><span>02</span><div><strong>Audit history</strong><small>Keep your website analysis organized.</small></div></div>
              <div><span>03</span><div><strong>Performance comparison</strong><small>Compare saved audits over time.</small></div></div>
            </div>
          </div>

          <p className="auth-copyright">© {new Date().getFullYear()} Page Pulse. Built for better websites.</p>
        </section>

        <section className="auth-form-side">
          <div className="auth-card">
            <div className="auth-card-heading">
              <span className="auth-card-kicker">
                {mode === "login" ? "YOUR WORKSPACE AWAITS" : "GET STARTED"}
              </span>
              <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
              <p>
                {mode === "login"
                  ? "Sign in to continue to your SEO workspace."
                  : "Create an account to start managing your website audits."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {mode === "register" && (
                <label className="auth-field">
                  <span>Full name</span>
                  <div className="auth-input-wrap">
                    <UserRound size={18} />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      maxLength={60}
                      autoComplete="name"
                      required
                    />
                  </div>
                </label>
              )}

              <label className="auth-field">
                <span>Email address</span>
                <div className="auth-input-wrap">
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              <label className="auth-field">
                <span>Password</span>
                <div className="auth-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={8}
                    maxLength={72}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : mode === "login"
                    ? "Sign in to workspace"
                    : "Create account"}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <div className="auth-switch">
              {mode === "login" ? "New to Page Pulse?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setPassword("");
                }}
              >
                {mode === "login" ? "Create an account" : "Sign in"}
              </button>
            </div>

            <div className="auth-security-note">
              <LockKeyhole size={14} />
              Your account is protected with password hashing and secure token verification.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthScreen;
