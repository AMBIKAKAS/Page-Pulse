import { motion } from "framer-motion";
import { Search, Globe, Loader2 } from "lucide-react";

export default function SearchBar({
  url,
  setUrl,
  auditWebsite,
  loading,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mx-auto mb-20 max-w-6xl"
    >
      <div className="rounded-[32px] border border-slate-700/70 bg-slate-900/70 p-3 shadow-2xl backdrop-blur-2xl">

        <div className="flex flex-col gap-4 lg:flex-row">

          {/* Input */}

          <div className="flex flex-1 items-center rounded-2xl border border-slate-700 bg-slate-950/80 px-6 transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-lg focus-within:shadow-cyan-500/20">

            <Globe
              size={22}
              className="mr-4 text-cyan-400"
            />

            <input
              type="text"
              placeholder="https://github.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-16 w-full bg-transparent text-lg text-white outline-none placeholder:text-slate-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  auditWebsite();
                }
              }}
            />

          </div>

          {/* Button */}

          <button
            onClick={auditWebsite}
            disabled={loading}
            className="group flex h-16 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 px-10 font-bold text-white shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (
              <>
                <Loader2
                  className="animate-spin"
                  size={20}
                />

                Analyzing...
              </>
            ) : (
              <>
                <Search size={20} />

                Analyze Website
              </>
            )}

          </button>

        </div>

      </div>

      <p className="mt-5 text-center text-sm text-slate-500">
        Try:
        <span className="ml-2 text-cyan-400">
          https://github.com
        </span>

        <span className="mx-3 text-slate-700">•</span>

        <span className="text-cyan-400">
          https://example.com
        </span>

        <span className="mx-3 text-slate-700">•</span>

        <span className="text-cyan-400">
          https://stackoverflow.com
        </span>
      </p>

    </motion.div>
  );
}