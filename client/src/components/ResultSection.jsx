import {
  Activity, Clock3, FileText, Heading, Image,
  Globe, ShieldCheck, AlertTriangle, CheckCircle2,
  XCircle, Copy, Download, ExternalLink, Search,
  Link2, Smartphone, Languages, Tags
} from "lucide-react";
import { motion } from "framer-motion";
import MetricCard from "./MetricCard";
import { toast } from "react-hot-toast";

export default function ResultSection({ result }) {
  if (!result) return null;

  const checks = result.checks || [];
  const recommendations = result.recommendations || [];
  const brokenLinks = result.brokenLinks?.results || [];

  const score = Number(result.seoScore) || 0;
  const passed = checks.filter((item) => item.status === "passed").length;
  const warnings = checks.filter((item) => item.status === "warning").length;

  const grade = result.seoGrade || "Not rated";
  const gradeColor =
    score >= 90 ? "#34d399" :
    score >= 70 ? "#22d3ee" :
    score >= 50 ? "#fbbf24" : "#fb7185";

  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      toast.success("Report copied!");
    } catch {
      toast.error("Unable to copy report");
    }
  };

  const downloadFile = (content, type, filename) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    downloadFile(
      JSON.stringify(result, null, 2),
      "application/json",
      "page-pulse-seo-report.json"
    );
    toast.success("JSON report downloaded");
  };

  const downloadCSV = () => {
    const rows = [
      ["SEO Check", "Status", "Weight", "Details", "Recommendation"],
      ...checks.map((item) => [
        item.name,
        item.status,
        item.weight,
        item.details,
        item.recommendation || ""
      ])
    ];

    const csv = rows
      .map((row) =>
        row.map((value) =>
          `"${String(value ?? "").replace(/"/g, '""')}"`
        ).join(",")
      )
      .join("\n");

    downloadFile(csv, "text/csv;charset=utf-8;", "page-pulse-seo-report.csv");
    toast.success("CSV report downloaded");
  };

  const statusIcon = (status) => {
    if (status === "passed") {
      return <CheckCircle2 className="text-emerald-400" size={19} />;
    }
    return <AlertTriangle className="text-amber-400" size={19} />;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-20 space-y-10"
      id="audit-report"
    >
      {/* Report heading */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            <Activity size={16} />
            Analysis complete
          </div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            SEO Audit Report
          </h2>
          <a
            href={result.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex max-w-full items-center gap-2 break-all text-sm text-slate-400 transition hover:text-cyan-300"
          >
            <Globe size={15} />
            {result.url}
            <ExternalLink size={13} />
          </a>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={copyJSON} className="action-button">
            <Copy size={16} /> Copy JSON
          </button>
          <button onClick={downloadCSV} className="action-button">
            <FileText size={16} /> Export CSV
          </button>
          <button onClick={downloadJSON} className="primary-action">
            <Download size={16} /> Download Report
          </button>
        </div>
      </div>

      {/* Score overview */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_2fr]">
        <div className="dashboard-panel flex flex-col items-center justify-center p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Overall SEO score
          </p>

          <div
            className="score-ring mt-7"
            style={{
              "--score": `${score * 3.6}deg`,
              "--score-color": gradeColor
            }}
          >
            <div className="score-ring-inner">
              <span className="text-5xl font-bold text-white">{score}</span>
              <span className="mt-1 text-xs uppercase tracking-widest text-slate-500">
                out of 100
              </span>
            </div>
          </div>

          <div
            className="mt-6 rounded-full px-5 py-2 text-sm font-bold"
            style={{
              color: gradeColor,
              backgroundColor: `${gradeColor}18`,
              border: `1px solid ${gradeColor}55`
            }}
          >
            {grade}
          </div>

          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
            Your score is based on the technical and on-page SEO checks performed on this page.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCard
            title="Checks Passed"
            value={`${passed}/${checks.length}`}
            icon={<CheckCircle2 size={25} />}
            color="from-emerald-500 to-green-600"
          />
          <MetricCard
            title="Warnings"
            value={warnings}
            icon={<AlertTriangle size={25} />}
            color="from-amber-500 to-orange-600"
          />
          <MetricCard
            title="HTTP Status"
            value={result.status ?? "N/A"}
            icon={<ShieldCheck size={25} />}
            color="from-cyan-500 to-blue-600"
          />
          <MetricCard
            title="Response Time"
            value={result.responseTime || "N/A"}
            icon={<Clock3 size={25} />}
            color="from-violet-500 to-purple-600"
          />
        </div>
      </div>

      {/* SEO checks */}
      <div className="dashboard-panel p-6 md:p-8">
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-xl font-bold text-white">SEO Health Checks</h3>
            <p className="mt-1 text-sm text-slate-400">
              Detailed breakdown of your website's SEO performance
            </p>
          </div>
          <span className="rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-xs font-semibold text-slate-300">
            {checks.length} checks performed
          </span>
        </div>

        <div className="space-y-3">
          {checks.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035 }}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="flex gap-3">
                  <div className="mt-0.5">{statusIcon(item.status)}</div>
                  <div>
                    <h4 className="font-semibold text-slate-100">{item.name}</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {item.details}
                    </p>
                  </div>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                  item.status === "passed"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-amber-500/10 text-amber-400"
                }`}>
                  {item.status === "passed" ? "PASSED" : "NEEDS ATTENTION"}
                </span>
              </div>

              {item.recommendation && (
                <div className="ml-8 mt-3 rounded-lg border border-amber-500/10 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
                  <span className="font-semibold">Recommendation: </span>
                  {item.recommendation}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="dashboard-panel p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
            <Search size={21} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Actionable Recommendations</h3>
            <p className="mt-1 text-sm text-slate-400">
              Improvements you can make to strengthen your SEO
            </p>
          </div>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((item, index) => (
              <div
                key={`${item.category}-${index}`}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    {item.category}
                  </span>
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                    {item.priority || "Improve"}
                  </span>
                </div>
                <h4 className="font-semibold text-white">{item.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center text-emerald-300">
            Great work! No outstanding recommendations were returned.
          </div>
        )}
      </div>

      {/* Website metadata */}
      <div className="dashboard-panel p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white">Website Overview</h3>
          <p className="mt-1 text-sm text-slate-400">
            Important metadata and content information extracted from the page
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard icon={<FileText size={18} />} label="Page Title" value={result.title || "Not found"} />
          <InfoCard icon={<Tags size={18} />} label="Meta Description" value={result.metaDescription || "Not found"} />
          <InfoCard icon={<Heading size={18} />} label="H1 Headings" value={result.h1Count ?? result.headings?.h1 ?? 0} />
          <InfoCard icon={<Image size={18} />} label="Images" value={result.images ?? 0} />
          <InfoCard icon={<Image size={18} />} label="Images Missing ALT" value={result.imagesMissingAlt ?? 0} />
          <InfoCard icon={<FileText size={18} />} label="Word Count" value={result.wordCount ?? 0} />
          <InfoCard icon={<Link2 size={18} />} label="Total Links" value={result.totalLinks ?? result.links?.length ?? 0} />
          <InfoCard icon={<Smartphone size={18} />} label="Viewport" value={result.viewport || "Not found"} />
          <InfoCard icon={<Languages size={18} />} label="HTML Language" value={result.language || "Not found"} />
        </div>
      </div>

      {/* Broken links */}
      <div className="dashboard-panel p-6 md:p-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-xl font-bold text-white">Broken Link Analysis</h3>
            <p className="mt-1 text-sm text-slate-400">
              Link verification results from the audit
            </p>
          </div>
          <div className="flex gap-3 text-xs font-semibold">
            <span className="rounded-full bg-slate-800 px-3 py-2 text-slate-300">
              Checked: {result.brokenLinks?.checked ?? 0}
            </span>
            <span className="rounded-full bg-rose-500/10 px-3 py-2 text-rose-300">
              Broken: {result.brokenLinks?.broken ?? 0}
            </span>
          </div>
        </div>

        {brokenLinks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-3">URL</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Result</th>
                </tr>
              </thead>
              <tbody>
                {brokenLinks.map((link, index) => (
                  <tr key={index} className="border-b border-slate-800/70">
                    <td className="max-w-sm truncate px-3 py-4 text-slate-300">
                      {link.url}
                    </td>
                    <td className="px-3 py-4 text-slate-400">
                      {link.status || "N/A"}
                    </td>
                    <td className="px-3 py-4">
                      {(() => {
                        const code = Number(link.status);
                        const isBroken = Number.isFinite(code) && code >= 400;
                        const isRedirect = Number.isFinite(code) && code >= 300 && code < 400;
                        const isWorking = Number.isFinite(code) && code >= 200 && code < 300;

                        const label = isBroken
                          ? "Broken"
                          : isRedirect
                            ? "Redirected"
                            : isWorking
                              ? "Working"
                              : "Unverified";

                        const color = isBroken
                          ? "text-rose-400"
                          : isWorking || isRedirect
                            ? "text-emerald-400"
                            : "text-amber-400";

                        return (
                          <span className={`inline-flex items-center gap-2 ${color}`}>
                            {isBroken
                              ? <XCircle size={15} />
                              : <CheckCircle2 size={15} />}
                            {label}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
            <CheckCircle2 className="mx-auto mb-3 text-emerald-400" size={28} />
            <p className="font-semibold text-emerald-300">No confirmed broken links found</p>
            <p className="mt-1 text-sm text-slate-400">
              {result.brokenLinks?.checked
                ? `${result.brokenLinks.checked} links were checked.`
                : "No links were available to verify on this page."}
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-3 flex items-center gap-2 text-cyan-400">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
      </div>
      <p className="break-words text-sm font-medium leading-6 text-slate-200">
        {String(value)}
      </p>
    </div>
  );
}
