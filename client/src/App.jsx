
import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  Activity, Clock3, Code2, Download, FileText,
  Gauge, Globe, LayoutDashboard, Plus, RefreshCw,
  Search, Settings, ShieldCheck, Trophy,
  ArrowUpRight, ChevronRight, GitCompareArrows,
  ExternalLink, CheckCircle2, Menu, X, Trash2
} from "lucide-react";

import Background from "./components/Background";
import SearchBar from "./components/SearchBar";
import ResultSection from "./components/ResultSection";
import Footer from "./components/Footer";
import api from "./utils/api";
import AuthScreen from "./components/AuthScreen";

const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "audit", label: "New Audit", icon: Plus },
  { id: "history", label: "Audit History", icon: Clock3 },
  { id: "compare", label: "Compare", icon: GitCompareArrows },
  { id: "reports", label: "Reports", icon: FileText },
];

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span>{title}</span>
        <span className={`stat-icon ${color}`}><Icon size={19} /></span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-subtitle">{subtitle}</div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon size={28} /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [page, setPage] = useState("overview");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedA, setSelectedA] = useState("");
  const [selectedB, setSelectedB] = useState("");
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await api.get("/history");
      setHistory(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not load audit history");
    } finally {
      setHistoryLoading(false);
    }
  };

useEffect(() => {
  let cancelled = false;

  api
    .get("/history")
    .then((response) => {
      if (!cancelled) {
        setHistory(response.data.data || []);
      }
    })
    .catch((error) => {
      if (!cancelled) {
        toast.error(
          error.response?.data?.error ||
            "Could not load audit history"
        );
      }
    })
    .finally(() => {
      if (!cancelled) {
        setHistoryLoading(false);
      }
    });

  return () => {
    cancelled = true;
  };
}, []);

  const auditWebsite = async () => {
    if (!url.trim()) {
      toast.error("Please enter a website URL");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await api.post("/audit", { url: url.trim() });
      setResult(response.data.data);
      await loadHistory();

      toast.success("Audit completed and saved!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Website audit failed");
    } finally {
      setLoading(false);
    }
  };

  const openAudit = async (id) => {
    try {
      const response = await api.get(`/history/${id}`);
      setResult(response.data.data.result);
      setUrl(response.data.data.url);
      setPage("audit");
      toast.success("Saved audit opened");
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not open audit");
    }
  };

  const deleteAudit = async (id) => {
    if (!window.confirm("Are you sure you want to delete this audit?")) return;

    try {
      await api.delete(`/history/${id}`);
      setHistory((previous) => previous.filter((item) => item._id !== id));
      toast.success("Audit deleted");
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not delete audit");
    }
  };

  const loadComparison = async () => {
    if (!selectedA || !selectedB) {
      toast.error("Select two audits to compare");
      return;
    }
    if (selectedA === selectedB) {
      toast.error("Choose two different audits");
      return;
    }

    try {
      const [first, second] = await Promise.all([
        api.get(`/history/${selectedA}`),
        api.get(`/history/${selectedB}`),
      ]);
      setCompareA(first.data.data);
      setCompareB(second.data.data);
    } catch {
      toast.error("Unable to load comparison");
    }
  };

  const stats = useMemo(() => {
    const total = history.length;
    const average = total
      ? Math.round(history.reduce((sum, item) => sum + item.seoScore, 0) / total)
      : 0;
    const good = history.filter((item) => item.seoScore >= 70).length;
    const latest = history[0]?.url
      ? new URL(history[0].url).hostname.replace("www.", "")
      : "No audits yet";

    return { total, average, good, latest };
  }, [history]);

  const exportJSON = (audit) => {
    const blob = new Blob([JSON.stringify(audit, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `page-pulse-${audit._id}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportCSV = () => {
    if (!history.length) {
      toast.error("No audit history to export");
      return;
    }

    const rows = [
      ["Website", "SEO Score", "SEO Grade", "Date"],
      ...history.map((item) => [
        item.url,
        item.seoScore,
        item.seoGrade,
        formatDate(item.createdAt),
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "page-pulse-audit-history.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("CSV report exported");
  };

  const changePage = (nextPage) => {
    setPage(nextPage);
    setMobileMenu(false);
    if (nextPage === "history" || nextPage === "overview" || nextPage === "reports") {
      loadHistory();
    }
  };

  const scoreColor = (score) =>
    score >= 80 ? "good" : score >= 50 ? "medium" : "poor";

  const renderOverview = () => (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow"><span className="live-dot" /> SEO INTELLIGENCE WORKSPACE</div>
          <h1>Good to see you again.</h1>
          <p>Track website health, discover SEO issues and improve your digital presence.</p>
        </div>
        <button className="primary-action" onClick={() => changePage("audit")}>
          <Plus size={17} /> Run new audit
        </button>
      </div>

      <div className="stats-grid">
        <StatCard title="Total audits" value={stats.total} subtitle="Saved in your workspace" icon={Activity} color="cyan" />
        <StatCard title="Average SEO score" value={`${stats.average}/100`} subtitle="Across saved audits" icon={Gauge} color="blue" />
        <StatCard title="Healthy websites" value={stats.good} subtitle="Score of 70 or above" icon={ShieldCheck} color="green" />
        <StatCard title="Latest website" value={stats.latest} subtitle="Most recently audited" icon={Globe} color="purple" />
      </div>

      <div className="content-grid">
        <section className="workspace-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">WORKSPACE</span>
              <h2>Quick website audit</h2>
              <p>Enter a URL to analyze its technical SEO health.</p>
            </div>
            <div className="panel-heading-icon"><Search size={21} /></div>
          </div>
          <SearchBar url={url} setUrl={setUrl} auditWebsite={auditWebsite} loading={loading} />
          <div className="feature-points">
            <span><CheckCircle2 size={15} /> On-page SEO checks</span>
            <span><CheckCircle2 size={15} /> Metadata analysis</span>
            <span><CheckCircle2 size={15} /> Broken link checks</span>
          </div>
        </section>

        <section className="workspace-panel activity-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">RECENT ACTIVITY</span>
              <h2>Latest audits</h2>
              <p>Your most recent website analyses.</p>
            </div>
            <button className="text-action" onClick={() => changePage("history")}>
              View all <ArrowUpRight size={15} />
            </button>
          </div>

          {history.length ? (
            <div className="recent-list">
              {history.slice(0, 4).map((item) => (
                <div className="recent-item" key={item._id}>
                  <div className="recent-favicon"><Globe size={17} /></div>
                  <div className="recent-info">
                    <strong>{new URL(item.url).hostname.replace("www.", "")}</strong>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <span className={`score-pill ${scoreColor(item.seoScore)}`}>{item.seoScore}</span>
                  <button className="icon-button" title="Open audit" onClick={() => openAudit(item._id)}>
                    <ChevronRight size={17} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Clock3} title="No audits yet" description="Your completed audits will appear here." />
          )}
        </section>
      </div>

      <section className="workspace-panel bottom-panel">
        <div className="bottom-feature-icon"><Trophy size={23} /></div>
        <div>
          <h3>Build a healthier website</h3>
          <p>Run regular audits, track your SEO score and use recommendations to prioritize improvements.</p>
        </div>
        <button className="action-button" onClick={() => changePage("compare")}>
          Compare audits <ChevronRight size={16} />
        </button>
      </section>
    </>
  );

  const renderAudit = () => (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">ANALYSIS WORKSPACE</div>
          <h1>Website audit</h1>
          <p>Analyze technical SEO signals and identify opportunities to improve.</p>
        </div>
        <button className="action-button" onClick={() => { setResult(null); setUrl(""); }}>
          <RefreshCw size={15} /> Clear workspace
        </button>
      </div>
      <section className="workspace-panel audit-search-panel">
        <SearchBar url={url} setUrl={setUrl} auditWebsite={auditWebsite} loading={loading} />
      </section>
      {result ? (
        <ResultSection result={result} />
      ) : (
        <EmptyState
          icon={Search}
          title="Ready to analyze your website?"
          description="Enter a website URL above. Page Pulse will check metadata, headings, mobile viewport, image accessibility and more."
        />
      )}
    </>
  );

  const renderHistory = () => (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR WORKSPACE</div>
          <h1>Audit history</h1>
          <p>Review, revisit and manage your saved website audits.</p>
        </div>
        <button className="action-button" onClick={loadHistory} disabled={historyLoading}>
          <RefreshCw size={15} className={historyLoading ? "spin" : ""} /> Refresh
        </button>
      </div>

      <section className="workspace-panel">
        <div className="table-toolbar">
          <div>
            <h2>Saved audits <span className="count-badge">{history.length}</span></h2>
            <p>Your latest 50 saved audits.</p>
          </div>
          <button className="action-button" onClick={exportCSV}><Download size={15} /> Export CSV</button>
        </div>

        {historyLoading ? (
          <div className="loading-state"><RefreshCw className="spin" /> Loading audit history...</div>
        ) : history.length ? (
          <div className="table-scroll">
            <table className="audit-table">
              <thead>
                <tr><th>Website</th><th>SEO score</th><th>Grade</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="website-cell">
                        <span className="recent-favicon"><Globe size={16} /></span>
                        <div><strong>{new URL(item.url).hostname.replace("www.", "")}</strong><small>{item.url}</small></div>
                      </div>
                    </td>
                    <td><span className={`score-pill ${scoreColor(item.seoScore)}`}>{item.seoScore}/100</span></td>
                    <td><span className={`grade-text ${scoreColor(item.seoScore)}`}>{item.seoGrade}</span></td>
                    <td className="date-cell">{formatDate(item.createdAt)}</td>
                    <td>
                      <div className="table-actions">
                        <button className="small-action" onClick={() => openAudit(item._id)}><ExternalLink size={14} /> View</button>
                        <button className="small-icon danger" title="Delete audit" onClick={() => deleteAudit(item._id)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={Clock3} title="No saved audits" description="Run your first website audit to start building your history." action={<button className="primary-action" onClick={() => changePage("audit")}><Plus size={16} /> New audit</button>} />
        )}
      </section>
    </>
  );

  const renderCompare = () => (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">PERFORMANCE REVIEW</div>
          <h1>Compare audits</h1>
          <p>Compare saved website audits and understand changes in SEO health.</p>
        </div>
      </div>

      <section className="workspace-panel">
        <div className="panel-heading">
          <div><span className="panel-kicker">COMPARISON SETUP</span><h2>Select two audits</h2><p>Choose two saved audits to compare their scores and checks.</p></div>
          <div className="panel-heading-icon"><GitCompareArrows size={21} /></div>
        </div>
        {history.length < 2 ? (
          <EmptyState icon={GitCompareArrows} title="Not enough audits to compare" description="Save at least two website audits before using comparison." action={<button className="primary-action" onClick={() => changePage("audit")}><Plus size={16} /> Run an audit</button>} />
        ) : (
          <>
            <div className="compare-select-grid">
              <label>First audit
                <select value={selectedA} onChange={(event) => setSelectedA(event.target.value)}>
                  <option value="">Choose an audit</option>
                  {history.map((item) => <option key={item._id} value={item._id}>{new URL(item.url).hostname} — {item.seoScore}/100</option>)}
                </select>
              </label>
              <label>Second audit
                <select value={selectedB} onChange={(event) => setSelectedB(event.target.value)}>
                  <option value="">Choose an audit</option>
                  {history.map((item) => <option key={item._id} value={item._id}>{new URL(item.url).hostname} — {item.seoScore}/100</option>)}
                </select>
              </label>
            </div>
            <button className="primary-action" onClick={loadComparison}><GitCompareArrows size={16} /> Compare selected audits</button>
          </>
        )}
      </section>

      {compareA && compareB && (
        <section className="workspace-panel compare-results">
          <div className="panel-heading"><div><span className="panel-kicker">RESULTS</span><h2>SEO score comparison</h2></div></div>
          <div className="compare-score-grid">
            {[compareA, compareB].map((audit) => (
              <div className="compare-score-card" key={audit._id}>
                <span>{new URL(audit.url).hostname}</span>
                <strong className={scoreColor(audit.seoScore)}>{audit.seoScore}<small>/100</small></strong>
                <span>{audit.seoGrade}</span>
                <small>{formatDate(audit.createdAt)}</small>
              </div>
            ))}
          </div>
          <div className="comparison-difference">
            Score difference: <strong>{Math.abs(compareA.seoScore - compareB.seoScore)} points</strong>
            {compareA.seoScore > compareB.seoScore ? " — First audit has the higher score." : compareB.seoScore > compareA.seoScore ? " — Second audit has the higher score." : " — Both audits have the same score."}
          </div>
          <div className="comparison-checks">
            <h3>Check-by-check comparison</h3>
            {compareA.result.checks.map((checkA) => {
              const checkB = compareB.result.checks.find((item) => item.id === checkA.id);
              return (
                <div className="comparison-row" key={checkA.id}>
                  <span>{checkA.name}</span>
                  <span className={checkA.status === "passed" ? "status-passed" : "status-warning"}>{checkA.status}</span>
                  <span className={checkB?.status === "passed" ? "status-passed" : "status-warning"}>{checkB?.status || "N/A"}</span>
                </div>
              );
            })}
            <div className="comparison-labels"><span>Check</span><span>First audit</span><span>Second audit</span></div>
          </div>
        </section>
      )}
    </>
  );

  const renderReports = () => (
    <>
      <div className="page-heading">
        <div><div className="eyebrow">DATA & EXPORTS</div><h1>Reports</h1><p>Export your audit history for offline review and documentation.</p></div>
      </div>
      <div className="report-grid">
        <div className="workspace-panel report-card">
          <div className="report-icon cyan"><FileText size={23} /></div>
          <h2>Audit history CSV</h2>
          <p>Download a spreadsheet-friendly report containing website URLs, SEO scores, grades and audit dates.</p>
          <button className="primary-action" onClick={exportCSV}><Download size={16} /> Export CSV</button>
        </div>
        <div className="workspace-panel report-card">
          <div className="report-icon blue"><Code2 size={23} /></div>
          <h2>Individual audit JSON</h2>
          <p>Download the complete technical audit data, including checks, recommendations and page metadata.</p>
          {history.length ? (
            <div className="report-audit-list">
              {history.slice(0, 5).map((item) => (
                <div key={item._id} className="report-audit-item">
                  <span>{new URL(item.url).hostname}</span>
                  <button className="small-action" onClick={async () => {
                    try {
                      const response = await api.get(`/history/${item._id}`);
                      exportJSON(response.data.data);
                    } catch {
                      toast.error("Could not export this audit");
                    }
                  }}><Download size={14} /> JSON</button>
                </div>
              ))}
            </div>
          ) : <p className="muted-note">Complete an audit to enable JSON exports.</p>}
        </div>
      </div>
      <section className="workspace-panel report-summary">
        <h2>Workspace summary</h2>
        <div className="report-summary-grid">
          <div><span>Total saved audits</span><strong>{stats.total}</strong></div>
          <div><span>Average SEO score</span><strong>{stats.average}/100</strong></div>
          <div><span>Score 70+</span><strong>{stats.good}</strong></div>
        </div>
      </section>
    </>
  );

  const pageTitles = {
    overview: "Overview",
    audit: "New Audit",
    history: "Audit History",
    compare: "Compare Audits",
    reports: "Reports",
  };

  return (
    <>
      <Background />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="app-shell">
        {mobileMenu && <button className="mobile-overlay" onClick={() => setMobileMenu(false)} aria-label="Close menu" />}
        <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
          <div className="brand">
            <div className="brand-mark"><Activity size={22} /></div>
            <div><strong>page<span>pulse</span></strong><small>SEO INTELLIGENCE</small></div>
            <button className="mobile-close" onClick={() => setMobileMenu(false)}><X size={19} /></button>
          </div>

          <div className="workspace-label">WORKSPACE</div>
          <nav className="side-nav">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button key={id} className={`nav-item ${page === id ? "active" : ""}`} onClick={() => changePage(id)}>
                <Icon size={18} /><span>{label}</span>{page === id && <span className="nav-active-dot" />}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="sidebar-status"><span className="live-dot" /><div><strong>System operational</strong><small>API connection active</small></div></div>
            <div className="profile-card">
              <div className="profile-avatar">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="profile-details">
                <strong>{user?.name || "User"}</strong>
                <small>{user?.email || "Personal workspace"}</small>
              </div>
              <button
                className="profile-logout"
                onClick={onLogout}
                title="Log out"
              >
                <Settings size={17} />
              </button>
            </div>
          </div>
        </aside>

        <main className="main-area">
          <header className="topbar">
            <div className="topbar-left">
              <button className="mobile-menu-button" onClick={() => setMobileMenu(true)}><Menu size={21} /></button>
              <span className="breadcrumb">Workspace</span><ChevronRight size={14} /><strong>{pageTitles[page]}</strong>
            </div>
            <div className="topbar-right">
              <span className="connection-indicator"><span className="live-dot" /> Connected</span>
              <div className="topbar-avatar">PP</div>
            </div>
          </header>

          <div className="page-content">
            {page === "overview" && renderOverview()}
            {page === "audit" && renderAudit()}
            {page === "history" && renderHistory()}
            {page === "compare" && renderCompare()}
            {page === "reports" && renderReports()}
            <Footer />
          </div>
        </main>
      </div>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("pagepulse_token");

      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch {
        localStorage.removeItem("pagepulse_token");
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifySession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("pagepulse_token");
    setUser(null);
    toast.success("You have been logged out.");
  };

  if (checkingAuth) {
    return (
      <div className="auth-loading">
        <Activity size={28} />
        <p>Preparing your workspace...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AuthScreen onAuthenticated={setUser} />
      </>
    );
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;

