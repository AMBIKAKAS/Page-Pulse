import {
  Activity,
  Clock3,
  FileText,
  Heading,
  Image,
  FileCode2,
  Copy,
  Download,
  CheckCircle2,
} from "lucide-react";

import { motion } from "framer-motion";
import MetricCard from "./MetricCard";

export default function ResultSection({ result }) {
  if (!result) return null;

  const copyJSON = () => {
    navigator.clipboard.writeText(
      JSON.stringify(result, null, 2)
    );

    alert("JSON copied successfully!");
  };

  const downloadJSON = () => {
    const blob = new Blob(
      [JSON.stringify(result, null, 2)],
      {
        type: "application/json",
      }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "page-pulse-report.json";

    link.click();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-20"
    >
      {/* Heading */}

      <div className="mb-10 flex items-center justify-between">

        <div>

          <h2 className="text-4xl font-bold text-white">
            Audit Report
          </h2>

          <p className="mt-2 text-slate-400">
            Website analysis completed successfully.
          </p>

        </div>

        <div className="hidden rounded-full border border-green-500/30 bg-green-500/10 px-5 py-3 text-green-400 md:flex md:items-center md:gap-2">

          <CheckCircle2 size={18} />

          Success

        </div>

      </div>

      {/* Cards */}

      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">

        <MetricCard
          title="HTTP Status"
          value={result.status}
          icon={<Activity size={28} />}
          color="from-green-500 to-emerald-600"
        />

        <MetricCard
          title="Response Time"
          value={result.responseTime}
          icon={<Clock3 size={28} />}
          color="from-blue-500 to-cyan-600"
        />

        <MetricCard
          title="Page Title"
          value={result.title}
          icon={<FileText size={28} />}
          color="from-violet-500 to-purple-600"
        />

        <MetricCard
          title="Meta Description"
          value={result.metaDescription}
          icon={<FileCode2 size={28} />}
          color="from-pink-500 to-rose-600"
        />

        <MetricCard
          title="H1 Count"
          value={result.h1Count}
          icon={<Heading size={28} />}
          color="from-orange-500 to-red-500"
        />

        <MetricCard
          title="Images Missing Alt"
          value={result.imagesMissingAlt}
          icon={<Image size={28} />}
          color="from-yellow-500 to-orange-500"
        />

        <MetricCard
          title="Word Count"
          value={result.wordCount}
          icon={<FileText size={28} />}
          color="from-indigo-500 to-blue-700"
        />

      </div>

      {/* Buttons */}

      <div className="mt-12 flex flex-wrap justify-center gap-5">

        <button
          onClick={copyJSON}
          className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-7 py-4 text-white transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-slate-800"
        >
          <Copy size={18} />

          Copy JSON

        </button>

        <button
          onClick={downloadJSON}
          className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/50"
        >
          <Download size={18} />

          Download Report

        </button>

      </div>
    </motion.section>
  );
}